import { getCollection } from 'astro:content';

import { blocksByDirection, PANELS } from './blocks';
import { type NavItem, navSections as componentSections } from './catalog';

/**
 * The site's navigation: the areas in the top bar, each with its own left column.
 * Docs pages come from the `docs` collection: pages without a `section` are top rows in
 * `order`, the rest sit in collapsible groups, alphabetically (frontmatter); the Components column
 * is the catalogue generated from the library. A new area is one entry here, one `Area`
 * member and a page under src/pages/<area>/.
 */
export type { NavItem };
/** A section without a label is a run of top rows, with no heading and no indent. */
export type NavSection = { label?: string; items: NavItem[] };
export type Area = 'docs' | 'components' | 'blocks';

export const AREAS: { id: Area; label: string; href: string }[] = [
  { id: 'docs', label: 'Docs', href: '/docs/introduction' },
  { id: 'components', label: 'Components', href: '/components' },
  { id: 'blocks', label: 'Starting points', href: '/blocks' },
];

export const GITHUB_URL = 'https://github.com/widelab-co/wideset';

export { STORYBOOK_URL } from './catalog';

const DOCS_SECTIONS = ['Guide', 'Foundations', 'Community'] as const;

export const docsNav = async (): Promise<NavSection[]> => {
  const entries = await getCollection('docs');
  const item = (entry: (typeof entries)[number]) => ({
    title: entry.data.title,
    href: `/docs/${entry.id}`,
  });
  const top = entries
    .filter((entry) => !entry.data.section)
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title))
    .map(item);
  const groups = DOCS_SECTIONS.map((label) => ({
    label,
    items: entries
      .filter((entry) => entry.data.section === label)
      .sort((a, b) => a.data.title.localeCompare(b.data.title))
      .map(item),
  }));
  return [{ items: top }, ...groups].filter((section) => section.items.length > 0);
};

export const componentsNav = (): NavSection[] => componentSections;

/** Starting points, grouped by visual direction, after the overview; then the panels. */
export const blocksNav = (): NavSection[] => [
  { items: [{ title: 'Overview', href: '/blocks' }] },
  ...blocksByDirection()
    .filter((group) => group.blocks.length > 0)
    .map((group) => ({
      label: group.title,
      items: group.blocks.map((block) => ({ title: block.title, href: `/blocks/${block.id}` })),
    })),
  {
    label: 'Panels',
    items: PANELS.map((panel) => ({ title: panel.title, href: `/blocks/${panel.id}` })),
  },
];

/** Which area a path belongs to; decides the active tab and the left column. */
export const areaOf = (pathname: string): Area => {
  const first = pathname.split('/')[1];
  const match = AREAS.find((area) => area.id === first);
  return match ? match.id : 'docs';
};
