import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiFlagLine,
  RiHandCoinLine,
  RiHome5Line,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartLine,
  RiMoneyDollarCircleLine,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionLine,
  RiSettings3Line,
  RiStackLine,
  RiTeamFill,
  RiTeamLine,
} from '@remixicon/react';

import type { Milestone } from './achievement-list';

/*
  Jonas Weber's profile as Maya Okafor sees it, on Tuesday 10 November 2026 at 3 PM in London.
  Maya does not follow him yet, so Follow is the page's one filled button. His figures agree with
  the Goals page: $164,200 closed this quarter against a $180,000 quota (91%), first of five on
  the leaderboard, and Halcyon Freight the quarter's largest deal.
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
  { id: 'members', label: 'Members', icon: RiTeamLine, activeIcon: RiTeamFill },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

/** "Now" for the relative times and the local time; the sample is frozen at this moment. */
export const NOW = '2026-11-10T15:00:00Z';

export type Person = {
  id: string;
  name: string;
  initials: string;
  role: string;
  /** Pinned only for the signed-in user, to match the sidebar's account. */
  color?: 'orange';
};

/** The signed-in user. */
export const me: Person = {
  id: 'maya',
  name: account.name,
  initials: account.initials,
  role: 'Head of Sales',
  color: 'orange',
};
const priya: Person = {
  id: 'priya',
  name: 'Priya Raman',
  initials: 'PR',
  role: 'Account executive',
};
const tom: Person = { id: 'tom', name: 'Tom Becker', initials: 'TB', role: 'Sales engineer' };
const elena: Person = {
  id: 'elena',
  name: 'Elena Silva',
  initials: 'ES',
  role: 'Revenue operations',
};
const daniel: Person = {
  id: 'daniel',
  name: 'Daniel Reyes',
  initials: 'DR',
  role: 'Account executive',
};
const leo: Person = { id: 'leo', name: 'Leo Marchetti', initials: 'LM', role: 'Sales development' };
const nina: Person = { id: 'nina', name: 'Nina Alvarez', initials: 'NA', role: 'Customer success' };

/** The person the page is about. */
export const profile = {
  id: 'jonas',
  name: 'Jonas Weber',
  initials: 'JW',
  role: 'Account executive',
  team: 'New business',
  location: 'London, United Kingdom',
  timeZone: 'Europe/London',
  email: 'jonas@lumenstudio.co',
  /** A UK drama number (020 7946 0xxx): never a real line. */
  phone: '+44 20 7946 0418',
  about: [
    'Runs new business with logistics and energy companies in the UK and the Nordics, from first call to signed order form.',
    'Joined Lumen Studio in March 2023 after five years in B2B software sales. Ask him about pilots that turn into annual plans.',
  ],
  /** Closed this quarter against the quarter's quota. */
  closed: 164_200,
  quota: 180_000,
  leaderboard: { rank: 1, of: 5 },
  /** Who follows Jonas, and whom he follows; the signed-in user joins the first by following. */
  followers: [priya, tom, elena, daniel, leo, nina],
  following: [me, priya, tom, elena, daniel],
};

/** Ids of the people the signed-in user follows when the page opens: not Jonas yet. */
export const followingAtStart = ['priya', 'elena', 'daniel'];

export type Deal = {
  id: string;
  customer: string;
  /** What is being sold, under the customer. */
  name: string;
  stage: 'Discovery' | 'Proposal' | 'Negotiation';
  /** Value a year, in dollars. */
  amount: number;
  closeDate: string;
};

/** Jonas's open deals, closing soonest first. */
export const openDeals: Deal[] = [
  {
    id: 'atlas',
    customer: 'Atlas Robotics',
    name: 'Annual plan, 120 seats',
    stage: 'Negotiation',
    amount: 32_000,
    closeDate: '2026-11-27',
  },
  {
    id: 'tidewater',
    customer: 'Tidewater Energy',
    name: 'Pilot, 30 seats',
    stage: 'Proposal',
    amount: 14_400,
    closeDate: '2026-12-11',
  },
  {
    id: 'marlow',
    customer: 'Marlow & Finch',
    name: 'Annual plan, 75 seats',
    stage: 'Proposal',
    amount: 36_000,
    closeDate: '2026-12-18',
  },
  {
    id: 'juniper',
    customer: 'Juniper Legal',
    name: 'Annual plan, 60 seats',
    stage: 'Discovery',
    amount: 28_800,
    closeDate: '2027-01-22',
  },
];

export type ActivityKind = 'stage' | 'call' | 'email' | 'note' | 'deal';

export type Activity = {
  id: string;
  kind: ActivityKind;
  /** What he did, as the line starts ("Logged a call with"). */
  action: string;
  /** What or whom it was done to, read after the action. */
  subject?: string;
  /** What it said or changed, under the line: the call notes, the note, the stages. */
  detail?: string;
  /** ISO date and time. */
  at: string;
};

/** What Jonas did lately, newest first. Every line is his, so it starts with the verb. */
export const activity: Activity[] = [
  {
    id: 'stage-atlas',
    kind: 'stage',
    action: 'Moved',
    subject: 'Atlas Robotics, annual plan',
    detail: 'Proposal → Negotiation',
    at: '2026-11-10T13:10:00Z',
  },
  {
    id: 'call-tidewater',
    kind: 'call',
    action: 'Logged a call with',
    subject: 'Tidewater Energy',
    detail:
      'Walked their VP of operations through the pilot plan. They want the proposal before the board meets on December 2.',
    at: '2026-11-09T16:30:00Z',
  },
  {
    id: 'email-marlow',
    kind: 'email',
    action: 'Sent a proposal to',
    subject: 'Marlow & Finch',
    at: '2026-11-05T10:05:00Z',
  },
  {
    id: 'deal-halcyon',
    kind: 'deal',
    action: 'Closed',
    subject: 'Halcyon Freight, annual plan',
    detail: 'Won at $48,000 a year, the largest deal of the quarter.',
    at: '2026-10-28T14:00:00Z',
  },
  {
    id: 'note-juniper',
    kind: 'note',
    action: 'Added a note to',
    subject: 'Juniper Legal',
    detail: 'The head of operations is the champion; procurement wants a security review first.',
    at: '2026-10-26T09:20:00Z',
  },
];

/** What Jonas reached this year, newest first. */
export const achievements: Milestone[] = [
  { id: 'halcyon', title: 'Largest deal this quarter', date: '2026-10-28', icon: RiHandCoinLine },
  { id: 'q3-quota', title: 'Quota reached in Q3', date: '2026-09-24', icon: RiFlagLine },
  {
    id: 'year-500k',
    title: 'First $500,000 year',
    date: '2026-08-14',
    icon: RiMoneyDollarCircleLine,
  },
  { id: 'june-five', title: 'Five deals closed in June', date: '2026-06-30', icon: RiStackLine },
];
