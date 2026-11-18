import type { APIRoute } from 'astro';

import graph from '../generated/graph.json';
import tokenUsage from '../generated/token-usage.json';

/**
 * `/graph.json`: the design system as one graph for a model or a tool. Components and how they
 * meet (`uses`: built from, `with`: shown together), every token a component paints with by
 * variant and state, and every token with its light and dark primitive and the components it
 * would change. All of it is generated from the library (gen-graph, gen-token-usage).
 */
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      components: graph.nodes,
      edges: graph.edges,
      componentTokens: tokenUsage.components,
      tokens: tokenUsage.tokens,
    }),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } },
  );
