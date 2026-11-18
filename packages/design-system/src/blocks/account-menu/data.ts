import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiComputerLine,
  RiContactsBook3Line,
  RiHandCoinLine,
  RiHome5Fill,
  RiHome5Line,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartLine,
  RiMoonLine,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionLine,
  RiSettings3Line,
  RiSunLine,
  RiTeamLine,
} from '@remixicon/react';
import type { AvatarColor } from '@wideset/react';

/*
  Maya's Tuesday afternoon in Orbit, Home open behind the account menu. She belongs to three
  workspaces (Lumen Studio is the one open) and is signed in twice on this browser: as herself and
  as the studio's shared admin account.
*/

/** The product is Orbit; the workspace is Lumen Studio. */
export const product = { name: 'Orbit' };
export const account = { firstName: 'Maya' };

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

export type Workspace = {
  id: string;
  name: string;
  /** One letter is drawn at the menu's size, so each workspace starts with its own. */
  initials: string;
  color: AvatarColor;
};

/** The workspaces Maya belongs to; Lumen Studio is open. */
export const workspaces: Workspace[] = [
  { id: 'lumen', name: 'Lumen Studio', initials: 'LS', color: 'orange' },
  { id: 'sandbox', name: 'Sandbox', initials: 'SB', color: 'teal' },
  { id: 'northgate', name: 'Northgate Partners', initials: 'NP', color: 'blue' },
];

export type Account = {
  id: string;
  name: string;
  email: string;
  initials: string;
  color: AvatarColor;
};

/** The accounts signed in on this browser; Maya's own is in use. */
export const accounts: Account[] = [
  {
    id: 'maya',
    name: 'Maya Okafor',
    email: 'maya@lumenstudio.co',
    initials: 'MO',
    color: 'orange',
  },
  {
    id: 'admin',
    name: 'Lumen Studio admin',
    email: 'admin@lumenstudio.co',
    initials: 'LA',
    color: 'purple',
  },
];

export type Theme = 'light' | 'dark' | 'system';

export const THEMES: { value: Theme; label: string; icon: RemixiconComponentType }[] = [
  { value: 'light', label: 'Light', icon: RiSunLine },
  { value: 'dark', label: 'Dark', icon: RiMoonLine },
  { value: 'system', label: 'Match system', icon: RiComputerLine },
];
