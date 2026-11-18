import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiDownload2Line,
  RiHandCoinLine,
  RiHome5Fill,
  RiHome5Line,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartLine,
  RiLink,
  RiPhoneLine,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionLine,
  RiSettings3Line,
  RiTeamLine,
  RiUserAddLine,
} from '@remixicon/react';

/*
  Maya's Tuesday afternoon in Orbit, Home open behind the palette. The palette finds what the app
  holds: its pages, the eight customers, the open deals (the same four as on Home, plus Juniper
  Legal's renewal) and the actions that make something new.
*/

/** The product is Orbit; the workspace is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = {
  name: 'Maya Okafor',
  firstName: 'Maya',
  email: 'maya@lumenstudio.co',
  initials: 'MO',
};

/** The sample is frozen on this day. */
export const TODAY = '2026-11-10';

export type NavLink = {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  /** The icon while the page is open (a line icon swaps for its fill). */
  activeIcon?: RemixiconComponentType;
};

export const mainLinks: NavLink[] = [
  { id: 'home', label: 'Home', icon: RiHome5Line, activeIcon: RiHome5Fill },
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

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

export type Deal = {
  id: string;
  customer: string;
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Commit';
  amount: number;
  nextStep: string;
};

/** Maya's open deals whose next step falls this week, soonest first. */
export const deals: Deal[] = [
  {
    id: 'halcyon',
    customer: 'Halcyon Freight',
    stage: 'Negotiation',
    amount: 24_000,
    nextStep: 'Send the revised quote today',
  },
  {
    id: 'northwind',
    customer: 'Northwind Health',
    stage: 'Proposal',
    amount: 18_500,
    nextStep: 'Walk through the pricing this afternoon',
  },
  {
    id: 'kestrel',
    customer: 'Kestrel Analytics',
    stage: 'Discovery',
    amount: 9_600,
    nextStep: 'Run the product demo on Thursday',
  },
  {
    id: 'cobalt',
    customer: 'Cobalt Security',
    stage: 'Commit',
    amount: 21_000,
    nextStep: 'Get the order form signed by Friday',
  },
];

export type Meeting = {
  id: string;
  title: string;
  customer: string;
  /** When it starts, as a local date and time. */
  start: string;
  minutes: number;
};

/** The next meetings on Maya's calendar. */
export const meetings: Meeting[] = [
  {
    id: 'northwind',
    title: 'Pricing review',
    customer: 'Northwind Health',
    start: '2026-11-10T16:00',
    minutes: 30,
  },
  {
    id: 'juniper',
    title: 'Contract walkthrough',
    customer: 'Juniper Legal',
    start: '2026-11-11T10:00',
    minutes: 60,
  },
  {
    id: 'kestrel',
    title: 'Product demo',
    customer: 'Kestrel Analytics',
    start: '2026-11-12T15:00',
    minutes: 45,
  },
];

/** The palette's groups, in the order they are listed. */
export const GROUPS = ['Pages', 'Customers', 'Deals', 'Actions'] as const;
export type Group = (typeof GROUPS)[number];

export type Command = {
  id: string;
  group: Group;
  /** What is searched first and shown first. */
  name: string;
  /** The quiet line after the name: where it lives, whose it is, what it is worth. */
  context: string;
  icon: RemixiconComponentType;
  /** The keys that run it without the palette, pressed one after the other. */
  keys?: string[];
};

const page = (link: NavLink, context: string, keys?: string[]): Command => ({
  id: `page-${link.id}`,
  group: 'Pages',
  name: link.label,
  context,
  icon: link.icon,
  keys,
});

const [home, inbox, customers, dealsPage, revenue, reports] = mainLinks;
const [general, members, billing, integrations, apiKeys] = settingsLinks;

/** Everything the palette finds, by group, most used first within each. */
export const commands: Command[] = [
  page(home, 'Your deals and meetings for the week', ['G', 'H']),
  page(inbox, 'Mentions, assignments and updates', ['G', 'I']),
  page(customers, 'Every account and who owns it', ['G', 'C']),
  page(dealsPage, 'The pipeline by stage', ['G', 'D']),
  page(revenue, 'Bookings and recurring revenue', ['G', 'R']),
  page(reports, 'Saved reports and forecasts'),
  page(members, 'Settings'),
  page(billing, 'Settings'),
  page(general, 'Settings'),
  page(integrations, 'Settings'),
  page(apiKeys, 'Settings'),

  ...(
    [
      ['halcyon', 'Halcyon Freight', 'Logistics · Jonas Weber'],
      ['northwind', 'Northwind Health', 'Healthcare · Priya Raman'],
      ['kestrel', 'Kestrel Analytics', 'Software · Maya Okafor'],
      ['atlas', 'Atlas Robotics', 'Manufacturing · Tom Becker'],
      ['cobalt', 'Cobalt Security', 'Cybersecurity · Elena Silva'],
      ['juniper', 'Juniper Legal', 'Legal services · Daniel Reyes'],
      ['marlow', 'Marlow & Finch', 'Retail · Leo Marchetti'],
      ['tidewater', 'Tidewater Energy', 'Energy · Nina Alvarez'],
    ] as const
  ).map(([id, name, context]): Command => ({
    id: `customer-${id}`,
    group: 'Customers',
    name,
    context,
    icon: RiContactsBook3Line,
  })),

  ...(
    [
      ['halcyon', 'Annual plan, 120 seats', 'Halcyon Freight · Negotiation · $24,000'],
      ['cobalt', 'Security team rollout', 'Cobalt Security · Commit · $21,000'],
      ['northwind', 'Four-clinic expansion', 'Northwind Health · Proposal · $18,500'],
      ['juniper', 'Renewal 2027', 'Juniper Legal · Negotiation · $14,400'],
      ['kestrel', 'Team plan, 45 seats', 'Kestrel Analytics · Discovery · $9,600'],
    ] as const
  ).map(([id, name, context]): Command => ({
    id: `deal-${id}`,
    group: 'Deals',
    name,
    context,
    icon: RiHandCoinLine,
  })),

  {
    id: 'action-deal',
    group: 'Actions',
    name: 'Create deal',
    context: 'In Lumen Studio',
    icon: RiHandCoinLine,
    keys: ['C'],
  },
  {
    id: 'action-call',
    group: 'Actions',
    name: 'Log a call',
    context: 'On a customer or a deal',
    icon: RiPhoneLine,
    keys: ['L'],
  },
  {
    id: 'action-customer',
    group: 'Actions',
    name: 'Add customer',
    context: 'In Lumen Studio',
    icon: RiContactsBook3Line,
  },
  {
    id: 'action-invite',
    group: 'Actions',
    name: 'Invite teammate',
    context: '38 of 40 seats in use',
    icon: RiUserAddLine,
  },
  {
    id: 'action-export',
    group: 'Actions',
    name: 'Export deals to CSV',
    context: 'Open deals, all owners',
    icon: RiDownload2Line,
  },
  {
    id: 'action-link',
    group: 'Actions',
    name: 'Copy link to this page',
    context: 'Home',
    icon: RiLink,
  },
];

/** What the palette lists before anything is typed: the last things opened, newest first. */
export const recentAtStart = [
  'customer-halcyon',
  'deal-halcyon',
  'page-reports',
  'customer-cobalt',
];

/** The actions offered before anything is typed. */
export const suggested = ['action-deal', 'action-call', 'action-invite'];
