import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiChat3Fill,
  RiChat3Line,
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
  The sales team's chat on Tuesday morning, 10 November 2026. The open channel is the Halcyon
  Freight renewal: Ingrid Solberg asked for a two-year price, 12 more seats from January and the
  onboarding fee waived, and the quote has to reach her before her finance committee meets on
  Thursday. The team settles the fee here; Maya sends the quote from her inbox.
*/

/** The product is Orbit; the workspace is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

/** The sample is frozen at this moment (local time). */
export const NOW = '2026-11-10T09:12';

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
  { id: 'chat', label: 'Chat', icon: RiChat3Line, activeIcon: RiChat3Fill },
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
  /** What they do, under their name in a direct message. */
  role: string;
  /** Presence: at their desk, or away. */
  status: 'online' | 'unavailable';
  /** The avatar's colour, pinned for the signed-in user as in the sidebar. */
  color?: 'orange';
};

export const me: Person = {
  name: account.name,
  initials: account.initials,
  role: 'Head of Sales',
  status: 'online',
  color: 'orange',
};
const jonas: Person = {
  name: 'Jonas Weber',
  initials: 'JW',
  role: 'Account executive',
  status: 'online',
};
const priya: Person = {
  name: 'Priya Raman',
  initials: 'PR',
  role: 'Deal desk lead',
  status: 'online',
};
const tom: Person = {
  name: 'Tom Becker',
  initials: 'TB',
  role: 'Finance partner',
  status: 'unavailable',
};
const elena: Person = {
  name: 'Elena Silva',
  initials: 'ES',
  role: 'Sales operations',
  status: 'online',
};
const daniel: Person = {
  name: 'Daniel Reyes',
  initials: 'DR',
  role: 'Account executive',
  status: 'online',
};
const leo: Person = {
  name: 'Leo Marchetti',
  initials: 'LM',
  role: 'Solutions engineer',
  status: 'online',
};
const nina: Person = {
  name: 'Nina Alvarez',
  initials: 'NA',
  role: 'Account executive',
  status: 'unavailable',
};

/** The reactions a message can take: Remix line icons, not emoji. */
export type ReactionKind = 'like' | 'done' | 'seen';

export type Reaction = {
  kind: ReactionKind;
  /** How many people reacted, the signed-in user included. */
  count: number;
  /** Whether the signed-in user is one of them. */
  mine: boolean;
};

export type Message = {
  id: string;
  author: Person;
  /** Local date and time. */
  at: string;
  text: string;
  /** A file shared with the message. */
  file?: { name: string; size: string };
  /** The earlier message this one answers. */
  quote?: { author: Person; text: string };
  reactions?: Reaction[];
};

export type Conversation = {
  id: string;
  /** A channel's name, or the other person in a direct message. */
  name: string;
  /** Who is in it, the signed-in user included; a direct message is with `members[0]`. */
  members: Person[];
  kind: 'channel' | 'direct';
  /** What the channel is for, under its name. */
  topic?: string;
  /** Oldest first. */
  messages: Message[];
  /** The first message that arrived since the last visit: the "New messages" line sits above it. */
  newFrom?: string;
  unread: boolean;
  muted: boolean;
};

const marginNote =
  'Margin check for both scenarios. Waiving the fee costs us $1,800 once and keeps the two-year margin above the floor.';

const direct = (
  person: Person,
  messages: Message[],
  flags: { newFrom?: string } = {},
): Conversation => ({
  id: person.name.split(' ')[0].toLowerCase(),
  name: person.name,
  members: [person, me],
  kind: 'direct',
  messages,
  newFrom: flags.newFrom,
  unread: Boolean(flags.newFrom),
  muted: false,
});

/** Channels first, then direct messages, in the order of the list. */
export const conversations: Conversation[] = [
  {
    id: 'halcyon-renewal',
    name: 'halcyon-renewal',
    kind: 'channel',
    topic: 'Halcyon Freight renewal: the quote goes out before Wednesday noon',
    members: [jonas, priya, tom, elena, me],
    newFrom: 'halcyon-6',
    unread: false,
    muted: false,
    messages: [
      {
        id: 'halcyon-1',
        author: jonas,
        at: '2026-11-09T16:52',
        text: 'Ingrid just asked whether we can waive the onboarding fee for the 12 new seats. Their dispatchers are already trained.',
      },
      {
        id: 'halcyon-2',
        author: jonas,
        at: '2026-11-09T16:53',
        text: 'Their finance committee meets on Thursday at 10:00, so the quote has to be with her by Wednesday noon.',
      },
      {
        id: 'halcyon-3',
        author: priya,
        at: '2026-11-09T17:10',
        text: 'The two-year price is approved at 8 percent under list. For the fee I need a margin check before I sign off.',
        reactions: [{ kind: 'like', count: 2, mine: true }],
      },
      {
        id: 'halcyon-4',
        author: me,
        at: '2026-11-09T17:24',
        text: 'Thanks, Priya. I will build the quote on that price and leave the fee line open until you confirm.',
      },
      {
        id: 'halcyon-5',
        author: tom,
        at: '2026-11-10T08:31',
        text: marginNote,
        file: { name: 'halcyon-renewal-margin.xlsx', size: '48 KB' },
        reactions: [
          { kind: 'like', count: 3, mine: false },
          { kind: 'seen', count: 1, mine: false },
        ],
      },
      {
        id: 'halcyon-6',
        author: priya,
        at: '2026-11-10T08:58',
        text: 'Approved on that basis. Maya, you can waive the fee.',
        quote: { author: tom, text: marginNote },
      },
      {
        id: 'halcyon-7',
        author: jonas,
        at: '2026-11-10T09:04',
        text: 'Ingrid wrote again this morning. She is at her desk until noon if you want to walk her through it.',
      },
      {
        id: 'halcyon-8',
        author: jonas,
        at: '2026-11-10T09:05',
        text: 'Does the quote go out today?',
      },
    ],
  },
  {
    id: 'deal-desk',
    name: 'deal-desk',
    kind: 'channel',
    topic: 'Discounts, terms and approvals',
    members: [priya, tom, daniel, me],
    newFrom: 'desk-4',
    unread: true,
    muted: false,
    messages: [
      {
        id: 'desk-1',
        author: daniel,
        at: '2026-11-09T15:12',
        text: 'Marlow & Finch want eight more seats for their Lisbon office on the renewal form. Same discount?',
      },
      {
        id: 'desk-2',
        author: priya,
        at: '2026-11-09T15:40',
        text: 'Same 10 percent, as long as they sign before the end of the month.',
        reactions: [{ kind: 'done', count: 1, mine: false }],
      },
      {
        id: 'desk-3',
        author: priya,
        at: '2026-11-10T08:20',
        text: 'Two approvals are waiting on me this morning. Both go out before lunch.',
      },
      {
        id: 'desk-4',
        author: tom,
        at: '2026-11-10T08:44',
        text: 'A reminder for this week: any discount above 15 percent needs a margin check from me before it goes out.',
      },
    ],
  },
  {
    id: 'sales-team',
    name: 'sales-team',
    kind: 'channel',
    topic: 'Everyone in sales',
    members: [jonas, priya, elena, daniel, leo, nina, me],
    unread: false,
    muted: false,
    messages: [
      {
        id: 'team-1',
        author: elena,
        at: '2026-11-09T10:05',
        text: 'The forecast call moves to 2:00 PM on Wednesday. The link stays the same.',
        reactions: [{ kind: 'seen', count: 5, mine: true }],
      },
      {
        id: 'team-2',
        author: leo,
        at: '2026-11-10T07:48',
        text: 'Kestrel Analytics confirmed five people for the demo on Thursday. I will bring the sandbox with their sample data.',
      },
    ],
  },
  {
    id: 'q4-forecast',
    name: 'q4-forecast',
    kind: 'channel',
    topic: 'Where the quarter stands, updated on Mondays',
    members: [elena, nina, me],
    unread: false,
    muted: true,
    messages: [
      {
        id: 'forecast-1',
        author: nina,
        at: '2026-11-09T09:30',
        text: 'Commit is at 82 percent of the target with seven weeks to go.',
      },
      {
        id: 'forecast-2',
        author: elena,
        at: '2026-11-09T09:41',
        text: 'Best case reaches 96 percent if Halcyon Freight and Northwind Health both close this month.',
      },
    ],
  },
  direct(jonas, [
    {
      id: 'jonas-1',
      author: jonas,
      at: '2026-11-10T08:50',
      text: 'Can you take the Halcyon call if Ingrid wants one? I am with Atlas Robotics until 11:00.',
    },
    { id: 'jonas-2', author: me, at: '2026-11-10T08:52', text: 'Yes, my morning is free.' },
  ]),
  direct(
    priya,
    [
      {
        id: 'priya-1',
        author: me,
        at: '2026-11-10T08:36',
        text: 'Thank you for turning the two-year price around so quickly.',
      },
      {
        id: 'priya-2',
        author: priya,
        at: '2026-11-10T09:01',
        text: 'The fee waiver is approved as well. The details are in the channel.',
      },
    ],
    { newFrom: 'priya-2' },
  ),
  direct(tom, [
    {
      id: 'tom-1',
      author: me,
      at: '2026-11-09T17:26',
      text: 'Could you run the Halcyon margin with and without the onboarding fee?',
    },
    {
      id: 'tom-2',
      author: tom,
      at: '2026-11-09T17:41',
      text: 'On it. You will have both first thing tomorrow.',
    },
  ]),
  direct(elena, [
    {
      id: 'elena-1',
      author: elena,
      at: '2026-11-06T16:15',
      text: 'Thank you for covering the Tidewater Energy walkthrough on Tuesday.',
    },
  ]),
  direct(nina, [
    {
      id: 'nina-1',
      author: nina,
      at: '2026-11-06T17:02',
      text: 'I am back on Thursday. Leo has my accounts until then.',
    },
  ]),
];
