/**
 * Everything the site derives from the library, in dependency order. Runs before dev,
 * build and typecheck; the outputs in src/generated are never committed.
 */
await import('./gen-props.mjs');
await import('./gen-catalog.mjs');
await import('./gen-graph.mjs');
await import('./gen-guidance.mjs');
await import('./gen-registry.mjs');
await import('./gen-light-scope.mjs');
await import('./gen-tokens.mjs');
await import('./gen-token-scales.mjs');

const { join } = await import('node:path');
const { writeAgentSkills } = await import('./gen-agent-skills.mjs');
const { docs } = await import('./paths.mjs');
writeAgentSkills(join(docs, 'public', '.well-known', 'agent-skills'));
