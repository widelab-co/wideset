import type { NavGroup } from '../components/parts';
import { blockCategories } from './blocks';
import { entries } from './catalog';
import { docsNav } from './nav';

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

/** Components: Overview, then every component A–Z. */
export const componentsSidebar = (): NavGroup[] => [
  {
    items: [
      { title: 'Overview', href: '/components' },
      ...sorted.map((entry) => ({
        title: entry.title,
        href: `/components/${entry.id}`,
      })),
    ],
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
