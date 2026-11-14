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
import type { AvatarColor } from '@wideset/react';

/*
  Lumen Studio's new-business pipeline on 10 November 2026: 23 open deals in five stages, owned by
  Maya and five teammates. Three of them have a close date that has already passed. Maya's four
  deals match what Home lists for her (Halcyon Freight in Negotiation, Northwind Health in
  Proposal, Kestrel Analytics in Discovery, Cobalt Security in Commit).
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

/** Today, as the close dates are judged. */
export const TODAY = '2026-11-10';

export const STAGES = [
  { id: 'qualified', label: 'Qualified' },
  { id: 'discovery', label: 'Discovery' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'commit', label: 'Commit' },
] as const;

export type StageId = (typeof STAGES)[number]['id'];

export type Person = { id: string; name: string; initials: string; color: AvatarColor };

export const PEOPLE: Person[] = [
  { id: 'maya', name: 'Maya Okafor', initials: 'MO', color: 'orange' },
  { id: 'jonas', name: 'Jonas Weber', initials: 'JW', color: 'blue' },
  { id: 'priya', name: 'Priya Raman', initials: 'PR', color: 'purple' },
  { id: 'tom', name: 'Tom Becker', initials: 'TB', color: 'green' },
  { id: 'elena', name: 'Elena Silva', initials: 'ES', color: 'pink' },
  { id: 'daniel', name: 'Daniel Reyes', initials: 'DR', color: 'teal' },
];

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
  customer: string;
  name: string;
  stage: StageId;
  /** Annual contract value, in US dollars. */
  amount: number;
  /** Expected close, a calendar day. */
  close: string;
  ownerId: string;
};

/** The open deals; within a stage, in the order the board shows them. */
export const initialDeals: Deal[] = [
  {
    id: 'northwind-reporting',
    customer: 'Northwind Health',
    name: 'Reporting add-on',
    stage: 'qualified',
    amount: 5_400,
    close: '2026-12-11',
    ownerId: 'maya',
  },
  {
    id: 'atlas-forecasting',
    customer: 'Atlas Robotics',
    name: 'Forecasting add-on',
    stage: 'qualified',
    amount: 8_400,
    close: '2026-12-18',
    ownerId: 'jonas',
  },
  {
    id: 'cobalt-emea',
    customer: 'Cobalt Security',
    name: 'EMEA team, 30 seats',
    stage: 'qualified',
    amount: 14_000,
    close: '2027-01-08',
    ownerId: 'tom',
  },
  {
    id: 'juniper-growth',
    customer: 'Juniper Legal',
    name: 'Growth plan, 25 seats',
    stage: 'qualified',
    amount: 11_700,
    close: '2027-01-15',
    ownerId: 'daniel',
  },
  {
    id: 'tidewater-field',
    customer: 'Tidewater Energy',
    name: 'Field sales, 40 seats',
    stage: 'qualified',
    amount: 18_700,
    close: '2027-01-29',
    ownerId: 'elena',
  },
  {
    id: 'marlow-pilot',
    customer: 'Marlow & Finch',
    name: 'Pilot, London office',
    stage: 'qualified',
    amount: 6_200,
    close: '2027-02-12',
    ownerId: 'priya',
  },
  {
    id: 'halcyon-customs',
    customer: 'Halcyon Freight',
    name: 'Customs team, 15 seats',
    stage: 'qualified',
    amount: 7_000,
    close: '2027-02-26',
    ownerId: 'tom',
  },
  {
    id: 'halcyon-dispatch',
    customer: 'Halcyon Freight',
    name: 'Dispatcher seats',
    stage: 'discovery',
    amount: 5_600,
    close: '2026-11-06',
    ownerId: 'priya',
  },
  {
    id: 'kestrel-team',
    customer: 'Kestrel Analytics',
    name: 'Team plan, 45 seats',
    stage: 'discovery',
    amount: 9_600,
    close: '2026-12-05',
    ownerId: 'maya',
  },
  {
    id: 'juniper-contracts',
    customer: 'Juniper Legal',
    name: 'Contract analytics',
    stage: 'discovery',
    amount: 12_500,
    close: '2026-12-19',
    ownerId: 'elena',
  },
  {
    id: 'atlas-annual',
    customer: 'Atlas Robotics',
    name: 'Annual plan, 80 seats',
    stage: 'discovery',
    amount: 37_400,
    close: '2026-12-30',
    ownerId: 'jonas',
  },
  {
    id: 'tidewater-forecast',
    customer: 'Tidewater Energy',
    name: 'Renewal forecasting',
    stage: 'discovery',
    amount: 16_800,
    close: '2027-01-22',
    ownerId: 'daniel',
  },
  {
    id: 'cobalt-sso',
    customer: 'Cobalt Security',
    name: 'SSO and audit log',
    stage: 'proposal',
    amount: 7_200,
    close: '2026-11-04',
    ownerId: 'jonas',
  },
  {
    id: 'northwind-clinics',
    customer: 'Northwind Health',
    name: 'Clinic network, 60 seats',
    stage: 'proposal',
    amount: 18_500,
    close: '2026-11-27',
    ownerId: 'maya',
  },
  {
    id: 'kestrel-warehouse',
    customer: 'Kestrel Analytics',
    name: 'Data warehouse sync',
    stage: 'proposal',
    amount: 10_900,
    close: '2026-12-08',
    ownerId: 'elena',
  },
  {
    id: 'marlow-scale',
    customer: 'Marlow & Finch',
    name: 'Scale upgrade',
    stage: 'proposal',
    amount: 24_800,
    close: '2026-12-12',
    ownerId: 'tom',
  },
  {
    id: 'juniper-scale',
    customer: 'Juniper Legal',
    name: 'Scale plan, 40 seats',
    stage: 'negotiation',
    amount: 33_100,
    close: '2026-11-07',
    ownerId: 'daniel',
  },
  {
    id: 'atlas-support',
    customer: 'Atlas Robotics',
    name: 'Support tier upgrade',
    stage: 'negotiation',
    amount: 7_200,
    close: '2026-11-20',
    ownerId: 'priya',
  },
  {
    id: 'halcyon-renewal',
    customer: 'Halcyon Freight',
    name: 'Renewal, 120 seats',
    stage: 'negotiation',
    amount: 24_000,
    close: '2026-11-30',
    ownerId: 'maya',
  },
  {
    id: 'tidewater-annual',
    customer: 'Tidewater Energy',
    name: 'Annual plan, 150 seats',
    stage: 'negotiation',
    amount: 70_200,
    close: '2026-12-15',
    ownerId: 'elena',
  },
  {
    id: 'cobalt-annual',
    customer: 'Cobalt Security',
    name: 'Annual plan, 45 seats',
    stage: 'commit',
    amount: 21_000,
    close: '2026-11-14',
    ownerId: 'maya',
  },
  {
    id: 'marlow-onboarding',
    customer: 'Marlow & Finch',
    name: 'Onboarding package',
    stage: 'commit',
    amount: 4_500,
    close: '2026-11-21',
    ownerId: 'tom',
  },
  {
    id: 'northwind-analytics',
    customer: 'Northwind Health',
    name: 'Analytics seats',
    stage: 'commit',
    amount: 9_800,
    close: '2026-11-28',
    ownerId: 'jonas',
  },
];

export const ownerOptions = PEOPLE.map(({ id, name }) => ({ value: id, label: name }));

export type CloseWindow = 'overdue' | 'this-month' | 'next-month' | 'later';

export const closeOptions: { value: CloseWindow; label: string }[] = [
  { value: 'overdue', label: 'Overdue' },
  { value: 'this-month', label: 'This month' },
  { value: 'next-month', label: 'Next month' },
  { value: 'later', label: 'Later' },
];

/** Which window a close date falls in, judged from today. */
export function closeWindow(close: string): CloseWindow {
  if (close < TODAY) return 'overdue';
  if (close.slice(0, 7) === TODAY.slice(0, 7)) return 'this-month';
  if (close.slice(0, 7) === '2026-12') return 'next-month';
  return 'later';
}
