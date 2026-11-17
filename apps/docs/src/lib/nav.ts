import { getCollection } from 'astro:content';

/**
 * The docs pages, from the `docs` collection: pages without a `section` are top rows in `order`,
 * the rest sit in their groups, alphabetically (frontmatter).
 */
type NavItem = { title: string; href: string };
/** A section without a label is a run of top rows. */
type NavSection = { label?: string; items: NavItem[] };

export const GITHUB_URL = 'https://github.com/widelab-co/wideset';

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
