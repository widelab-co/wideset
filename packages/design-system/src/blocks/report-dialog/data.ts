import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiHandCoinLine,
  RiHome5Line,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartLine,
  RiNewspaperFill,
  RiNewspaperLine,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionLine,
  RiSettings3Line,
  RiTeamLine,
} from '@remixicon/react';

/*
  Lumen Studio's feed on a Tuesday afternoon. Under Jonas's update about Juniper Legal, Leo has
  posted a customer's personal mobile number for the whole workspace to see. Maya reports the
  comment; the dialog is open on load.
*/

/** The product is Orbit; the workspace is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

/** The sample is frozen at this moment (local time). */
export const NOW_AT = '2026-11-10T14:30';
export const NOW = new Date(NOW_AT);

export type NavLink = {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  /** The icon while the page is open (a line icon swaps for its fill). */
  activeIcon?: RemixiconComponentType;
};

export const mainLinks: NavLink[] = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'feed', label: 'Feed', icon: RiNewspaperLine, activeIcon: RiNewspaperFill },
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

export type Person = {
  name: string;
  initials: string;
  role: string;
  /** Pinned only for the signed-in user, to match the sidebar's account. */
  color?: 'orange';
};

const jonas: Person = { name: 'Jonas Weber', initials: 'JW', role: 'Account executive' };
const priya: Person = { name: 'Priya Raman', initials: 'PR', role: 'Account executive' };
const tom: Person = { name: 'Tom Becker', initials: 'TB', role: 'Sales engineer' };
const leo: Person = { name: 'Leo Marchetti', initials: 'LM', role: 'Sales development' };
const nina: Person = { name: 'Nina Alvarez', initials: 'NA', role: 'Customer success' };
const daniel: Person = { name: 'Daniel Reyes', initials: 'DR', role: 'Account executive' };

export type Comment = { id: string; author: Person; at: string; text: string };

export type Post = {
  id: string;
  author: Person;
  /** Local date and time. */
  at: string;
  text: string;
  /** Oldest first. */
  comments: Comment[];
};

/** What can be reported: a post or one of its comments, with what the dialog quotes of it. */
export type Reportable = {
  kind: 'post' | 'comment';
  id: string;
  author: Person;
  at: string;
  text: string;
};

/** Newest first. */
export const posts: Post[] = [
  {
    id: 'juniper-security',
    author: jonas,
    at: '2026-11-10T13:55',
    text: 'Juniper Legal signed off on the security review this morning. Their partners have the order form and I expect a signature by Friday. Thanks to Priya for turning the questionnaire around in a day.',
    comments: [
      {
        id: 'c1',
        author: priya,
        at: '2026-11-10T13:58',
        text: 'Glad it helped. Their security lead said it was the quickest review they have had.',
      },
      {
        id: 'c2',
        author: tom,
        at: '2026-11-10T14:04',
        text: 'Does Friday still hold if they ask for changes to the DPA?',
      },
      {
        id: 'c3',
        author: leo,
        at: '2026-11-10T14:12',
        text: 'If the DPA stalls, their general counsel gave me her personal mobile: +1 415 555 0136. She said to call any time, evenings too.',
      },
    ],
  },
  {
    id: 'tidewater-onboarding',
    author: nina,
    at: '2026-11-09T16:40',
    text: 'Tidewater Energy finished onboarding two weeks early and all 60 seats are active. If you are talking to other energy companies, their procurement lead is happy to take a reference call.',
    comments: [],
  },
  {
    id: 'forecast-walkthrough',
    author: daniel,
    at: '2026-11-06T11:15',
    text: 'I recorded a ten-minute walkthrough of the new forecast view for anyone running a demo this week. It covers the commit and best-case columns and how to filter by owner.',
    comments: [],
  },
];

/** The comment being reported when the page loads. */
export const REPORTED_ON_LOAD = 'c3';

/** Why something is reported, in the order the dialog lists them. The last asks for details. */
export const REASONS = [
  { value: 'spam', label: 'Spam' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'sensitive', label: 'Sensitive information' },
  { value: 'other', label: 'Something else' },
] as const;

export type Reason = (typeof REASONS)[number]['value'];
