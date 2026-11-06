import { entries } from './catalog';
import { AREAS, docsNav } from './nav';

export type SearchItem = { title: string; href: string; group: string };

/**
 * Everything the search lists: the areas, every docs page, every component. The palette reads it
 * at build time; /docs/search-index.json publishes the same list for other parts of the site.
 */
export const searchItems = async (): Promise<SearchItem[]> => [
  ...AREAS.map((item) => ({ title: item.label, href: item.href, group: 'Sections' })),
  ...(await docsNav()).flatMap((section) =>
    section.items.map((item) => ({
      title: item.title,
      href: item.href,
      group: section.label ?? 'Docs',
    })),
  ),
  ...entries.map((entry) => ({
    title: entry.title,
    href: `/components/${entry.id}`,
    group: 'Components',
  })),
];
