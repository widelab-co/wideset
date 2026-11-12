import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Fill,
  RiContactsBook3Line,
  RiHandCoinLine,
  RiHome5Line,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartLine,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionLine,
  RiSettings3Line,
  RiTeamLine,
} from '@remixicon/react';

/*
  One customer's overview in Orbit: Halcyon Freight, an Enterprise customer of Lumen Studio paying
  $18,500 a month, so its renewal is worth $222,000 a year. The page has four modules; the sample
  content below is what two of them hold once their data is in. Invoices never arrive (the module
  stays loading) and there are no notes yet.
*/

/** The product is Orbit; the workspace is Lumen Studio. */
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
  {
    id: 'customers',
    label: 'Customers',
    icon: RiContactsBook3Line,
    activeIcon: RiContactsBook3Fill,
  },
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

/** The customer the page is about. */
export const customer = { name: 'Halcyon Freight' };

/** The last time the page heard from the server, in the viewer's own time. */
export const lastSynced = '2026-11-10T10:42:00';

export type Deal = {
  id: string;
  name: string;
  /** A lifecycle state, so its badge stays neutral. */
  stage: string;
  closes: string;
  /** A year of the deal, in dollars. */
  value: number;
};

/** Open deals with the customer, the nearest close date first. */
export const deals: Deal[] = [
  {
    id: 'renewal-2027',
    name: 'Enterprise renewal',
    stage: 'Negotiation',
    closes: '2026-12-15',
    value: 222_000,
  },
  {
    id: 'analytics',
    name: 'Analytics add-on',
    stage: 'Proposal',
    closes: '2027-01-22',
    value: 36_000,
  },
  {
    id: 'emea-depots',
    name: 'EMEA depots, 60 seats',
    stage: 'Discovery',
    closes: '2027-02-26',
    value: 64_800,
  },
  {
    id: 'priority-support',
    name: 'Priority support',
    stage: 'Qualified',
    closes: '2027-03-12',
    value: 12_000,
  },
];

export type Ticket = {
  id: string;
  subject: string;
  /** A lifecycle state, so its badge stays neutral. */
  status: 'Open' | 'Pending' | 'Solved';
  opened: string;
  replies: number;
};

/** The customer's support tickets, newest first: what the help desk answers once it is reached. */
export const tickets: Ticket[] = [
  {
    id: '4821',
    subject: 'Drivers signed out',
    status: 'Open',
    opened: '2026-11-09',
    replies: 3,
  },
  {
    id: '4807',
    subject: 'Export misses depots',
    status: 'Pending',
    opened: '2026-11-05',
    replies: 5,
  },
  {
    id: '4779',
    subject: 'New billing address',
    status: 'Solved',
    opened: '2026-10-29',
    replies: 2,
  },
  {
    id: '4752',
    subject: 'Higher API rate limit',
    status: 'Solved',
    opened: '2026-10-21',
    replies: 6,
  },
];
