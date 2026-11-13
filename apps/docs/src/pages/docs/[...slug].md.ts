import type { APIRoute } from 'astro';

import { docMarkdown, docsPages } from '../../lib/llms';

/** Every docs page as plain Markdown at `/docs/<page>.md`, like the component pages' `.md`. */
export async function getStaticPaths() {
  const { all } = await docsPages();
  return all.map((page) => ({ params: { slug: page.id }, props: { page } }));
}

export const GET: APIRoute = ({ props, site }) =>
  new Response(docMarkdown(props.page, site ?? new URL('https://wideset.co')), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
