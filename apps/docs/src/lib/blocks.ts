import {
  type BlockMeta,
  BLOCKS,
  DIRECTION_TITLE,
  NAVIGATION_TITLE,
  type PanelMeta,
  PANELS,
} from '../../../../packages/design-system/src/blocks/index';

/**
 * The starting points: whole screens and the panels that open over them, in
 * packages/design-system/src/blocks/<id>/, listed by the manifest beside them. The server side
 * reads their files as text for the code and the Markdown; the browser loads only the one block a
 * preview shows (src/components/BlockFrame.tsx).
 */
export { BLOCKS, DIRECTION_TITLE, NAVIGATION_TITLE, PANELS };
export type { BlockMeta, PanelMeta };

/** A page under /blocks: a screen, or a panel. */
export type Entry = BlockMeta | PanelMeta;
export const ENTRIES: Entry[] = [...BLOCKS, ...PANELS];
export const isScreen = (entry: Entry): entry is BlockMeta => 'direction' in entry;

/** What a panel is, in one line; the counterpart of a direction's summary. */
export const PANEL_SUMMARY =
  'A panel opens over any screen and keeps its own look in every direction: it has no direction of its own.';

const sources = import.meta.glob<string>(
  '../../../../packages/design-system/src/blocks/*/*.{ts,tsx}',
  { query: '?raw', import: 'default', eager: true },
);

export type BlockFile = { name: string; code: string };

/** A block's files, `index.tsx` first, then its parts, then `data.ts`. */
export const filesOf = (id: string): BlockFile[] => {
  const rank = (name: string) => (name === 'index.tsx' ? 0 : name === 'data.ts' ? 2 : 1);
  return Object.entries(sources)
    .filter(([path]) => path.includes(`/blocks/${id}/`))
    .map(([path, code]) => ({ name: path.split('/').pop()!, code }))
    .sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name));
};

export const blockById = (id: string) => ENTRIES.find((entry) => entry.id === id);

export const blocksByDirection = () =>
  (Object.keys(DIRECTION_TITLE) as BlockMeta['direction'][]).map((direction) => ({
    direction,
    title: DIRECTION_TITLE[direction],
    blocks: BLOCKS.filter((block) => block.direction === direction),
  }));

const fence = (lang: string, code: string) => ['```' + lang, code.trimEnd(), '```'].join('\n');

/**
 * A file as a model reads it: the sample photos in `*.assets.ts` are data URLs of 4–23 KB each,
 * so the Markdown shortens them to their type and keeps the file's shape. The copied code still
 * compiles; the people show broken images until the strings are replaced with real photo URLs.
 */
const forMarkdown = (file: BlockFile) =>
  file.name.endsWith('.assets.ts')
    ? file.code.replace(/'data:([a-z]+\/[a-z+]+);base64,[^']*'/g, "'data:$1;base64,…'")
    : file.code;

/**
 * What a direction is, in one line each, in the words of `AppShell`'s `direction` JSDoc; the full
 * pattern ships in the wideset-build skill.
 */
export const DIRECTION_SUMMARY: Record<BlockMeta['direction'], string> = {
  inset:
    '`<AppShell direction="inset">`, the default: the navigation on the grey app frame, the page a raised white card inside it, scrolling within.',
  flat: '`<AppShell direction="flat">`: one white surface; lines split the navigation, the page header and the content.',
  frame:
    '`<AppShell direction="frame">`: the navigation on a grey tint; the page white and full-bleed.',
  canvas:
    '`<AppShell direction="canvas">`: a grey page with the top bar on it; the content in white cards with no border.',
};

/** The index for a model: the four directions, then every starting point with its link. */
export const blocksMarkdown = (site: URL) =>
  [
    '# Starting points',
    'Whole Wideset screens to start a new app from: the first ones rebuilt 1:1 from the Wideset Core Figma file, the rest composed from Wideset by the same rules. Pick the visual direction first (once per app), then the screen closest to what you build; copy it, keep its surround, replace its content.',
    `## Directions\n\n${blocksByDirection()
      .map(({ direction, title }) => `- **${title}**: ${DIRECTION_SUMMARY[direction]}`)
      .join('\n')}`,
    `## Screens\n\n${BLOCKS.map(
      (block) =>
        `- [${block.title}](${new URL(`/blocks/${block.id}.md`, site).href}) (${DIRECTION_TITLE[block.direction]}, ${NAVIGATION_TITLE[block.navigation].toLowerCase()}): ${block.description}`,
    ).join('\n')}`,
    `## Panels\n\n${PANEL_SUMMARY}\n\n${PANELS.map(
      (panel) =>
        `- [${panel.title}](${new URL(`/blocks/${panel.id}.md`, site).href}): ${panel.description}`,
    ).join('\n')}`,
  ].join('\n\n');

/** A block as Markdown, for a model: what it is, its surround, then every file to copy. */
export const blockMarkdown = (block: Entry, site: URL) => {
  const files = filesOf(block.id);
  const index = new URL('/blocks.md', site).href;
  return [
    `# ${block.title}`,
    block.description,
    isScreen(block)
      ? `Direction: **${DIRECTION_TITLE[block.direction]}** · Navigation: **${NAVIGATION_TITLE[block.navigation]}**. ` +
        `The direction is the app's surround; keep it on every screen. All four, and every starting point: ${index}`
      : `${PANEL_SUMMARY} Every starting point: ${index}`,
    '## Use it',
    `${
      isScreen(block)
        ? `Copy the files below into one folder of your app (for example \`src/screens/${block.id}/\`), keep the surround (the root element, the navigation and \`main\`), and replace the content and \`data.ts\` with yours.`
        : `Copy the files below into one folder of your app (for example \`src/panels/${block.id}/\`), render the panel from the screen that opens it, and replace its content and \`data.ts\` with yours.`
    } The code imports \`@wideset/react\`; in registry mode take each import from the registry-imports reference. It uses state and effects: in a React Server Components app (the Next.js App Router) put \`'use client'\` at the top of \`index.tsx\`.${files.some((file) => file.name.endsWith('.assets.ts')) ? ' The photos in `*.assets.ts` are shortened here: point them at your own images.' : ''} Preview: ${new URL(`/blocks/${block.id}/preview`, site).href}`,
    `## Files\n\n${files.map((file) => `### ${file.name}\n\n${fence(file.name.endsWith('.ts') ? 'ts' : 'tsx', forMarkdown(file))}`).join('\n\n')}`,
  ].join('\n\n');
};

/** A summary's `code` spans as parts, so an HTML page can set them as code. */
export const inlineCode = (text: string) =>
  text.split('`').map((part, index) => ({ code: index % 2 === 1, text: part }));
