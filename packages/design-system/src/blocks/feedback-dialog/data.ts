import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiFeedbackLine,
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
  Maya's Tuesday afternoon in Orbit, Home open behind the feedback dialog: the deals to move this
  week and the meetings coming up. Send feedback in the sidebar's help area opens the dialog.
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

/** In the help area, over Help and support: it opens the dialog, it is not a page. */
export const feedbackLink = { label: 'Send feedback', icon: RiFeedbackLine };
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

/** How it is going, from hard to easy: five steps, each with its words, no faces. */
export const SCALE = [
  { value: '1', label: 'Very hard' },
  { value: '2', label: 'Hard' },
  { value: '3', label: 'Okay' },
  { value: '4', label: 'Easy' },
  { value: '5', label: 'Very easy' },
] as const;

/** What the feedback is about. */
export const TOPICS = [
  { value: 'reports', label: 'Reports' },
  { value: 'pipeline', label: 'Pipeline' },
  { value: 'billing', label: 'Billing' },
  { value: 'other', label: 'Something else' },
];
