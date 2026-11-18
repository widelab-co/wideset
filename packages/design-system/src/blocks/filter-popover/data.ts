import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiHandCoinFill,
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
  Maya is getting ready for Thursday's pipeline review: the deals in proposal or negotiation, worth
  over $10,000, closing before the year is out. The list already shows the stage filter; the filter
  popover is open on the two conditions she is adding to it.
*/

/** The product is Orbit; the workspace is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

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
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'inbox', label: 'Inbox', icon: RiInbox2Line },
  { id: 'customers', label: 'Customers', icon: RiContactsBook3Line },
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine, activeIcon: RiHandCoinFill },
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

/** The pipeline's stages, in order. A stage is a lifecycle state, so its badge stays neutral. */
export const STAGES = ['Discovery', 'Proposal', 'Negotiation', 'Commit', 'Won', 'Lost'] as const;
export type Stage = (typeof STAGES)[number];

export const OWNERS = {
  maya: 'Maya Okafor',
  jonas: 'Jonas Weber',
  priya: 'Priya Raman',
  tom: 'Tom Becker',
  elena: 'Elena Silva',
  daniel: 'Daniel Reyes',
  nina: 'Nina Alvarez',
};
export type OwnerId = keyof typeof OWNERS;

export const CUSTOMERS = [
  'Atlas Robotics',
  'Cobalt Security',
  'Halcyon Freight',
  'Juniper Legal',
  'Kestrel Analytics',
  'Marlow & Finch',
  'Northwind Health',
  'Tidewater Energy',
];

export type Deal = {
  id: string;
  name: string;
  customer: string;
  stage: Stage;
  owner: OwnerId;
  /** In US dollars, a year's worth. */
  amount: number;
  /** The day it is expected to close, or closed (`2026-11-20`). */
  closeDate: string;
};

const deal = (
  id: string,
  name: string,
  customer: string,
  stage: Stage,
  owner: OwnerId,
  amount: number,
  closeDate: string,
): Deal => ({ id, name, customer, stage, owner, amount, closeDate });

// One deal per line: id, name, customer, stage, owner, amount, close date.
// prettier-ignore
export const DEALS: Deal[] = [
  deal('d-1048', 'Annual plan, 120 seats', 'Halcyon Freight', 'Negotiation', 'jonas', 24000, '2026-11-20'),
  deal('d-1052', 'Business plan, 60 seats', 'Northwind Health', 'Proposal', 'maya', 18500, '2026-12-04'),
  deal('d-1057', 'Team plan, 45 seats', 'Kestrel Analytics', 'Discovery', 'tom', 9600, '2027-01-15'),
  deal('d-1041', 'Security add-on', 'Cobalt Security', 'Commit', 'jonas', 21000, '2026-11-14'),
  deal('d-1060', 'Pilot, 20 seats', 'Atlas Robotics', 'Discovery', 'tom', 6400, '2026-12-18'),
  deal('d-1044', 'Renewal, 35 seats', 'Juniper Legal', 'Negotiation', 'priya', 14200, '2026-11-28'),
  deal('d-1050', 'Renewal with a discount', 'Marlow & Finch', 'Proposal', 'elena', 5880, '2026-12-10'),
  deal('d-1055', 'Enterprise expansion', 'Tidewater Energy', 'Proposal', 'daniel', 42000, '2026-12-22'),
  deal('d-1036', 'Analytics add-on', 'Northwind Health', 'Won', 'maya', 7200, '2026-10-30'),
  deal('d-1032', 'Onboarding package', 'Halcyon Freight', 'Lost', 'jonas', 3500, '2026-10-21'),
  deal('d-1058', 'Data export add-on', 'Kestrel Analytics', 'Negotiation', 'tom', 4800, '2026-11-25'),
  deal('d-1062', 'Second region, 30 seats', 'Cobalt Security', 'Discovery', 'nina', 12600, '2027-02-05'),
];
