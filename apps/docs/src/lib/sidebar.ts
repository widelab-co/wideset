import type { NavGroup } from '../components/parts';
import { blockCategories } from './blocks';
import { entries } from './catalog';
import { newIds } from './gitInfo';
import { docsNav } from './nav';
import { hasPlayground } from './playground';

/** The sidebars: each page lists only its own rows, in the one sidebar component. */
const WHATS_NEW = '/docs/whats-new';

/** Docs: Getting started, Foundations, Community. */
export const docsSidebar = async (): Promise<NavGroup[]> => {
  const docs = await docsNav();
  const rows = (label?: string) =>
    docs
      .filter((section) => section.label === label)
      .flatMap((section) => section.items)
      .filter((item) => item.href !== WHATS_NEW)
      .map((item) => ({ title: item.title, href: item.href }));
  return [
    { label: 'Getting started', items: [...rows(undefined), ...rows('Guide')] },
    { label: 'Foundations', items: rows('Foundations') },
    { label: 'Community', items: rows('Community') },
  ].filter((group) => group.items.length > 0);
};

const sorted = [...entries].sort((a, b) => a.title.localeCompare(b.title));

/** Components: Overview, then every component A–Z; the newest carry a mark. */
export const componentsSidebar = (): NavGroup[] => {
  const fresh = newIds(entries);
  return [
    {
      items: [
        { title: 'Overview', href: '/components' },
        ...sorted.map((entry) => ({
          title: entry.title,
          href: `/components/${entry.id}`,
          fresh: fresh.has(entry.id),
        })),
      ],
    },
  ];
};

/** Playground: the components that have one; a row switches the page in place. */
export const playgroundItems = sorted
  .filter((entry) => hasPlayground(entry.id))
  .map((entry) => ({ id: entry.id, title: entry.title }));
export const playgroundSidebar = (): NavGroup[] => [
  {
    items: playgroundItems.map((item) => ({
      title: item.title,
      href: `/docs/playground?c=${item.id}`,
    })),
  },
];

/** Blocks: Overview, then each category with its blocks. */
export const blocksSidebar = (): NavGroup[] => [
  { items: [{ title: 'Overview', href: '/blocks' }] },
  ...blockCategories.map((category) => ({
    label: category.label,
    items: category.blocks.map((block) => ({ title: block.title, href: `/blocks/${block.id}` })),
  })),
];
