/**
 * The blocks, in reading order: whole screens to start a new app from (`BLOCKS`) and the panels
 * that open over any of them (`PANELS`), one per folder beside this file, each rebuilt 1:1 from the
 * Wideset Core Figma file. The docs site and the tests read these lists; a folder missing from them
 * (or the other way round) fails `src/__tests__/blocks.test.tsx`.
 */
export type BlockDirection = 'flat' | 'frame' | 'inset' | 'canvas';
/**
 * `takeover`: a window over the app, no sidebar, a top bar with back and breadcrumbs. `none`: a
 * screen before the app (sign in, sign up), with no app navigation at all.
 */
export type BlockNavigation = 'sidebar' | 'rail' | 'top-bar' | 'takeover' | 'none';

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
    id: 'spreadsheet',
    title: 'Spreadsheet',
    direction: 'flat',
    navigation: 'top-bar',
    description:
      'A table worked in cell by cell under a top bar: view tools, typed columns that sort, a summary under each header, row selection and a status bar.',
  },
  {
    id: 'gantt',
    title: 'Gantt',
    direction: 'flat',
    navigation: 'takeover',
    description:
      'A plan over the app: a top bar to leave by, people and their tasks beside a timeline of months, and a task open in a side panel.',
  },
  {
    id: 'ai-chat',
    title: 'AI chat',
    direction: 'flat',
    navigation: 'top-bar',
    description:
      'An AI assistant home: a model switcher in the top bar, a greeting, and a composer with tools and attachments.',
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
    id: 'sign-in',
    title: 'Sign in',
    direction: 'inset',
    navigation: 'none',
    description:
      'A sign-in screen in two raised cards: the form, with its help links and keyboard hints, beside a picture of the product.',
  },
  {
    id: 'sign-in-card',
    title: 'Sign in card',
    direction: 'inset',
    navigation: 'none',
    description:
      'The same sign-in form alone in one centred card, for a product with nothing to show beside it.',
  },
  {
    id: 'sign-up',
    title: 'Sign up',
    direction: 'inset',
    navigation: 'none',
    description:
      'Creating an account in the sign-in card: name, work e-mail, a password you can reveal, and the terms.',
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

/** A part that opens over a screen. It belongs to no direction: it keeps its own look over any. */
export type PanelMeta = {
  /** Folder name and URL segment. */
  id: string;
  title: string;
  /** One sentence: what the panel holds, so a reader knows when to start from it. */
  description: string;
};

export const PANELS: PanelMeta[] = [
  {
    id: 'task-sidepanel',
    title: 'Task side panel',
    description:
      'A record’s detail beside the page: its properties, subtasks, tabs over an activity timeline, and keyboard hints.',
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
  takeover: 'Takeover',
  none: 'No navigation',
};
