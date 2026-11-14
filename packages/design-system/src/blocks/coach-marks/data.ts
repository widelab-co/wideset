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
  Jonas Weber joined Lumen Studio this week and opens Customers for the first time: the page shows
  him a four-step tour of the controls he will use every day. The list is the workspace's own
  customers, seen from Tuesday 10 November 2026, 4 PM.
*/

/** The product is Orbit; the workspace is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

/** The moment the sample is seen from, so relative dates stay put. */
export const NOW = new Date('2026-11-10T16:00');

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

export type Plan = 'trial' | 'team' | 'business' | 'enterprise';
export type Health = 'healthy' | 'at-risk' | 'churned';
export type OwnerId = 'maya' | 'jonas' | 'priya' | 'tom' | 'elena' | 'daniel';

export type Customer = {
  /** The customer's domain doubles as its id. */
  id: string;
  name: string;
  plan: Plan;
  /** Monthly recurring revenue in USD; 0 while on trial or after churning. */
  mrr: number;
  health: Health;
  owner: OwnerId;
  /** Local date and time of the last e-mail, call or product event. */
  lastActivity: string;
};

export const OWNERS: Record<OwnerId, { name: string; initials: string }> = {
  maya: { name: 'Maya Okafor', initials: 'MO' },
  jonas: { name: 'Jonas Weber', initials: 'JW' },
  priya: { name: 'Priya Raman', initials: 'PR' },
  tom: { name: 'Tom Becker', initials: 'TB' },
  elena: { name: 'Elena Silva', initials: 'ES' },
  daniel: { name: 'Daniel Reyes', initials: 'DR' },
};

export const PLAN_LABEL: Record<Plan, string> = {
  trial: 'Trial',
  team: 'Team',
  business: 'Business',
  enterprise: 'Enterprise',
};

/** Health is a judgement of the account, so each state takes its semantic colour. */
export const HEALTH: Record<Health, { label: string; color: 'positive' | 'notice' | 'negative' }> =
  {
    healthy: { label: 'Healthy', color: 'positive' },
    'at-risk': { label: 'At risk', color: 'notice' },
    churned: { label: 'Churned', color: 'negative' },
  };

/** A tab: a saved segment of the list. At risk overlaps Active and Trial. */
export type Segment = { value: string; label: string; match: (customer: Customer) => boolean };

export const SEGMENTS: Segment[] = [
  { value: 'all', label: 'All', match: () => true },
  { value: 'active', label: 'Active', match: (c) => c.plan !== 'trial' && c.health !== 'churned' },
  { value: 'trial', label: 'Trial', match: (c) => c.plan === 'trial' },
  { value: 'at-risk', label: 'At risk', match: (c) => c.health === 'at-risk' },
  { value: 'churned', label: 'Churned', match: (c) => c.health === 'churned' },
];

export const planOptions = Object.entries(PLAN_LABEL).map(([value, label]) => ({ value, label }));
export const ownerOptions = Object.entries(OWNERS).map(([value, o]) => ({ value, label: o.name }));
export const healthOptions = Object.entries(HEALTH).map(([value, h]) => ({
  value,
  label: h.label,
}));

export type SortKey = 'lastActivity' | 'mrr' | 'name';
export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'lastActivity', label: 'Sort by last activity' },
  { value: 'mrr', label: 'Sort by MRR' },
  { value: 'name', label: 'Sort by name' },
];

const customer = (
  name: string,
  id: string,
  plan: Plan,
  mrr: number,
  health: Health,
  owner: OwnerId,
  lastActivity: string,
): Customer => ({ id, name, plan, mrr, health, owner, lastActivity });

// One customer per line: name, domain, plan, MRR, health, owner, last activity.
// prettier-ignore
export const CUSTOMERS: Customer[] = [
  customer('Halcyon Freight', 'halcyonfreight.com', 'enterprise', 18500, 'healthy', 'jonas', '2026-11-10T15:42'),
  customer('Atlas Robotics', 'atlasrobotics.io', 'trial', 0, 'healthy', 'tom', '2026-11-10T14:55'),
  customer('Northwind Health', 'northwindhealth.com', 'business', 2400, 'healthy', 'maya', '2026-11-10T13:05'),
  customer('Kestrel Analytics', 'kestrel.io', 'business', 3600, 'healthy', 'tom', '2026-11-10T11:30'),
  customer('Juniper Legal', 'juniperlegal.com', 'business', 1650, 'healthy', 'priya', '2026-11-10T09:12'),
  customer('Cobalt Security', 'cobaltsec.io', 'enterprise', 8200, 'healthy', 'jonas', '2026-11-10T08:40'),
  customer('Marlow & Finch', 'marlowfinch.com', 'team', 490, 'at-risk', 'elena', '2026-11-09T17:10'),
  customer('Tidewater Energy', 'tidewater.energy', 'enterprise', 12800, 'healthy', 'daniel', '2026-11-07T10:15'),
  customer('Brightline Dental', 'brightlinedental.com', 'team', 690, 'at-risk', 'priya', '2026-10-14T10:20'),
  customer('Quarry Coffee Co.', 'quarrycoffee.com', 'team', 0, 'churned', 'maya', '2026-09-22T12:00'),
];

/** The controls the tour points at, each wrapped in a `TourSpot` on the page. */
export type TourTarget = 'segments' | 'filters' | 'row-menu' | 'add';

export type TourStep = {
  target: TourTarget;
  title: string;
  /** One or two lines: what the control does, and when to reach for it. */
  body: string;
  /** Which end of the target the mark lines up with, so it stays on the page. */
  align: 'start' | 'end';
};

/** The tour, in the page's reading order: the views, narrowing them, one row, adding. */
export const TOUR: TourStep[] = [
  {
    target: 'segments',
    title: 'Segments',
    body: 'Switch between all customers, active ones, trials and those at risk. At risk is the list to check each morning.',
    align: 'start',
  },
  {
    target: 'filters',
    title: 'Filters',
    body: 'Narrow the list by plan, owner or health. Filters stay on while you switch segments.',
    align: 'start',
  },
  {
    target: 'row-menu',
    title: 'Row actions',
    body: 'Open a customer, assign it to yourself or copy its domain from the menu at the end of each row.',
    align: 'end',
  },
  {
    target: 'add',
    title: 'Add a customer',
    body: 'Add customers one at a time here. To bring in a list, use Import beside it.',
    align: 'end',
  },
];
