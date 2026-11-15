import catalog from '../generated/catalog.json';
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

export const entries = catalog as Entry[];
export const props = propsData as Record<string, PropTable>;

export const entryById = (id: string) => entries.find((entry) => entry.id === id);

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
