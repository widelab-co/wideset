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
  Tuesday 10 November 2026, 11:29. Maya hosts the renewal call Ingrid Solberg asked for: Halcyon
  Freight's finance committee meets on Thursday at 10:00 and the revised quote has to reach Ingrid
  by noon tomorrow. Jonas joins from Lumen Studio after his Atlas Robotics meeting; Dana Whitfield,
  Halcyon's head of operations, joins with Ingrid. The terms are the ones settled in the
  halcyon-renewal channel: two years at 8 percent under list, 12 dispatcher seats from January 1,
  the onboarding fee for those seats waived. The call sits on the deal "Halcyon Freight renewal".
*/

/** The product is Orbit; the workspace using it is Lumen Studio. */
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

export type Participant = {
  id: string;
  name: string;
  initials: string;
  color: AvatarColor;
  company: string;
  /** Whether their microphone is off. */
  muted: boolean;
  /** The signed-in user, who hosts the call. */
  you?: boolean;
};

const person = (
  id: string,
  name: string,
  color: AvatarColor,
  company: string,
  muted = false,
): Participant => ({
  id,
  name,
  initials: name
    .split(' ')
    .map((part) => part[0])
    .join(''),
  color,
  company,
  muted,
});

/** Who is on the call, the signed-in host first: two from Lumen Studio, two from Halcyon. */
export const participants: Participant[] = [
  { ...person('maya', account.name, 'orange', workspace.name), you: true },
  person('jonas', 'Jonas Weber', 'blue', workspace.name),
  person('ingrid', 'Ingrid Solberg', 'teal', 'Halcyon Freight'),
  person('dana', 'Dana Whitfield', 'purple', 'Halcyon Freight', true),
];

/** Who talks next, in turn, one turn every few seconds; whoever is muted is skipped. */
export const turns = ['ingrid', 'maya', 'ingrid', 'jonas', 'maya', 'dana', 'ingrid'];

export const call = {
  title: 'Renewal call',
  customer: 'Halcyon Freight',
  deal: { id: 'halcyon-renewal', name: 'Halcyon Freight renewal' },
  /** How long the call has run when the page opens, in seconds (it started at 11:15). */
  elapsed: 14 * 60 + 32,
};

/** The quote Maya shares: what the committee will read on Thursday. */
export const sharedQuote = {
  owner: account.name,
  title: 'Halcyon Freight renewal 2027',
  subtitle: 'Revised quote, November 10, 2026',
  terms: [
    { label: 'Term', value: 'Two years, from January 1, 2027' },
    { label: 'Seats', value: '120, plus 12 dispatcher seats from January 1' },
    { label: 'Price', value: '8% under list, fixed for both years' },
    { label: 'Onboarding fee', value: 'Waived for the 12 new seats' },
  ],
  footnote: 'Valid until November 20, 2026',
};

/** Maya's notes so far, one point a line. They are saved to the deal. */
export const notes = [
  'The committee meets Thursday at 10:00; the quote reaches Ingrid by noon tomorrow',
  'Two-year term at 8% under list, approved by Priya',
  '12 dispatcher seats start on January 1',
  'Onboarding fee for the new seats is waived',
];

export type ChatMessage = { id: string; authorId: string; at: string; text: string };

/** What was written in the call's chat, oldest first; everyone on the call reads it. */
export const chat: ChatMessage[] = [
  {
    id: 'chat-1',
    authorId: 'ingrid',
    at: '2026-11-10T11:17',
    text: 'The renewal is on Thursday’s agenda as item 3.',
  },
  {
    id: 'chat-2',
    authorId: 'jonas',
    at: '2026-11-10T11:19',
    text: 'Thank you, Ingrid. The revised quote follows today.',
  },
  {
    id: 'chat-3',
    authorId: 'dana',
    at: '2026-11-10T11:24',
    text: 'Could the 12 new seats be ready in December? We want to train the dispatchers before they go live.',
  },
];

/** The moment a message sent now is stamped with (local time). */
export const NOW = '2026-11-10T11:29';
