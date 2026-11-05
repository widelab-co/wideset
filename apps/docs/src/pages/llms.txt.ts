import type { APIRoute } from 'astro';

import { componentPages, componentUrl, docsPages, docUrl, SITE_SUMMARY } from '../lib/llms';

/**
 * `/llms.txt` (https://llmstxt.org): the site in one short file for a model, every docs page
 * and every component's Markdown page with a line on what it covers.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://wideset-docs.widelab.workers.dev');
  const { top, groups } = await docsPages();
  const link = (title: string, url: string, description?: string | null) =>
    `- [${title}](${url})${description ? `: ${description}` : ''}`;
  const docLines = (pages: typeof top) =>
    pages.map((page) => link(page.data.title, `${docUrl(page, base)}.md`, page.data.description));

  const body = [
    '# Wideset',
    `> ${SITE_SUMMARY}`,
    [
      'Every page has a Markdown version at its URL plus `.md`; a component page (`/components/<id>.md`) has usage guidance (when to use it, when not, what breaks), install, import, parts, examples, props, the `ws` classes it paints with by variant and state, and its related components.',
      `The whole system as one graph (components, how they meet, the tokens each paints with, the components each token changes): ${new URL('/graph.json', base).href}`,
      `Everything below in one file: ${new URL('/llms-full.txt', base).href}`,
    ].join('\n'),
    `## Docs\n\n${docLines(top).join('\n')}`,
    ...groups.map((group) => `## ${group.label}\n\n${docLines(group.pages).join('\n')}`),
    `## Components\n\n${componentPages()
      .map(({ entry }) =>
        link(entry.title, `${componentUrl(entry.id, base)}.md`, entry.description),
      )
      .join('\n')}`,
  ].join('\n\n');

  return new Response(`${body}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
