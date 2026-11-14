import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiHandCoinLine,
  RiHome5Fill,
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
  Maya's Tuesday in Orbit. The lists tell one story: the quote she owes Halcyon Freight is a task
  and that deal's next step, the pricing review is a task, a meeting and Northwind Health's next
  step, and Thursday's demo is on the calendar and in the deals.
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

export type Task = {
  id: string;
  title: string;
  /** The customer it is about, when it is about one. */
  customer?: string;
  /** When it is due, as a local date and time; a task added on the page has only today. */
  due?: string;
};

/** Today's tasks, earliest first; the first was due yesterday. */
export const tasks: Task[] = [
  {
    id: 'redlines',
    title: 'Send the contract redlines back',
    customer: 'Juniper Legal',
    due: '2026-11-09T16:00',
  },
  {
    id: 'attendees',
    title: 'Confirm who is joining Thursday’s demo',
    customer: 'Kestrel Analytics',
    due: '2026-11-10T08:30',
  },
  { id: 'forecast', title: 'Update the November forecast', due: '2026-11-10T09:00' },
  {
    id: 'discount',
    title: 'Approve the renewal discount',
    customer: 'Marlow & Finch',
    due: '2026-11-10T09:00',
  },
  {
    id: 'quote',
    title: 'Send the revised quote',
    customer: 'Halcyon Freight',
    due: '2026-11-10T10:00',
  },
  {
    id: 'pricing',
    title: 'Prepare the pricing review',
    customer: 'Northwind Health',
    due: '2026-11-10T13:30',
  },
  {
    id: 'notes',
    title: 'Log notes from the discovery call',
    customer: 'Atlas Robotics',
    due: '2026-11-10T16:30',
  },
];

/** The tasks already ticked off when the page opens, in the order they were done. */
export const doneAtStart = ['forecast', 'attendees', 'discount'];

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
    id: 'atlas',
    title: 'Discovery call',
    customer: 'Atlas Robotics',
    start: '2026-11-10T11:30',
    minutes: 45,
  },
  {
    id: 'northwind',
    title: 'Pricing review',
    customer: 'Northwind Health',
    start: '2026-11-10T14:00',
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

export type RecordKind = 'Customer' | 'Deal' | 'Report';

/** The records Maya opened last, newest first. */
export const recentRecords: { id: string; kind: RecordKind; name: string }[] = [
  { id: 'halcyon', kind: 'Customer', name: 'Halcyon Freight' },
  { id: 'halcyon-annual', kind: 'Deal', name: 'Annual plan, 120 seats' },
  { id: 'q4-pipeline', kind: 'Report', name: 'Q4 pipeline review' },
  { id: 'tidewater', kind: 'Customer', name: 'Tidewater Energy' },
  { id: 'kestrel-team', kind: 'Deal', name: 'Team plan, 45 seats' },
];
