import { useSyncExternalStore } from 'react';

/**
 * Where the code samples import components from: the reader's own project after
 * `npx wideset add` (the default, as the docs install with the CLI), or the npm package. One
 * choice for the whole site, remembered in the browser; every code block with a component import
 * follows it.
 */
export type ImportSource = 'package' | 'project';

const KEY = 'wideset-docs-import-source';
/** Each Astro island has its own copy of this module, so a change reaches the others as an event. */
const CHANGE = 'wideset-import-source';

const read = (): ImportSource => {
  try {
    return localStorage.getItem(KEY) === 'package' ? 'package' : 'project';
  } catch {
    // Storage unavailable: the choice lasts for this page only.
    return document.documentElement.dataset.importSource === 'package' ? 'package' : 'project';
  }
};

export const setImportSource = (source: ImportSource) => {
  document.documentElement.dataset.importSource = source;
  try {
    localStorage.setItem(KEY, source);
  } catch {
    // Kept on the page above.
  }
  dispatchEvent(new Event(CHANGE));
};

const subscribe = (listener: () => void) => {
  const onStorage = (event: StorageEvent) => event.key === KEY && listener();
  addEventListener(CHANGE, listener);
  addEventListener('storage', onStorage);
  return () => {
    removeEventListener(CHANGE, listener);
    removeEventListener('storage', onStorage);
  };
};

export const useImportSource = () =>
  useSyncExternalStore(subscribe, read, () => 'project' as ImportSource);

export const PACKAGE = '@wideset/react';

/** `{ Button: '@/components/ui/wideset/button/Button' }`: where each export lives once scaffolded. */
export type ProjectPaths = Record<string, string>;

/** The name a specifier imports: `type ToastStatus` → `ToastStatus`, `A as B` → `A`. */
const nameOf = (specifier: string) => specifier.replace(/^type\s+/, '').split(/\s+as\s+/)[0];
const byName = (a: string, b: string) => {
  const [x, y] = [nameOf(a), nameOf(b)];
  return x < y ? -1 : x > y ? 1 : 0;
};

/**
 * Import lines for these specifiers (`Toast`, `type ToastStatus`), from the package or grouped
 * by their scaffolded file. `typeOnly` writes `import type { … }`.
 */
export const importLines = (
  specifiers: string[],
  source: ImportSource,
  paths: ProjectPaths,
  typeOnly = false,
) => {
  const sorted = [...new Set(specifiers)].sort(byName);
  if (!sorted.length) return [];
  const keyword = typeOnly ? 'import type' : 'import';
  if (source === 'package') return [`${keyword} { ${sorted.join(', ')} } from '${PACKAGE}';`];
  const byPath = new Map<string, string[]>();
  for (const specifier of sorted) {
    const path = paths[nameOf(specifier)] ?? PACKAGE;
    byPath.set(path, [...(byPath.get(path) ?? []), specifier]);
  }
  return [...byPath].map(([path, list]) => `${keyword} { ${list.join(', ')} } from '${path}';`);
};

/**
 * The same code with its package import rewritten for the chosen source, `import type` and
 * `type` specifiers included. Code that does not import the package is returned as it is.
 */
export const withImportSource = (code: string, source: ImportSource, paths: ProjectPaths) => {
  if (source === 'package') return code;
  const pattern = new RegExp(`import\\s*(type\\s+)?\\{([^}]*)\\}\\s*from\\s*'${PACKAGE}';?`, 'g');
  return code.replace(pattern, (_, typeOnly: string | undefined, list: string) =>
    importLines(
      list
        .split(',')
        .map((specifier) => specifier.trim())
        .filter(Boolean),
      source,
      paths,
      Boolean(typeOnly),
    ).join('\n'),
  );
};
