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
  Lumen Studio's feed on a Tuesday afternoon: what the sales team posts and what Orbit reports
  by itself when a deal is won. The pinned announcement stays on top; the rest is newest first.
*/

/** The product is Orbit; the workspace is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

/** The sample is frozen at this moment (local time); what is posted on the page is posted now. */
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
  id: string;
  name: string;
  initials: string;
  role: string;
  /** Pinned only for the signed-in user, to match the sidebar's account. */
  color?: 'orange';
};

/** The signed-in user, as an author. */
export const me: Person = {
  id: 'maya',
  name: account.name,
  initials: account.initials,
  role: 'Head of Sales',
  color: 'orange',
};
const jonas: Person = {
  id: 'jonas',
  name: 'Jonas Weber',
  initials: 'JW',
  role: 'Account executive',
};
const priya: Person = {
  id: 'priya',
  name: 'Priya Raman',
  initials: 'PR',
  role: 'Account executive',
};
const tom: Person = { id: 'tom', name: 'Tom Becker', initials: 'TB', role: 'Sales engineer' };
const elena: Person = {
  id: 'elena',
  name: 'Elena Silva',
  initials: 'ES',
  role: 'Revenue operations',
};
const daniel: Person = {
  id: 'daniel',
  name: 'Daniel Reyes',
  initials: 'DR',
  role: 'Account executive',
};
const leo: Person = { id: 'leo', name: 'Leo Marchetti', initials: 'LM', role: 'Sales development' };
const nina: Person = { id: 'nina', name: 'Nina Alvarez', initials: 'NA', role: 'Customer success' };

/** Teammates the signed-in user does not follow yet. */
export const suggestions: Person[] = [tom, leo, daniel];

/** Who a new post is shown to; the first is the default. */
export const AUDIENCES = [
  { value: 'everyone', label: `Everyone at ${workspace.name}` },
  { value: 'sales', label: 'Sales team' },
  { value: 'leads', label: 'Team leads' },
];

export type SubjectKind = 'Deal' | 'Customer' | 'File';

/** The record or file a post is about. */
export type Subject = {
  kind: SubjectKind;
  name: string;
  /** What it is worth or what it is, at the end of the row. */
  detail: string;
};

export type Comment = { id: string; author: Person; at: string; text: string };

/**
 * `update`: a person's post. `announcement`: a post for the whole workspace, pinned on top.
 * `event`: something Orbit reports by itself (a deal won); its text finishes the sentence that
 * starts with the author's name.
 */
export type PostKind = 'update' | 'announcement' | 'event';

export type Post = {
  id: string;
  kind: PostKind;
  author: Person;
  /** Local date and time. */
  at: string;
  text: string;
  subject?: Subject;
  /** Who sees it, when that is not everyone. */
  audience?: string;
  likes: number;
  /** Whether the signed-in user likes it. */
  liked: boolean;
  /** Whether the signed-in user follows its thread. */
  following: boolean;
  /** Oldest first. */
  comments: Comment[];
};

/** The pinned announcement, then the rest newest first. */
export const posts: Post[] = [
  {
    id: 'pricing',
    kind: 'announcement',
    author: elena,
    at: '2026-11-09T09:05',
    text: 'The new price list goes live on Monday, November 16. Quotes sent before then keep the old prices until they expire, so nothing needs reissuing this week.',
    subject: { kind: 'File', name: 'Price list, November 2026', detail: 'PDF' },
    likes: 14,
    liked: false,
    following: false,
    comments: [],
  },
  {
    id: 'juniper-security',
    kind: 'update',
    author: jonas,
    at: '2026-11-10T13:55',
    text: 'Juniper Legal signed off on the security review this morning. Their partners have the order form and I expect a signature by Friday. Thanks to Priya for turning the questionnaire around in a day.',
    subject: { kind: 'Deal', name: 'Juniper Legal, annual plan', detail: '$32,000 a year' },
    likes: 5,
    liked: true,
    following: true,
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
        author: jonas,
        at: '2026-11-10T14:10',
        text: 'It should. The DPA went back with our edits on Monday and they have not pushed back.',
      },
      {
        id: 'c4',
        author: me,
        at: '2026-11-10T14:16',
        text: 'Good. Tell me if it slips past Friday and I will call their CFO.',
      },
    ],
  },
  {
    id: 'marlow-won',
    kind: 'event',
    author: priya,
    at: '2026-11-10T12:20',
    text: 'won a deal with Marlow & Finch',
    subject: { kind: 'Deal', name: 'Marlow & Finch, two-year renewal', detail: '$21,000 a year' },
    likes: 9,
    liked: false,
    following: false,
    comments: [],
  },
  {
    id: 'tidewater-onboarding',
    kind: 'update',
    author: nina,
    at: '2026-11-09T16:40',
    text: 'Tidewater Energy finished onboarding two weeks early and all 60 seats are active. If you are talking to other energy companies, their procurement lead is happy to take a reference call.',
    subject: { kind: 'Customer', name: 'Tidewater Energy', detail: 'Customer' },
    likes: 3,
    liked: false,
    following: true,
    comments: [
      {
        id: 'c5',
        author: leo,
        at: '2026-11-09T17:05',
        text: 'A reference would help with two utilities I am talking to. I will message you.',
      },
    ],
  },
  {
    id: 'forecast-walkthrough',
    kind: 'update',
    author: daniel,
    at: '2026-11-06T11:15',
    text: 'I recorded a ten-minute walkthrough of the new forecast view for anyone running a demo this week. It covers the commit and best-case columns and how to filter by owner.',
    subject: { kind: 'File', name: 'Forecast view walkthrough', detail: 'Video, 10 min' },
    likes: 0,
    liked: false,
    following: false,
    comments: [],
  },
];
