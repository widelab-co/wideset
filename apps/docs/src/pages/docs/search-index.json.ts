import type { APIRoute } from 'astro';

import { searchItems } from '../../lib/search';

/**
 * Every page and component the docs search lists, as JSON (site contract). Other parts of
 * wideset.co, such as the landing, can offer the same search without building the docs.
 */
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await searchItems()), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
