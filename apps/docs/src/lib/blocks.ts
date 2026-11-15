import type { NavGroup } from '../components/parts';
import data from '../data/blocks.json';
import { mergeBlocks, UNSORTED } from './blockList.mjs';

/**
 * The blocks (whole screens to start a product from), as the pages read them.
 *
 * The library keeps them in `packages/design-system/src/blocks/<id>/index.tsx`, with their titles
 * and descriptions in `blocks/index.ts`. Both are found with a glob, never imported by name: while
 * that folder is not in the library the globs are empty, nothing fails, and the pages show the
 * committed screenshots (src/data/blocks.json, public/_docs/blocks). When the folder is there, a
 * block with its own folder renders live (src/lib/blockLoader.ts) and prints its source.
 */
type SourceMeta = { id: string; title: string; description: string };
const indexes = import.meta.glob<{ BLOCKS?: SourceMeta[]; PANELS?: SourceMeta[] }>(
  '../../../../packages/design-system/src/blocks/index.ts',
  { eager: true },
);
const sources = import.meta.glob<string>(
  '../../../../packages/design-system/src/blocks/*/index.tsx',
  { eager: true, query: '?raw', import: 'default' },
);
const idOf = (path: string) => path.split('/').at(-2)!;
const sourceById = new Map(Object.entries(sources).map(([path, code]) => [idOf(path), code]));

export const blocks = mergeBlocks(
  data,
  Object.values(indexes).flatMap((index) => [...(index.BLOCKS ?? []), ...(index.PANELS ?? [])]),
  [...sourceById.keys()],
);
export type Block = (typeof blocks)[number];

const categories = [...new Set(blocks.map((block) => block.category))];
export const blockCategories = categories.map((label) => ({
  label,
  slug:
    label === UNSORTED
      ? 'more'
      : label
          .toLowerCase()
          .replace(/[^a-z]+/g, '-')
          .replace(/^-|-$/g, ''),
  blocks: blocks.filter((block) => block.category === label),
}));
export const blockById = (id: string) => blocks.find((block) => block.id === id);
/** A live block's entry file, as written; `undefined` for one the library does not have yet. */
export const blockSource = (id: string) => sourceById.get(id);
/** The sidebar on Blocks: the gallery, then each category with its blocks. */
export const blocksNav: NavGroup[] = [
  { items: [{ title: 'Overview', href: '/docs/blocks' }] },
  ...blockCategories.map((category) => ({
    label: category.label,
    items: category.blocks.map((block) => ({
      title: block.title,
      href: `/docs/blocks/${block.id}`,
    })),
  })),
];
export const shot = (id: string, theme: 'light' | 'dark') => `/_docs/blocks/${id}-${theme}.webp`;
