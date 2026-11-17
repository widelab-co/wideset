import type { AvatarColor } from '@wideset/react';

export const ACCOUNT = { name: 'Nina Alvarez', initials: 'NA' };

export const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Customers', href: '#customers' },
  { label: 'Deals', href: '#deals' },
  { label: 'Sales', href: '#sales' },
  { label: 'Reports', href: '#reports' },
];

/** Today, and the quarter the page measures. */
export const TODAY = '2026-12-14';
export const QUARTER = { label: 'Q4 2026', from: '2026-10-01', to: '2026-12-31' };

/** The quarter's key figures against their targets. */
export const KEY_FIGURES: {
  label: string;
  value: number;
  target: number;
  unit: 'usd' | 'count';
}[] = [
  {
    label: 'Closed won',
    value: 412_300,
    target: 500_000,
    unit: 'usd',
  },
  {
    label: 'New pipeline',
    value: 1_184_000,
    target: 1_500_000,
    unit: 'usd',
  },
  {
    label: 'Deals won',
    value: 38,
    target: 45,
    unit: 'count',
  },
  {
    label: 'Meetings booked',
    value: 334,
    target: 320,
    unit: 'count',
  },
];

/** Open deals by stage, earliest stage first. */
export const PIPELINE = [
  { stage: 'Qualified', deals: 42, amount: 486_000 },
  { stage: 'Discovery', deals: 31, amount: 402_500 },
  { stage: 'Proposal', deals: 18, amount: 268_400 },
  { stage: 'Negotiation', deals: 11, amount: 171_200 },
  { stage: 'Commit', deals: 6, amount: 94_800 },
];

export type Rep = { name: string; initials: string; color: AvatarColor };

const MAYA: Rep = { name: 'Maya Okafor', initials: 'MO', color: 'purple' };
const DANIEL: Rep = { name: 'Daniel Reyes', initials: 'DR', color: 'blue' };
const PRIYA: Rep = { name: 'Priya Shah', initials: 'PS', color: 'orange' };
const LEO: Rep = { name: 'Leo Marchetti', initials: 'LM', color: 'teal' };
const TOM: Rep = { name: 'Tom Becker', initials: 'TB', color: 'pink' };

/** Each rep's quarter so far; together they make the closed won figure. */
export const REPS = [
  { rep: MAYA, won: 118_400, deals: 9, quota: 100_000 },
  { rep: DANIEL, won: 96_200, deals: 8, quota: 100_000 },
  { rep: PRIYA, won: 84_700, deals: 10, quota: 100_000 },
  { rep: LEO, won: 63_500, deals: 6, quota: 100_000 },
  { rep: TOM, won: 49_500, deals: 5, quota: 100_000 },
];

export type Deal = {
  id: string;
  name: string;
  account: string;
  owner: Rep;
  stage: 'Proposal' | 'Negotiation' | 'Commit';
  amount: number;
  /** Expected close date. */
  close: string;
};

/** Open deals expected to close before the month ends. */
export const CLOSING: Deal[] = [
  {
    id: 'd-2041',
    name: 'Annual plan, 120 seats',
    account: 'Halcyon Health',
    owner: MAYA,
    stage: 'Commit',
    amount: 24_000,
    close: '2026-12-18',
  },
  {
    id: 'd-2017',
    name: 'Revenue suite expansion',
    account: 'Northwind Freight',
    owner: DANIEL,
    stage: 'Negotiation',
    amount: 38_500,
    close: '2026-12-22',
  },
  {
    id: 'd-2063',
    name: 'Analytics add-on',
    account: 'Brightline Dental',
    owner: PRIYA,
    stage: 'Commit',
    amount: 9_600,
    close: '2026-12-16',
  },
  {
    id: 'd-2072',
    name: 'Team plan, 45 seats',
    account: 'Kestrel Labs',
    owner: TOM,
    stage: 'Proposal',
    amount: 13_500,
    close: '2026-12-29',
  },
  {
    id: 'd-1988',
    name: 'Enterprise pilot',
    account: 'Mosaic Bank',
    owner: MAYA,
    stage: 'Negotiation',
    amount: 52_000,
    close: '2026-12-30',
  },
  {
    id: 'd-2035',
    name: 'Migration from Salesforce',
    account: 'Fernhill Studio',
    owner: LEO,
    stage: 'Negotiation',
    amount: 18_750,
    close: '2026-12-21',
  },
  {
    id: 'd-2079',
    name: 'Support tier upgrade',
    account: 'Atlas Robotics',
    owner: PRIYA,
    stage: 'Commit',
    amount: 7_200,
    close: '2026-12-15',
  },
  {
    id: 'd-2002',
    name: 'Multi-region rollout',
    account: 'Junipero Foods',
    owner: DANIEL,
    stage: 'Proposal',
    amount: 31_400,
    close: '2026-12-31',
  },
  {
    id: 'd-2051',
    name: 'Renewal, 3 years',
    account: 'Corvid Security',
    owner: LEO,
    stage: 'Commit',
    amount: 15_900,
    close: '2026-12-17',
  },
  {
    id: 'd-2090',
    name: 'Annual plan, 60 seats',
    account: 'Quillon Legal',
    owner: DANIEL,
    stage: 'Commit',
    amount: 12_600,
    close: '2026-12-19',
  },
  {
    id: 'd-2068',
    name: 'Onboarding services',
    account: 'Larkspur Hotels',
    owner: PRIYA,
    stage: 'Proposal',
    amount: 4_800,
    close: '2026-12-28',
  },
  {
    id: 'd-2084',
    name: 'Starter to Growth',
    account: 'Pellucid Optics',
    owner: TOM,
    stage: 'Negotiation',
    amount: 6_450,
    close: '2026-12-23',
  },
];
