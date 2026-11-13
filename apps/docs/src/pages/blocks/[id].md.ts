import type { APIRoute } from 'astro';

import { blockById, blockMarkdown, ENTRIES } from '../../lib/blocks';

/** `/blocks/<id>.md`: one starting point with every file to copy. */
export function getStaticPaths() {
  return ENTRIES.map((block) => ({ params: { id: block.id } }));
}

export const GET: APIRoute = ({ params, site }) =>
  new Response(blockMarkdown(blockById(params.id!)!, site ?? new URL('https://wideset.co')), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
