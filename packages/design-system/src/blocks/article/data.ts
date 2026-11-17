import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiHandCoinLine,
  RiHome5Line,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartLine,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionFill,
  RiQuestionLine,
  RiSettings3Line,
  RiTeamLine,
} from '@remixicon/react';

/** The product is Orbit; the workspace using it is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

export type NavLink = {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  /** The icon while the page is open (a line icon swaps for its fill). */
  activeIcon?: RemixiconComponentType;
};

export const mainLinks: NavLink[] = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'inbox', label: 'Inbox', icon: RiInbox2Line },
  { id: 'customers', label: 'Customers', icon: RiContactsBook3Line },
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
  { id: 'revenue', label: 'Revenue', icon: RiLineChartLine },
  { id: 'reports', label: 'Reports', icon: RiPieChart2Line },
];

export const settingsLinks: NavLink[] = [
  { id: 'general', label: 'General', icon: RiSettings3Line },
  { id: 'members', label: 'Members', icon: RiTeamLine },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = {
  id: 'help',
  label: 'Help and support',
  icon: RiQuestionLine,
  activeIcon: RiQuestionFill,
};

/*
  One help article, opened from Customers and deals: importing customers from a CSV file. It was
  last updated on 3 November 2026; today is 10 November. The sections are listed here once, for
  the text's headings and for the "On this page" list beside it.
*/

export type Article = {
  id: string;
  title: string;
  topic: string;
  /** Minutes to read it. */
  minutes: number;
};

export const article = {
  id: 'import-customers-csv',
  title: 'Import customers from a CSV file',
  topic: { id: 'customers-and-deals', title: 'Customers and deals' },
  updated: '2026-11-03',
  minutes: 4,
};

/** The article's sections, in order: a heading each, and an entry in "On this page". */
export const sections = [
  { id: 'before-you-start', title: 'Before you start' },
  { id: 'prepare-the-file', title: 'Prepare the file' },
  { id: 'import-the-file', title: 'Import the file' },
  { id: 'check-the-result', title: 'Check the result' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

/** The columns Orbit reads from the file. */
export const columns = [
  { name: 'name', required: true, holds: 'The company’s name, as it should appear in Orbit' },
  { name: 'domain', required: false, holds: 'The company’s website, used to find duplicates' },
  { name: 'owner_email', required: false, holds: 'The e-mail of the teammate who owns it' },
  { name: 'stage', required: false, holds: 'Lead, Prospect, Customer or Churned' },
  { name: 'annual_value', required: false, holds: 'Expected revenue a year, in US dollars' },
];

/** The first two lines of a file with every column. */
export const sampleFile = [
  columns.map((column) => column.name).join(','),
  'Halcyon Freight,halcyonfreight.com,jonas@lumenstudio.co,Customer,48000',
];

/** Read next, from this topic and the ones it touches. */
export const related: Article[] = [
  {
    id: 'failed-rows',
    title: 'Fix rows that failed to import',
    topic: 'Customers and deals',
    minutes: 3,
  },
  {
    id: 'hubspot',
    title: 'Connect HubSpot and import its contacts',
    topic: 'Integrations',
    minutes: 5,
  },
  {
    id: 'invite-team',
    title: 'Invite your team and choose their roles',
    topic: 'Getting started',
    minutes: 3,
  },
];
