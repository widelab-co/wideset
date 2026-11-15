/**
 * The list of blocks the pages show, merged from two sources (plain JavaScript, so
 * scripts/blocks.test.mjs runs it without the site):
 *
 * - the committed list (src/data/blocks.json, written by scripts/sync-blocks.mjs): every block's
 *   title, description, category and screenshots;
 * - the library's own blocks, when `packages/design-system/src/blocks/` exists: a block with a
 *   folder there renders live, and its title and description come from the library's index.
 *
 * Without the library's folder both of its inputs are empty and the committed list stands alone.
 *
 * @typedef {{ id: string, title: string, description: string }} BlockMeta
 * @typedef {BlockMeta & { category: string, dark: boolean }} CommittedBlock
 * @typedef {CommittedBlock & { live: boolean, shot: boolean }} Block
 */
export const CATEGORY_ORDER = [
  'AI & agents',
  'Finance & billing',
  'Commerce',
  'CRM & sales',
  'Analytics & reporting',
  'Productivity & collaboration',
  'Content & learning',
  'Auth & onboarding',
  'Settings & admin',
  'Dialogs & states',
];
/** Where a block the committed list does not know lands, until sync-blocks gives it a category. */
export const UNSORTED = 'More';

/** `order-detail` → `Order detail`: a title for a block that has none anywhere. */
const titleOf = (id) => id.replace(/-/g, ' ').replace(/^./, (letter) => letter.toUpperCase());

/**
 * @param {CommittedBlock[]} committed The committed list.
 * @param {BlockMeta[]} source The library's index (its BLOCKS and PANELS), or none.
 * @param {string[]} liveIds The block folders the library has, or none.
 * @returns {Block[]} Category order, then A–Z inside each.
 */
export const mergeBlocks = (committed, source, liveIds) => {
  const known = new Map(committed.map((block) => [block.id, block]));
  const fromSource = new Map(source.map((meta) => [meta.id, meta]));
  const live = new Set(liveIds);
  const order = [...CATEGORY_ORDER, UNSORTED];
  return [...new Set([...known.keys(), ...live])]
    .map((id) => {
      const base = known.get(id);
      const meta = fromSource.get(id);
      return {
        id,
        title: meta?.title ?? base?.title ?? titleOf(id),
        description: meta?.description ?? base?.description ?? '',
        category: base?.category ?? UNSORTED,
        dark: base?.dark ?? false,
        shot: Boolean(base),
        live: live.has(id),
      };
    })
    .sort(
      (a, b) =>
        order.indexOf(a.category) - order.indexOf(b.category) || a.title.localeCompare(b.title),
    );
};
