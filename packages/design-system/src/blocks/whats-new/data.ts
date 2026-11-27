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
  RiMegaphoneLine,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionLine,
  RiSettings3Line,
  RiTeamLine,
} from '@remixicon/react';

/*
  Maya's Tuesday in Orbit, the morning after a release: Home opens with what changed. The latest
  update is the condition filter on Deals (the filter-popover block); the earlier ones are the
  forecast categories, customer health and meeting notes that other screens already show.
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

/** In the help area, over Help and support: it opens the updates, it is not a page. */
export const whatsNewLink = { label: 'What’s new', icon: RiMegaphoneLine };
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
export const doneAtStart = ['forecast', 'attendees'];

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

export type Update = {
  id: string;
  /** The day it shipped (`2026-11-06`). */
  date: string;
  title: string;
  /** One line: what it does. */
  summary: string;
  /** The rest, read on opening: how it works and why it is there. */
  detail: string;
};

/** The latest update, shown in full with a drawn preview and a way to try it. */
export const latest = {
  id: 'deal-filters',
  date: '2026-11-06',
  title: 'Filters with conditions on Deals',
  what: 'Build a filter on the deals list from conditions: a field, a test and a value, such as stage is Proposal or amount greater than $10,000. Join them with and or or; the list keeps them as chips above the table, each one removable.',
  why: 'Pipeline reviews used to start with an export to a spreadsheet. Now the list you review is the list in Orbit.',
  /** Where Try it goes: the deals list, with the filter open. */
  href: '#deals?filter=open',
  readMore: '#changelog/deal-filters',
};

/** Earlier updates, newest first. */
export const earlier: Update[] = [
  {
    id: 'forecast-categories',
    date: '2026-10-23',
    title: 'Forecast categories',
    summary: 'Mark each deal as commit, best case or pipeline.',
    detail:
      'The category sits beside the stage, so a deal can be in negotiation and still not one you would commit to. Revenue adds the three up against your target.',
  },
  {
    id: 'customer-health',
    date: '2026-10-09',
    title: 'Customer health on the list',
    summary: 'Each customer shows as healthy, at risk or churned.',
    detail:
      'A customer turns at risk when its seats in use drop by a fifth or a renewal conversation goes quiet for two weeks. The At risk tab on Customers collects them.',
  },
  {
    id: 'meeting-notes',
    date: '2026-09-25',
    title: 'Meeting notes on the timeline',
    summary: 'Notes from a call land on the customer’s activity timeline.',
    detail:
      'Connect your calendar under Integrations and every meeting with a customer gets a place for notes. They join the e-mails on the timeline as soon as you save them.',
  },
];
