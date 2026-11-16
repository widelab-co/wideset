import type { APIRoute } from 'astro';

import { blocksMarkdown } from '../lib/blocks';

/** `/blocks.md`: the directions and every starting point, for a model. */
export const GET: APIRoute = ({ site }) =>
  new Response(blocksMarkdown(site ?? new URL('https://wideset.co')), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
