/*
  Where the Wideset registry lives and what it holds. The registry is the static JSON the
  design-system repo builds (`pnpm build:registry`) and the docs site serves under `/r`; this CLI
  only reads its index and hands item addresses to the shadcn CLI.
*/

export const DEFAULT_REGISTRY = 'https://wideset-docs.widelab.workers.dev/r';
export const NAMESPACE = '@wideset';

export class CliError extends Error {}

// Accepts `https://host/r`, `https://host/r/` or the components.json form
// `https://host/r/{name}.json` and returns the base without a trailing slash.
export function registryBase(input) {
  const base = input
    .trim()
    .replace(/\/\{name\}\.json$/, '')
    .replace(/\/+$/, '');
  if (!/^https?:\/\/[^/]/.test(base)) {
    throw new CliError(`Registry URL must start with http:// or https://, got "${input}".`);
  }
  return base;
}

export const registryTemplate = (base) => `${registryBase(base)}/{name}.json`;

// Components are what people ask for by name; everything else (styles, utils, motion, …) comes
// along as a dependency or is added by `init`.
export const isComponent = (item) => item.type === 'registry:ui';

export async function fetchIndex(base, fetchImpl = globalThis.fetch) {
  const url = `${registryBase(base)}/registry.json`;
  let response;
  try {
    response = await fetchImpl(url);
  } catch (err) {
    throw new CliError(`Could not reach the Wideset registry at ${url} (${err.message}).`);
  }
  if (!response.ok) {
    throw new CliError(`The Wideset registry at ${url} answered ${response.status}.`);
  }
  const index = await response.json();
  if (!Array.isArray(index?.items)) {
    throw new CliError(`${url} is not a registry index (no "items" array).`);
  }
  return index;
}

// Small edit distance, enough to turn `buton` into "did you mean button?".
function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const next = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = next;
    }
  }
  return row[b.length];
}

export function suggest(name, known) {
  const best = known
    .map((candidate) => ({ candidate, score: distance(name, candidate) }))
    .sort((x, y) => x.score - y.score)[0];
  return best && best.score <= Math.max(2, Math.floor(name.length / 3)) ? best.candidate : null;
}
