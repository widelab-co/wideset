import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiCalendarCheckLine,
  RiContactsBook3Line,
  RiFlagFill,
  RiFlagLine,
  RiHandCoinLine,
  RiHome5Line,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartLine,
  RiMoneyDollarCircleLine,
  RiPieChart2Line,
  RiPlugLine,
  RiPresentationLine,
  RiQuestionLine,
  RiSettings3Line,
  RiTeamLine,
} from '@remixicon/react';

/*
  The sales team's goals for Q4 2026 (Oct 1 – Dec 31), seen on Tuesday 10 November, 51 days
  before the quarter ends. A goal's figure is what was counted before its key results plus the key
  results ticked off, so ticking one moves the figure, and the state is worked out from the figure
  against the pace the due date asks for. The leaderboard and the milestones agree with the goals:
  Nina's renewals goal is met, Leo has booked 25 first meetings.
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
  { id: 'goals', label: 'Goals', icon: RiFlagLine, activeIcon: RiFlagFill },
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

/** The sample is frozen on this day. */
export const TODAY = '2026-11-10';
export const QUARTER = { label: 'Q4 2026', from: '2026-10-01', to: '2026-12-31' };

export type Person = {
  id: string;
  name: string;
  initials: string;
  /** Pinned only for the signed-in user, to match the sidebar's account. */
  color?: 'orange';
};

export const maya: Person = {
  id: 'maya',
  name: account.name,
  initials: account.initials,
  color: 'orange',
};
const jonas: Person = { id: 'jonas', name: 'Jonas Weber', initials: 'JW' };
const priya: Person = { id: 'priya', name: 'Priya Raman', initials: 'PR' };
const tom: Person = { id: 'tom', name: 'Tom Becker', initials: 'TB' };
const daniel: Person = { id: 'daniel', name: 'Daniel Reyes', initials: 'DR' };
const leo: Person = { id: 'leo', name: 'Leo Marchetti', initials: 'LM' };
const nina: Person = { id: 'nina', name: 'Nina Alvarez', initials: 'NA' };

/** Who can own a goal, in the order the owner field lists them. */
export const people: Person[] = [maya, jonas, priya, daniel, nina, leo, tom];

/** What a goal counts. Money is counted in dollars, the rest one by one. */
export type Measure = 'revenue' | 'pipeline' | 'meetings' | 'renewals' | 'demos';

export const MEASURES: Record<Measure, { label: string; money?: true; unit?: string }> = {
  revenue: { label: 'Closed revenue', money: true },
  pipeline: { label: 'Pipeline created', money: true },
  meetings: { label: 'Meetings booked', unit: 'meetings' },
  renewals: { label: 'Renewals signed', unit: 'renewals' },
  demos: { label: 'Demos run', unit: 'demos' },
};

/** One thing that adds to a goal's figure once it is done: a deal, a meeting, a renewal. */
export type KeyResult = { id: string; title: string; value: number };

export type Goal = {
  id: string;
  name: string;
  owner: Person;
  measure: Measure;
  target: number;
  /** What was counted towards the goal before its key results. */
  counted: number;
  keyResults: KeyResult[];
  /** The day the goal started counting and the day it is due. */
  start: string;
  due: string;
};

export const goals: Goal[] = [
  {
    id: 'new-business',
    name: 'New business',
    owner: jonas,
    measure: 'revenue',
    target: 300_000,
    counted: 151_600,
    keyResults: [
      { id: 'halcyon', title: 'Halcyon Freight, annual plan', value: 48_000 },
      { id: 'atlas', title: 'Atlas Robotics, 120 seats', value: 32_000 },
      { id: 'tidewater', title: 'Tidewater Energy, pilot', value: 14_400 },
    ],
    start: QUARTER.from,
    due: QUARTER.to,
  },
  {
    id: 'expansion',
    name: 'Expansion in existing accounts',
    owner: priya,
    measure: 'revenue',
    target: 150_000,
    counted: 38_000,
    keyResults: [
      { id: 'northwind', title: 'Northwind Health, 40 more seats', value: 19_200 },
      { id: 'kestrel', title: 'Kestrel Analytics, SSO add-on', value: 9_600 },
      { id: 'cobalt', title: 'Cobalt Security, second team', value: 14_400 },
    ],
    start: QUARTER.from,
    due: QUARTER.to,
  },
  {
    id: 'meetings',
    name: 'First meetings',
    owner: leo,
    measure: 'meetings',
    target: 60,
    counted: 24,
    keyResults: [
      { id: 'marlow', title: 'Marlow & Finch, managing partner', value: 1 },
      { id: 'juniper', title: 'Juniper Legal, head of operations', value: 1 },
    ],
    start: QUARTER.from,
    due: QUARTER.to,
  },
  {
    id: 'renewals',
    name: 'Renewals before year end',
    owner: nina,
    measure: 'renewals',
    target: 12,
    counted: 9,
    keyResults: [
      { id: 'northwind', title: 'Northwind Health', value: 1 },
      { id: 'kestrel', title: 'Kestrel Analytics', value: 1 },
      { id: 'cobalt', title: 'Cobalt Security', value: 1 },
    ],
    start: QUARTER.from,
    due: '2026-11-30',
  },
  {
    id: 'demos',
    name: 'Technical demos',
    owner: tom,
    measure: 'demos',
    target: 30,
    counted: 10,
    keyResults: [
      { id: 'atlas', title: 'Atlas Robotics, security deep dive', value: 1 },
      { id: 'tidewater', title: 'Tidewater Energy, pilot setup', value: 1 },
      { id: 'marlow', title: 'Marlow & Finch, first demo', value: 1 },
    ],
    start: QUARTER.from,
    due: QUARTER.to,
  },
  {
    id: 'pipeline',
    name: 'New pipeline',
    owner: daniel,
    measure: 'pipeline',
    target: 600_000,
    counted: 160_000,
    keyResults: [
      { id: 'juniper', title: 'Juniper Legal, 60 seats', value: 28_800 },
      { id: 'marlow', title: 'Marlow & Finch, firm-wide plan', value: 36_000 },
    ],
    start: QUARTER.from,
    due: QUARTER.to,
  },
];

/** The key results done when the page opens, by goal. */
export const doneAtStart: Record<string, string[]> = {
  'new-business': ['halcyon'],
  expansion: ['kestrel'],
  meetings: ['marlow'],
  renewals: ['northwind', 'kestrel', 'cobalt'],
  demos: ['atlas'],
  pipeline: [],
};

/** A goal's figure: what was counted before, plus the key results ticked off. */
export const figureOf = (goal: Goal, done: string[]) =>
  goal.counted +
  goal.keyResults.reduce((sum, result) => sum + (done.includes(result.id) ? result.value : 0), 0);

export type GoalState = 'On track' | 'At risk' | 'Behind' | 'Done';

const DAY = 86_400_000;
const days = (from: string, to: string) => (Date.parse(to) - Date.parse(from)) / DAY;

/**
 * Orbit's judgement: the share reached against the share of the time gone. Within 90% of the pace
 * is on track, within 70% at risk, anything slower behind. A goal that has met its target is done.
 */
export function stateOf(goal: Goal, figure: number, today = TODAY): GoalState {
  if (figure >= goal.target) return 'Done';
  const elapsed = Math.min(Math.max(days(goal.start, today) / days(goal.start, goal.due), 0), 1);
  if (elapsed === 0) return 'On track';
  const pace = figure / goal.target / elapsed;
  return pace >= 0.9 ? 'On track' : pace >= 0.7 ? 'At risk' : 'Behind';
}

export type Standing = {
  person: Person;
  /** Closed this quarter so far. */
  revenue: number;
  quota: number;
  /** Where they stood a week ago. */
  lastWeek: number;
};

/** The team's closed revenue this quarter, in no order: the leaderboard ranks it. */
export const standings: Standing[] = [
  { person: jonas, revenue: 164_200, quota: 180_000, lastWeek: 2 },
  { person: priya, revenue: 151_800, quota: 180_000, lastWeek: 1 },
  { person: daniel, revenue: 118_900, quota: 180_000, lastWeek: 3 },
  { person: maya, revenue: 96_400, quota: 120_000, lastWeek: 5 },
  { person: nina, revenue: 88_300, quota: 150_000, lastWeek: 4 },
];

export type Achievement = {
  id: string;
  /** What was reached, as a short line. */
  title: string;
  person: Person;
  /** The day it was reached. */
  date: string;
  icon: RemixiconComponentType;
};

/** Milestones reached this quarter, newest first. */
export const achievements: Achievement[] = [
  {
    id: 'meetings-25',
    title: '25 first meetings booked',
    person: leo,
    date: '2026-11-09',
    icon: RiCalendarCheckLine,
  },
  {
    id: 'renewals-done',
    title: 'Renewals goal reached',
    person: nina,
    date: '2026-11-04',
    icon: RiFlagLine,
  },
  {
    id: 'demos-10',
    title: 'Ten demos in October',
    person: tom,
    date: '2026-10-31',
    icon: RiPresentationLine,
  },
  {
    id: 'halcyon',
    title: 'Largest deal this quarter',
    person: jonas,
    date: '2026-10-28',
    icon: RiHandCoinLine,
  },
  {
    id: 'priya-100k',
    title: 'First $100,000 quarter',
    person: priya,
    date: '2026-10-22',
    icon: RiMoneyDollarCircleLine,
  },
];
