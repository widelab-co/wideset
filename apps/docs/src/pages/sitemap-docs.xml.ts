import { execFileSync } from 'node:child_process';

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

import { entries } from '../lib/catalog';

/**
 * The documentation's flat sitemap (site contract): a <urlset> the edge merges with the
 * landing's into wideset.co/sitemap.xml. Only indexable pages: a component without a description
 * is `noindex` (DocsLayout) and stays out until it has one. `lastmod` is the last commit that
 * touched the page's source (the guide's file, the component's folder), not the build time.
 */
const lastCommit = (path: string) => {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', path], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return date || null;
  } catch {
    return null;
  }
};

const url = (loc: string, lastmod: string | null) =>
  `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`;

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://wideset-docs.widelab.workers.dev');
  const docs = await getCollection('docs');
  const lines = [
    ...docs
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((entry) =>
        url(
          new URL(`/docs/${entry.id}`, base).href,
          entry.filePath ? lastCommit(entry.filePath) : null,
        ),
      ),
    url(new URL('/components', base).href, null),
    ...entries
      .filter((entry) => entry.description)
      .map((entry) =>
        url(
          new URL(`/components/${entry.id}`, base).href,
          lastCommit(`../../packages/design-system/src/components/${entry.examples.split('/')[0]}`),
        ),
      ),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
