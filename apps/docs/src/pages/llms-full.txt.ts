import type { APIRoute } from 'astro';

import { componentPages, docMarkdown, docsPages, SITE_SUMMARY } from '../lib/llms';

/**
 * `/llms-full.txt`: every docs page as Markdown, then every component's Markdown page, in one
 * file a model can read whole.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://wideset.co');
  const { all } = await docsPages();
  const separator = '\n\n---\n\n';

  const body = [
    `# Wideset\n\n> ${SITE_SUMMARY}`,
    ...all.map((page) => docMarkdown(page, base)),
    ...componentPages().map(({ markdown }) => markdown()),
  ].join(separator);

  return new Response(`${body}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
