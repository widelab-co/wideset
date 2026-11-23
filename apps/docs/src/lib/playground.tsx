import { type ComponentType, type ReactNode, Suspense, use, useSyncExternalStore } from 'react';

import pages from '../generated/pages.json';
import { hasControls, playground, type PlaygroundDefinition, type Values } from './playground-kit';

export type { Control, PlaygroundDefinition, Values } from './playground-kit';

/**
 * The playgrounds, and the store that keeps the stage, the code block, the rail and the
 * gallery thumbnail in step. Every component page has one: its stage is the library's
 * `src/components/<folder>/examples/<id>/default.tsx`, its controls come from the props type,
 * and `src/playgrounds/<id>.tsx` tunes it where the types do not say enough. A definition is
 * data plus two functions: the controls (which the rail renders without knowing the
 * component), `render` (what the stage shows for the current values) and `code` (the snippet
 * for exactly what is on the stage).
 *
 * The stage and the rail are separate islands in separate columns, so React context cannot
 * reach between them; a module-level store shared by both roots can.
 *
 * The browser loads one component's playground, the one its page shows: the server renders
 * every page and loads them all before the first one. An island that reads a playground goes
 * through `withPlayground`, which suspends until it has loaded; on a page that names its
 * playgrounds (see below) it never has to.
 */
const PAGES = pages as Record<string, { examples: string; props?: string }>;
const ownModules = import.meta.glob<{ default: PlaygroundDefinition }>('../playgrounds/*.tsx');

/**
 * Each component's `examples/<id>/default.tsx` in the library: one typical instance whose root
 * takes the rail's props. A playground without its own `render` shows it; a component with no
 * playground file gets one from it, its controls generated from the root props type.
 */
const COMPONENTS = '../../../../packages/design-system/src/components/';
const defaultModules = import.meta.glob<{
  default: React.ComponentType<Record<string, unknown>>;
}>('../../../../packages/design-system/src/components/*/examples/*/default.tsx');
const defaultSources = import.meta.glob<string>(
  '../../../../packages/design-system/src/components/*/examples/*/default.tsx',
  { query: '?raw', import: 'default' },
);
const stageOf = (id: string) => `${COMPONENTS}${PAGES[id].examples}/default.tsx`;
for (const [id, page] of Object.entries(PAGES)) {
  if (!defaultModules[stageOf(id)])
    throw new Error(
      `playground: /components/${id} has no stage; add src/components/${page.examples}/default.tsx`,
    );
}

/** The playgrounds loaded so far: all of them on the server, the page's own in the browser. */
export const PLAYGROUNDS: Record<string, PlaygroundDefinition> = {};

const loading = new Map<string, Promise<PlaygroundDefinition>>();
const loadPlayground = (id: string) => {
  if (!loading.has(id)) {
    loading.set(
      id,
      Promise.all([
        ownModules[`../playgrounds/${id}.tsx`]?.(),
        defaultModules[stageOf(id)](),
        defaultSources[stageOf(id)](),
      ]).then(([own, stage, source]) => {
        const page = PAGES[id];
        const definition =
          own?.default ?? playground({ from: hasControls(page.props) ? page.props! : [] });
        definition.example = {
          Component: stage.default,
          source: source.replace(/^\/\*\*[\s\S]*?\*\/\s*/, ''),
        };
        PLAYGROUNDS[id] = definition;
        return definition;
      }),
    );
  }
  return loading.get(id)!;
};

// The server renders every page, so it loads every playground. In the browser a page names the
// ones it shows (`data-playground` on the component page's stage, on each gallery card); this
// module waits for them, and with it every island that reads them, so they hydrate with them in
// hand. Suspending during hydration instead would not keep the server HTML: @astrojs/react
// calls `root.render` straight after `hydrateRoot`, and that update makes React drop the
// markup and render the island again.
const shown = import.meta.env.SSR
  ? Object.keys(PAGES)
  : [...document.querySelectorAll<HTMLElement>('[data-playground]')]
      .map((el) => el.dataset.playground!)
      .filter((id) => id in PAGES);
await Promise.all(shown.map(loadPlayground));

export const hasPlayground = (id: string) => id in PAGES;

const Loaded = ({ id, children }: { id: string; children: ReactNode }) => {
  if (!PLAYGROUNDS[id]) use(loadPlayground(id));
  return children;
};

/**
 * An island that reads `PLAYGROUNDS[component]`: it renders once that playground has loaded.
 * A page names the playgrounds it shows, so they have always loaded by the time its islands
 * hydrate; the Suspense path is for one that a page forgot to name.
 */
export const withPlayground = <P extends { component: string }>(Island: ComponentType<P>) => {
  // No boundary once it is loaded, which is always on the server: React streams a boundary
  // with a large stage (Checkbox Group, Pagination) out of line and swaps it in by script, so
  // the stage would blink even though nothing suspended.
  const WithPlayground = (props: P) =>
    hasPlayground(props.component) && !PLAYGROUNDS[props.component] ? (
      <Suspense fallback={null}>
        <Loaded id={props.component}>
          <Island {...props} />
        </Loaded>
      </Suspense>
    ) : (
      <Island {...props} />
    );
  return WithPlayground;
};

// --- the shared store ---------------------------------------------------------

const states = new Map<string, Values>();
const listeners = new Map<string, Set<() => void>>();
const current = (id: string) => states.get(id) ?? PLAYGROUNDS[id].defaults;
const emit = (id: string) => listeners.get(id)?.forEach((listener) => listener());

export const setValues = (id: string, patch: Values) => {
  states.set(id, { ...current(id), ...patch });
  emit(id);
};
export const resetValues = (id: string) => {
  states.delete(id);
  emit(id);
};

const subscribe = (id: string) => (listener: () => void) => {
  if (!listeners.has(id)) listeners.set(id, new Set());
  listeners.get(id)!.add(listener);
  return () => listeners.get(id)?.delete(listener);
};

export const subscribeValues = (id: string, listener: (values: Values) => void) =>
  subscribe(id)(() => listener(current(id)));

export const useValues = (id: string) =>
  useSyncExternalStore(
    subscribe(id),
    () => current(id),
    () => PLAYGROUNDS[id].defaults,
  );
