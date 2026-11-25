import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

/**
 * A component's usage guidance, written once in packages/design-system/specs (gen-guidance.mjs).
 * The Markdown for models carries the usage sections; the page shows the Accessibility notes.
 */
const idOf = (path: string) => path.split('/').pop()!.replace(/\.md$/, '');

const sources = import.meta.glob<string>('../generated/guidance-md/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const accessibility = import.meta.glob<{ Content: AstroComponentFactory }>(
  '../generated/guidance-a11y/*.md',
  { eager: true },
);

const markdownById = new Map(Object.entries(sources).map(([path, text]) => [idOf(path), text]));

/** The same guidance as Markdown, for `/components/<id>.md` and `llms-full.txt`. */
export const guidanceMarkdown = (id: string) => markdownById.get(id)?.trim() ?? '';

const accessibilityById = new Map(
  Object.entries(accessibility).map(([path, page]) => [idOf(path), page.Content]),
);
/** The spec's Accessibility notes, rendered, if the spec has them. */
export const accessibilityContent = (id: string) => accessibilityById.get(id);
