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

/*
  Orbit's help, as Maya Okafor at Lumen Studio sees it on Tuesday 10 November 2026: six topics,
  the articles the search looks through, the five read most this month, and the two ways to reach
  the support team, which is open on weekdays and answering chats in about three minutes.
*/

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

export type Topic = {
  id: string;
  title: string;
  /** What the topic covers, in one line. */
  summary: string;
  /** How many articles it holds: content here, so it is written out, not a badge. */
  articles: number;
};

export const topics: Topic[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    summary: 'Set up the workspace, invite your team and bring in your data.',
    articles: 14,
  },
  {
    id: 'customers-and-deals',
    title: 'Customers and deals',
    summary: 'Records, owners, pipeline stages and imports.',
    articles: 23,
  },
  {
    id: 'billing',
    title: 'Billing',
    summary: 'Plans, seats, invoices and payment methods.',
    articles: 11,
  },
  {
    id: 'integrations',
    title: 'Integrations',
    summary: 'Connect your mail, calendar and the tools you already use.',
    articles: 18,
  },
  {
    id: 'security',
    title: 'Security',
    summary: 'Sign-in, roles, single sign-on and how your data is kept.',
    articles: 9,
  },
  {
    id: 'reports',
    title: 'Reports',
    summary: 'Build, share and schedule reports on revenue and pipeline.',
    articles: 12,
  },
];

export type Article = {
  id: string;
  title: string;
  topic: string;
  /** Minutes to read it. */
  minutes: number;
};

/** Everything the search looks through, most read first. */
export const articles: Article[] = [
  {
    id: 'import-customers-csv',
    title: 'Import customers from a CSV file',
    topic: 'Customers and deals',
    minutes: 4,
  },
  { id: 'change-plan', title: 'Change your plan or number of seats', topic: 'Billing', minutes: 3 },
  { id: 'connect-mail', title: 'Connect Gmail or Outlook', topic: 'Integrations', minutes: 3 },
  {
    id: 'deal-stages',
    title: 'Set up the stages of your pipeline',
    topic: 'Customers and deals',
    minutes: 5,
  },
  { id: 'two-step', title: 'Turn on two-step verification', topic: 'Security', minutes: 2 },
  {
    id: 'invite-team',
    title: 'Invite your team and choose their roles',
    topic: 'Getting started',
    minutes: 3,
  },
  { id: 'revenue-report', title: 'Build a revenue report', topic: 'Reports', minutes: 6 },
  {
    id: 'failed-rows',
    title: 'Fix rows that failed to import',
    topic: 'Customers and deals',
    minutes: 3,
  },
  {
    id: 'merge-duplicates',
    title: 'Merge duplicate customers',
    topic: 'Customers and deals',
    minutes: 2,
  },
  {
    id: 'import-deals',
    title: 'Import deals from a spreadsheet',
    topic: 'Customers and deals',
    minutes: 4,
  },
  {
    id: 'hubspot',
    title: 'Connect HubSpot and import its contacts',
    topic: 'Integrations',
    minutes: 5,
  },
  { id: 'download-invoice', title: 'Download an invoice', topic: 'Billing', minutes: 1 },
  { id: 'payment-method', title: 'Update your payment method', topic: 'Billing', minutes: 2 },
  { id: 'sso-okta', title: 'Set up single sign-on with Okta', topic: 'Security', minutes: 7 },
  {
    id: 'schedule-report',
    title: 'Send a report by e-mail every week',
    topic: 'Reports',
    minutes: 2,
  },
  {
    id: 'export-customers',
    title: 'Export customers to a CSV file',
    topic: 'Customers and deals',
    minutes: 2,
  },
];

/** Read most this month. */
export const popular = articles.slice(0, 5);

/** The support team: open on weekdays, so a chat gets a person. */
export const support = {
  chat: { hours: 'Weekdays, 8:00 to 20:00 ET', wait: 'Current wait about 3 minutes' },
  email: { address: 'support@orbit.so', reply: 'Usually replies within 4 hours' },
  status: { label: 'All systems operational', href: '#status' },
};
