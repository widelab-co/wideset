import catalog from '../generated/catalog.json';
import graph from '../generated/graph.json';
import propsData from '../generated/props.json';

/**
 * The catalogue as the pages read it. Everything comes from scripts/generate.mjs, which
 * reads it out of the library.
 */
export type Entry = {
  id: string;
  title: string;
  component: string;
  /** The Storybook `title`, e.g. `Components/Button/Button`. */
  storyTitle: string;
  /** The stories file, from the library root: `src/components/button/Button.stories.tsx`. */
  storyFile: string;
  /** The examples folder, from src/components: `button/examples/icon-button`. */
  examples: string;
  description: string | null;
  exports: string[];
  propTypes: string[];
  sourceFiles: string[];
  /** The version it first shipped in, from git; absent without the history. */
  since?: string;
};

export type PropRow = {
  name: string;
  type: string;
  required: boolean;
  source: 'own' | 'variant';
  description?: string;
  defaultValue?: string;
};
export type PropTable = {
  component: string;
  file: string;
  /** The JSDoc on the props type. */
  summary?: string;
  /** What the part renders: `<button>`, `Radix Dialog.Content`. */
  element?: string;
  props: PropRow[];
  inheritsFrom: string[];
};

export type Graph = {
  nodes: { id: string; title: string }[];
  edges: { from: string; to: string; kind: 'uses' | 'with' }[];
};

export const entries = catalog as Entry[];
export const relationships = graph as Graph;
export const props = propsData as Record<string, PropTable>;

export const entryById = (id: string) => entries.find((entry) => entry.id === id);

/**
 * A component's neighbours in the graph (scripts/gen-graph.mjs), by what the edge says: the
 * components it is built with, the ones built with it, and the ones it appears beside in a story
 * or an example. Each list A–Z, only components that have a page.
 */
export const relationsOf = (id: string) => {
  const list = (ids: string[]) =>
    [...new Set(ids)]
      .map((other) => entryById(other))
      .filter((entry): entry is Entry => Boolean(entry))
      .sort((a, b) => a.title.localeCompare(b.title));
  const { edges } = relationships;
  return {
    builtWith: list(edges.filter((e) => e.kind === 'uses' && e.from === id).map((e) => e.to)),
    usedBy: list(edges.filter((e) => e.kind === 'uses' && e.to === id).map((e) => e.from)),
    appearsWith: list(
      edges
        .filter((e) => e.kind === 'with' && (e.from === id || e.to === id))
        .map((e) => (e.from === id ? e.to : e.from)),
    ),
  };
};

export type Part = {
  /** How the page writes it: `Button`, `Button.Icon`. */
  part: string;
  /** The named export a Server Component imports: `ButtonIcon`. */
  exportName: string;
  table: PropTable & { name: string };
};

/**
 * The component's parts, in the order the generator found them: the root, then each member.
 * `ButtonIconProps` is `Button.Icon`, exported by name as `ButtonIcon`.
 */
export const partsOf = (entry: Entry): Part[] => {
  const root = entry.exports[0];
  return entry.propTypes
    .filter((name) => props[name])
    .map((name) => {
      const exportName = name.replace(/Props$/, '');
      const member = exportName.startsWith(root) ? exportName.slice(root.length) : '';
      return {
        part: member ? `${root}.${member}` : exportName,
        exportName,
        table: { name, ...props[name] },
      };
    });
};
