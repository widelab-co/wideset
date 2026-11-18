import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiCalendarScheduleLine,
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
  Maya's Tuesday afternoon in Orbit, Home open behind the notifications. The latest seven, from
  this morning back to yesterday: three unread, one of them Tom asking for a report Maya owns.
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

/** The sample's clock: Tuesday, November 10, 3:40 PM. */
export const NOW = '2026-11-10T15:40';

export type Person = { name: string; initials: string };

/** What a request asks for, and what Maya answered. */
export type AccessRequest = { status: 'pending' | 'approved' | 'declined' };

export type Notification = {
  id: string;
  /** Who did it; `null` when Orbit itself reports it, drawn with `icon`. */
  actor: Person | null;
  icon?: RemixiconComponentType;
  /**
   * The sentence, as actor + action + target + trail: "Jonas Weber" "mentioned you in" "Halcyon
   * Freight". The actor and the target are the names the eye looks for.
   */
  action: string;
  target: string;
  trail?: string;
  /** Mentions have their own tab. */
  mention?: boolean;
  /** Local date and time. */
  at: string;
  read: boolean;
  /** An access request, answered in place. */
  request?: AccessRequest;
};

const jonas = { name: 'Jonas Weber', initials: 'JW' };
const tom = { name: 'Tom Becker', initials: 'TB' };
const priya = { name: 'Priya Raman', initials: 'PR' };
const elena = { name: 'Elena Silva', initials: 'ES' };
const nina = { name: 'Nina Alvarez', initials: 'NA' };

/** The latest notifications, newest first. */
export const notifications: Notification[] = [
  {
    id: 'halcyon-mention',
    actor: jonas,
    action: 'mentioned you in',
    target: 'Halcyon Freight',
    mention: true,
    at: '2026-11-10T15:28',
    read: false,
  },
  {
    id: 'pipeline-access',
    actor: tom,
    action: 'asked to view',
    target: 'Q4 pipeline review',
    at: '2026-11-10T14:52',
    read: false,
    request: { status: 'pending' },
  },
  {
    id: 'northwind-stage',
    actor: priya,
    action: 'moved',
    target: 'Northwind Health',
    trail: 'to Proposal',
    at: '2026-11-10T13:10',
    read: false,
  },
  {
    id: 'tidewater-payment',
    actor: null,
    icon: RiBankCardLine,
    action: 'Payment received from',
    target: 'Tidewater Energy',
    at: '2026-11-10T09:05',
    read: true,
  },
  {
    id: 'kestrel-mention',
    actor: elena,
    action: 'mentioned you in',
    target: 'Kestrel Analytics',
    mention: true,
    at: '2026-11-09T17:24',
    read: true,
  },
  {
    id: 'forecast-shared',
    actor: nina,
    action: 'shared',
    target: 'Q4 forecast',
    trail: 'with you',
    at: '2026-11-09T09:15',
    read: true,
  },
  {
    id: 'juniper-renewal',
    actor: null,
    icon: RiCalendarScheduleLine,
    action: '',
    target: 'Juniper Legal',
    trail: 'renews in 30 days',
    at: '2026-11-09T08:00',
    read: true,
  },
];
