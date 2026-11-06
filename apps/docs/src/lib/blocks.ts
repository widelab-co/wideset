import {
  type BlockMeta,
  BLOCKS,
  DIRECTION_TITLE,
  NAVIGATION_TITLE,
} from '../../../../packages/design-system/src/blocks/index';

/**
 * The starting points: whole screens in packages/design-system/src/blocks/<id>/, listed by the
 * manifest beside them. The server side reads their files as text for the code and the Markdown;
 * the browser loads only the one block a preview shows (src/components/BlockFrame.tsx).
 */
export { BLOCKS, DIRECTION_TITLE, NAVIGATION_TITLE };
export type { BlockMeta };

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

export const blockById = (id: string) => BLOCKS.find((block) => block.id === id);

export const blocksByDirection = () =>
  (Object.keys(DIRECTION_TITLE) as BlockMeta['direction'][]).map((direction) => ({
    direction,
    title: DIRECTION_TITLE[direction],
    blocks: BLOCKS.filter((block) => block.direction === direction),
  }));

const fence = (lang: string, code: string) => ['```' + lang, code.trimEnd(), '```'].join('\n');

/** What a direction is, in one line each; the full pattern ships in the wideset-build skill. */
export const DIRECTION_SUMMARY: Record<BlockMeta['direction'], string> = {
  flat: 'One white surface; lines split the navigation, the page header and the content. The default.',
  frame:
    'The navigation on a grey tint (`Sidebar surface="tinted"`); the page white and full-bleed.',
  inset:
    'The navigation on the grey frame (`Sidebar surface="frame"`); the page a raised white card inside it, scrolling within.',
  canvas: 'A grey page with the top bar on it; the content in white cards with no border.',
};

/** The index for a model: the four directions, then every starting point with its link. */
export const blocksMarkdown = (site: URL) =>
  [
    '# Starting points',
    'Whole Wideset screens to start a new app from, rebuilt 1:1 from the Wideset Core Figma file. Pick the visual direction first (once per app), then the screen closest to what you build; copy it, keep its surround, replace its content.',
    `## Directions\n\n${blocksByDirection()
      .map(({ direction, title }) => `- **${title}**: ${DIRECTION_SUMMARY[direction]}`)
      .join('\n')}`,
    `## Screens\n\n${BLOCKS.map(
      (block) =>
        `- [${block.title}](${new URL(`/blocks/${block.id}.md`, site).href}) (${DIRECTION_TITLE[block.direction]}, ${NAVIGATION_TITLE[block.navigation].toLowerCase()}): ${block.description}`,
    ).join('\n')}`,
  ].join('\n\n');

/** A block as Markdown, for a model: what it is, its surround, then every file to copy. */
export const blockMarkdown = (block: BlockMeta, site: URL) => {
  const files = filesOf(block.id);
  return [
    `# ${block.title}`,
    block.description,
    `Direction: **${DIRECTION_TITLE[block.direction]}** · Navigation: **${NAVIGATION_TITLE[block.navigation]}**. ` +
      `The direction is the app's surround; keep it on every screen. All four, and every starting point: ${new URL('/blocks.md', site).href}`,
    '## Use it',
    `Copy the files below into one folder of your app (for example \`src/screens/${block.id}/\`), keep the surround (the root element, \`Sidebar\` and \`main\`), and replace the content and \`data.ts\` with yours. The code imports \`@wideset/react\`; in registry mode take each import from the registry-imports reference. Preview: ${new URL(`/blocks/${block.id}/preview`, site).href}`,
    `## Files\n\n${files.map((file) => `### ${file.name}\n\n${fence(file.name.endsWith('.ts') ? 'ts' : 'tsx', file.code)}`).join('\n\n')}`,
  ].join('\n\n');
};

/** A summary's `code` spans as parts, so an HTML page can set them as code. */
export const inlineCode = (text: string) =>
  text.split('`').map((part, index) => ({ code: index % 2 === 1, text: part }));
