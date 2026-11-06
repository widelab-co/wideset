/**
 * The blocks, in reading order: whole screens to start a new app from, one per folder beside this
 * file, each rebuilt 1:1 from the Wideset Core Figma file. The docs site and the tests read this
 * list; a folder missing from it (or the other way round) fails `src/__tests__/blocks.test.tsx`.
 */
export type BlockDirection = 'flat' | 'frame' | 'inset' | 'canvas';
export type BlockNavigation = 'sidebar' | 'rail' | 'top-bar';

export type BlockMeta = {
  /** Folder name and URL segment. */
  id: string;
  title: string;
  /** The visual direction it shows (specs/patterns/directions.md). */
  direction: BlockDirection;
  navigation: BlockNavigation;
  /** One sentence: what the screen is, so a reader knows when to start from it. */
  description: string;
};

export const BLOCKS: BlockMeta[] = [
  {
    id: 'kanban',
    title: 'Kanban',
    direction: 'flat',
    navigation: 'sidebar',
    description:
      'A project board: workspace sidebar, breadcrumbs and view tabs, filters, and columns of task cards.',
  },
  {
    id: 'process',
    title: 'Process',
    direction: 'flat',
    navigation: 'rail',
    description:
      'A creation flow: a workspace rail beside the sidebar, a step header with progress, and a choice of type.',
  },
  {
    id: 'finance-dashboard',
    title: 'Finance dashboard',
    direction: 'flat',
    navigation: 'top-bar',
    description:
      'An overview under a top bar: key figures, charts, a transactions table and a side panel.',
  },
  {
    id: 'communication',
    title: 'Communication',
    direction: 'frame',
    navigation: 'sidebar',
    description:
      'A messaging app in three panels: the chat list, the conversation and the contact details.',
  },
  {
    id: 'calendar',
    title: 'Calendar',
    direction: 'inset',
    navigation: 'sidebar',
    description:
      'A month calendar on a raised page: views and filters in the header, events in the grid.',
  },
  {
    id: 'crypto',
    title: 'Crypto',
    direction: 'canvas',
    navigation: 'top-bar',
    description:
      'A wallet on a grey canvas: a swap form, the balance with a chart, transactions and a distribution.',
  },
];

export const DIRECTION_TITLE: Record<BlockDirection, string> = {
  flat: 'Flat',
  frame: 'Frame',
  inset: 'Inset',
  canvas: 'Canvas',
};

export const NAVIGATION_TITLE: Record<BlockNavigation, string> = {
  sidebar: 'Sidebar',
  rail: 'Rail and sidebar',
  'top-bar': 'Top bar',
};
