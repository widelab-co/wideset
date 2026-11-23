import type { APIRoute } from 'astro';

import { relationships } from '../lib/catalog';
import { tokenUsage } from '../lib/tokenUsage';

/** Bumped when a key or its meaning changes: the readers are models and tools, not people. */
const VERSION = 1;

/**
 * `/graph.json`: the design system as one graph for a model or a tool. Components and how they
 * meet (`uses`: built from, `with`: shown together, from scripts/gen-graph.mjs), every token
 * class each component paints with by part, variant and state (src/lib/tokenUsage.ts), and every
 * token with its light and dark value and the components it would change.
 *
 * Keys are for machines: states are `hover`, `disabled`, `state:open`, never the labels the
 * Anatomy tab shows.
 */
export const GET: APIRoute = () => {
  const { components, tokens } = tokenUsage();
  return new Response(
    JSON.stringify({
      version: VERSION,
      components: relationships.nodes,
      edges: relationships.edges,
      componentTokens: components,
      tokens,
    }),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
};
