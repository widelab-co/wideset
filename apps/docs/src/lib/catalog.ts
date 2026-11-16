import catalog from '../generated/catalog.json';
import graph from '../generated/graph.json';
import propsData from '../generated/props.json';

/**
 * The catalogue as the pages read it. Everything comes from scripts/generate.mjs, which
 * reads it out of the library.
 */
/** A row in the left column; a family row holds its members. */
export type NavItem = { title: string; href: string; children?: NavItem[] };

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
export const props = propsData as Record<string, PropTable>;
export const relationships = graph as Graph;

export const entryById = (id: string) => entries.find((entry) => entry.id === id);

/**
 * The left column: one list. Components that share a Storybook group
 * (`Components/Button/IconButton`) fold under one row named after the group, the component of
 * the same name first: Button › Button, Filter button, Icon button, Link button, Split button.
 */
export const navSections = [{ label: 'Components', entries }].map(
  ({ label, entries: inCategory }) => {
    const familyOf = (entry: Entry) => {
      const segments = entry.storyTitle.split('/');
      return segments.length > 2 ? segments[1] : undefined;
    };
    const item = (entry: Entry) => ({ title: entry.title, href: `/components/${entry.id}` });
    const items: NavItem[] = [];
    const seen = new Set<string>();
    for (const entry of inCategory) {
      const family = familyOf(entry);
      if (!family) {
        items.push(item(entry));
        continue;
      }
      if (seen.has(family)) continue;
      seen.add(family);
      const members = inCategory.filter((other) => familyOf(other) === family);
      const head = members.find((member) => member.exports[0] === family) ?? members[0];
      items.push({
        title: head.title,
        href: `/components/${head.id}`,
        children: [head, ...members.filter((member) => member !== head)].map(item),
      });
    }
    return { label, items: items.sort((a, b) => a.title.localeCompare(b.title)) };
  },
);

/** The components one step away in the graph, nearest kind first. */
export const relatedTo = (id: string) =>
  relationships.edges
    .filter((edge) => edge.from === id || edge.to === id)
    .map((edge) => ({ id: edge.from === id ? edge.to : edge.from, kind: edge.kind }))
    .sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'uses' ? -1 : 1))
    .map((item) => ({ ...item, entry: entryById(item.id)! }))
    .filter((item) => item.entry);

/**
 * Where the library's Storybook is published. The deploy job in build.yaml sets it per
 * environment (production, develop, PR preview); a local build links to production.
 */
export const STORYBOOK_URL: string =
  import.meta.env.PUBLIC_STORYBOOK_URL || 'https://storybook.wideset.co';
const STORYBOOK = STORYBOOK_URL;
const SOURCE = 'https://github.com/widelab-co/wideset/tree/develop/packages/design-system';

/** Storybook's id for a title: `Components/Button/Button` → `components-button-button`. */
export const storybookUrlFor = (entry: Entry) =>
  `${STORYBOOK}/?path=/docs/${entry.storyTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}--docs`;

export const sourceUrlFor = (entry: Entry) => `${SOURCE}/src/components/${entry.component}`;

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
