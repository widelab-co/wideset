import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiFolder3Fill,
  RiFolder3Line,
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
  The Q4 proposals folder in Lumen Studio's files: a proposal and a pitch deck for each customer
  in play this quarter, and three charts from the pipeline review. Northwind Health's proposal,
  the third file, is open in the viewer. Today is 10 November 2026.
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
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
  { id: 'revenue', label: 'Revenue', icon: RiLineChartLine },
  { id: 'reports', label: 'Reports', icon: RiPieChart2Line },
  { id: 'files', label: 'Files', icon: RiFolder3Line, activeIcon: RiFolder3Fill },
];

export const settingsLinks: NavLink[] = [
  { id: 'general', label: 'General', icon: RiSettings3Line },
  { id: 'members', label: 'Members', icon: RiTeamLine },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

/** "Now" for every relative date on the page, so the screen reads the same on any day. */
export const NOW = '2026-11-10T15:20:00Z';

export type Person = { name: string; initials: string; color?: AvatarColor };

export type PersonId = 'maya' | 'jonas' | 'priya' | 'tom' | 'elena' | 'daniel';

export const PEOPLE: Record<PersonId, Person> = {
  maya: { name: account.name, initials: account.initials, color: 'orange' },
  jonas: { name: 'Jonas Weber', initials: 'JW' },
  priya: { name: 'Priya Raman', initials: 'PR' },
  tom: { name: 'Tom Becker', initials: 'TB' },
  elena: { name: 'Elena Silva', initials: 'ES' },
  daniel: { name: 'Daniel Reyes', initials: 'DR' },
};

/** What a file is: a proposal (PDF), a pitch deck, or a chart exported as an image. */
export type Kind = 'pdf' | 'deck' | 'image';

export const KIND_LABEL: Record<Kind, string> = {
  pdf: 'PDF document',
  deck: 'Presentation',
  image: 'PNG image',
};

export type Comment = { id: string; by: PersonId; postedAt: string; text: string };

export type Access = 'Owner' | 'Can edit' | 'Can view';

export type FileItem = {
  id: string;
  name: string;
  kind: Kind;
  owner: PersonId;
  /** ISO date and time of the last change, and who made it. */
  modified: string;
  modifiedBy: PersonId;
  /** Bytes. */
  size: number;
  /** Who has it, besides its owner. */
  sharedWith: { person: PersonId; access: Exclude<Access, 'Owner'> }[];
  comments: Comment[];
  /** The customer a proposal or deck is for; a chart's title instead. */
  subject: string;
};

const MB = 1024 * 1024;
const team = (access: Exclude<Access, 'Owner'>, ...people: PersonId[]) =>
  people.map((person) => ({ person, access }));

export const FOLDER = { name: 'Q4 proposals', path: ['Files', 'Q4 proposals'] };

export const FILES: FileItem[] = [
  {
    id: 'halcyon-proposal',
    name: 'Halcyon Freight proposal.pdf',
    kind: 'pdf',
    owner: 'maya',
    modified: '2026-11-09T17:05:00Z',
    modifiedBy: 'maya',
    size: 2.1 * MB,
    sharedWith: team('Can edit', 'jonas'),
    comments: [],
    subject: 'Halcyon Freight',
  },
  {
    id: 'pipeline-chart',
    name: 'Q4 pipeline by stage.png',
    kind: 'image',
    owner: 'priya',
    modified: '2026-11-08T10:40:00Z',
    modifiedBy: 'priya',
    size: 0.4 * MB,
    sharedWith: team('Can view', 'maya', 'jonas', 'tom'),
    comments: [
      {
        id: 'c1',
        by: 'tom',
        postedAt: '2026-11-08T11:02:00Z',
        text: 'Negotiation looks light. Two deals moved back to proposal on Friday.',
      },
    ],
    subject: 'Q4 pipeline by stage',
  },
  {
    id: 'northwind-proposal',
    name: 'Northwind Health proposal.pdf',
    kind: 'pdf',
    owner: 'jonas',
    modified: '2026-11-10T09:12:00Z',
    modifiedBy: 'priya',
    size: 2.4 * MB,
    sharedWith: [...team('Can edit', 'maya', 'priya'), ...team('Can view', 'elena')],
    comments: [
      {
        id: 'c2',
        by: 'priya',
        postedAt: '2026-11-10T09:15:00Z',
        text: 'Moved support to six months after yesterday’s call. The total is updated on page 1.',
      },
      {
        id: 'c3',
        by: 'maya',
        postedAt: '2026-11-10T09:40:00Z',
        text: 'Looks good. Let’s send it once legal has seen the data processing terms.',
      },
    ],
    subject: 'Northwind Health',
  },
  {
    id: 'northwind-deck',
    name: 'Northwind Health pitch.pptx',
    kind: 'deck',
    owner: 'jonas',
    modified: '2026-11-07T15:30:00Z',
    modifiedBy: 'jonas',
    size: 14.2 * MB,
    sharedWith: team('Can edit', 'maya'),
    comments: [],
    subject: 'Northwind Health',
  },
  {
    id: 'kestrel-proposal',
    name: 'Kestrel Analytics proposal.pdf',
    kind: 'pdf',
    owner: 'priya',
    modified: '2026-11-06T13:20:00Z',
    modifiedBy: 'priya',
    size: 1.8 * MB,
    sharedWith: team('Can edit', 'maya', 'daniel'),
    comments: [],
    subject: 'Kestrel Analytics',
  },
  {
    id: 'atlas-deck',
    name: 'Atlas Robotics pitch.pptx',
    kind: 'deck',
    owner: 'tom',
    modified: '2026-11-05T09:10:00Z',
    modifiedBy: 'tom',
    size: 11.6 * MB,
    sharedWith: team('Can view', 'maya'),
    comments: [],
    subject: 'Atlas Robotics',
  },
  {
    id: 'win-rate-chart',
    name: 'Win rate by segment.png',
    kind: 'image',
    owner: 'priya',
    modified: '2026-11-04T16:45:00Z',
    modifiedBy: 'priya',
    size: 0.3 * MB,
    sharedWith: team('Can view', 'maya', 'tom'),
    comments: [],
    subject: 'Win rate by segment',
  },
  {
    id: 'cobalt-proposal',
    name: 'Cobalt Security proposal.pdf',
    kind: 'pdf',
    owner: 'elena',
    modified: '2026-11-03T11:00:00Z',
    modifiedBy: 'elena',
    size: 2.2 * MB,
    sharedWith: team('Can edit', 'maya'),
    comments: [],
    subject: 'Cobalt Security',
  },
  {
    id: 'juniper-deck',
    name: 'Juniper Legal pitch.pptx',
    kind: 'deck',
    owner: 'daniel',
    modified: '2026-11-02T14:25:00Z',
    modifiedBy: 'daniel',
    size: 9.8 * MB,
    sharedWith: team('Can view', 'maya', 'elena'),
    comments: [],
    subject: 'Juniper Legal',
  },
  {
    id: 'marlow-proposal',
    name: 'Marlow & Finch proposal.pdf',
    kind: 'pdf',
    owner: 'maya',
    modified: '2026-10-30T10:05:00Z',
    modifiedBy: 'maya',
    size: 1.6 * MB,
    sharedWith: team('Can edit', 'daniel'),
    comments: [],
    subject: 'Marlow & Finch',
  },
  {
    id: 'tidewater-deck',
    name: 'Tidewater Energy pitch.pptx',
    kind: 'deck',
    owner: 'elena',
    modified: '2026-10-28T09:50:00Z',
    modifiedBy: 'elena',
    size: 12.9 * MB,
    sharedWith: team('Can view', 'maya'),
    comments: [],
    subject: 'Tidewater Energy',
  },
  {
    id: 'deal-size-chart',
    name: 'Deal size by quarter.png',
    kind: 'image',
    owner: 'priya',
    modified: '2026-10-27T17:15:00Z',
    modifiedBy: 'priya',
    size: 0.3 * MB,
    sharedWith: team('Can view', 'maya', 'jonas'),
    comments: [],
    subject: 'Deal size by quarter',
  },
];

/** The file the viewer opens on. */
export const OPEN_ON_LOAD = 'northwind-proposal';

export type Chart = {
  /** What the bars measure, under the title. */
  note: string;
  unit: 'thousands' | 'percent';
  bars: { label: string; value: number }[];
};

/** Each chart image's content, by its subject. */
export const CHARTS: Record<string, Chart> = {
  'Q4 pipeline by stage': {
    note: 'Open pipeline value by stage, in US dollars',
    unit: 'thousands',
    bars: [
      { label: 'Lead', value: 1240 },
      { label: 'Qualified', value: 860 },
      { label: 'Proposal', value: 610 },
      { label: 'Negotiation', value: 290 },
      { label: 'Won', value: 180 },
    ],
  },
  'Win rate by segment': {
    note: 'Deals won of deals closed, last four quarters',
    unit: 'percent',
    bars: [
      { label: 'Enterprise', value: 28 },
      { label: 'Mid-market', value: 34 },
      { label: 'SMB', value: 22 },
      { label: 'Public sector', value: 17 },
    ],
  },
  'Deal size by quarter': {
    note: 'Average won deal, in US dollars',
    unit: 'thousands',
    bars: [
      { label: 'Q1', value: 38 },
      { label: 'Q2', value: 42 },
      { label: 'Q3', value: 47 },
      { label: 'Q4', value: 51 },
    ],
  },
};
