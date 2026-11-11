import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiHandCoinLine,
  RiHome5Line,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartLine,
  RiPieChart2Fill,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionLine,
  RiSettings3Line,
  RiTeamLine,
} from '@remixicon/react';

/*
  Lumen Studio's saved reports on a Tuesday afternoon. Maya is clearing out last year's board
  folder: fourteen reports, each mailed out on a schedule, shared with six teammates. A single
  report goes with a toast and Undo; the folder asks first.
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
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
  { id: 'revenue', label: 'Revenue', icon: RiLineChartLine },
  { id: 'reports', label: 'Reports', icon: RiPieChart2Line, activeIcon: RiPieChart2Fill },
];

export const settingsLinks: NavLink[] = [
  { id: 'general', label: 'General', icon: RiSettings3Line },
  { id: 'members', label: 'Members', icon: RiTeamLine },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

export type Person = { name: string; initials: string; color?: 'orange' };

export type PersonId = 'maya' | 'jonas' | 'priya' | 'elena' | 'nina';

export const PEOPLE: Record<PersonId, Person> = {
  maya: { name: account.name, initials: account.initials, color: 'orange' },
  jonas: { name: 'Jonas Weber', initials: 'JW' },
  priya: { name: 'Priya Raman', initials: 'PR' },
  elena: { name: 'Elena Silva', initials: 'ES' },
  nina: { name: 'Nina Alvarez', initials: 'NA' },
};

/**
 * A saved report, or a folder of them. A folder counts its reports and names who it is shared
 * with, so deleting it can say what goes with it and who loses access.
 */
export type Entry = {
  id: string;
  kind: 'folder' | 'report';
  name: string;
  owner: PersonId;
  /** Who else can open it, as the list says it. */
  sharedWith: string;
  /** A folder: the people it is shared with, by name; the first is named when they lose access. */
  people?: string[];
  /** A folder: how many reports it holds. */
  reports?: number;
  /** A report: when it is sent out, if it is. */
  schedule?: string;
  /** Calendar day of the last change. */
  updated: string;
};

/** Folders first, then the reports at the top level, last changed first. */
export const ENTRIES: Entry[] = [
  {
    id: 'board-reporting',
    kind: 'folder',
    name: 'Board reporting',
    owner: 'maya',
    sharedWith: '6 people',
    people: [
      'Jonas Weber',
      'Priya Raman',
      'Tom Becker',
      'Elena Silva',
      'Daniel Reyes',
      'Nina Alvarez',
    ],
    reports: 14,
    updated: '2026-11-06',
  },
  {
    id: 'team-forecasts',
    kind: 'folder',
    name: 'Team forecasts',
    owner: 'elena',
    sharedWith: 'Sales team',
    people: ['Jonas Weber', 'Priya Raman', 'Daniel Reyes', 'Leo Marchetti'],
    reports: 9,
    updated: '2026-11-09',
  },
  {
    id: 'pipeline-by-stage',
    kind: 'report',
    name: 'Pipeline by stage',
    owner: 'maya',
    sharedWith: 'Only you',
    schedule: 'Every Monday',
    updated: '2026-11-10',
  },
  {
    id: 'win-rate-by-owner',
    kind: 'report',
    name: 'Win rate by owner',
    owner: 'priya',
    sharedWith: 'Sales team',
    schedule: 'Not scheduled',
    updated: '2026-11-09',
  },
  {
    id: 'renewals-next-quarter',
    kind: 'report',
    name: 'Renewals due next quarter',
    owner: 'nina',
    sharedWith: '3 people',
    schedule: 'First of the month',
    updated: '2026-11-04',
  },
  {
    id: 'bookings-against-target',
    kind: 'report',
    name: 'Bookings against target',
    owner: 'elena',
    sharedWith: 'Everyone',
    schedule: 'Every Friday',
    updated: '2026-11-02',
  },
  {
    id: 'deals-lost',
    kind: 'report',
    name: 'Deals lost and why',
    owner: 'jonas',
    sharedWith: 'Sales team',
    schedule: 'Not scheduled',
    updated: '2026-10-28',
  },
];

/** The folder whose delete is open when the page loads. */
export const OPEN_ON_LOAD = 'board-reporting';
