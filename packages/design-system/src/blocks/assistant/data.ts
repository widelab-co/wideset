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
  Tuesday 10 November 2026, early afternoon. Maya has the Halcyon Freight renewal open after this
  morning's call and asks Orbit's assistant about it. The facts are the ones the inbox, chat and
  home blocks tell: Ingrid Solberg needs the revised quote by noon tomorrow for her finance
  committee on Thursday at 10:00; two years at 8 percent under list, 12 dispatcher seats from
  January 1, their $1,800 onboarding fee waived after Tom's margin check and Priya's approval.
  On the call Ingrid said she can countersign on Friday, so the deal can close on November 13.
*/

/** The product is Orbit; the workspace using it is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

/** "Now" on the page (local time): the afternoon after the call. */
export const NOW = '2026-11-10T14:40';

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

export type Person = { name: string; initials: string; color: AvatarColor };

export const maya: Person = { name: account.name, initials: account.initials, color: 'orange' };
const ingrid: Person = { name: 'Ingrid Solberg', initials: 'IS', color: 'teal' };
const priya: Person = { name: 'Priya Raman', initials: 'PR', color: 'purple' };
const tom: Person = { name: 'Tom Becker', initials: 'TB', color: 'green' };

export type NextStep = { id: string; title: string; /** Calendar day. */ due: string };

export type Activity = {
  id: string;
  kind: 'call' | 'email' | 'note' | 'change';
  actor: Person;
  /** What they did, read after the actor's name. */
  action: string;
  /** Local date and time. */
  at: string;
};

export type Deal = {
  id: string;
  name: string;
  customer: string;
  contact: Person;
  stage: string;
  amount: number;
  /** Calendar day. */
  closeDate: string;
  owner: Person;
  /** What the deal is: the terms the quote carries and who decides. */
  facts: { label: string; value: string }[];
  nextSteps: NextStep[];
  /** Newest first. */
  activity: Activity[];
};

/** The deal as the page opens, before the assistant's change. */
export const deal: Deal = {
  id: 'halcyon-renewal',
  name: 'Halcyon Freight renewal',
  customer: 'Halcyon Freight',
  contact: ingrid,
  stage: 'Negotiation',
  amount: 24_000,
  closeDate: '2026-11-30',
  owner: maya,
  facts: [
    { label: 'Term', value: 'Two years, from January 1, 2027' },
    { label: 'Seats', value: '120, plus 12 dispatcher seats from January 1' },
    { label: 'Price', value: '8% under list, approved by Priya Raman' },
    { label: 'Onboarding fee', value: 'Waived for the new seats ($1,800)' },
    { label: 'Decision', value: 'Finance committee, Nov 12 at 10:00 AM' },
  ],
  nextSteps: [{ id: 'quote', title: 'Send the revised quote to Ingrid', due: '2026-11-11' }],
  activity: [
    {
      id: 'call',
      kind: 'call',
      actor: maya,
      action: 'logged the renewal call with Ingrid Solberg and Dana Whitfield',
      at: '2026-11-10T11:46',
    },
    {
      id: 'approval',
      kind: 'note',
      actor: priya,
      action: 'approved waiving the onboarding fee',
      at: '2026-11-10T08:58',
    },
    {
      id: 'email',
      kind: 'email',
      actor: ingrid,
      action: 'wrote about the revised quote for the 2027 renewal',
      at: '2026-11-10T08:47',
    },
    {
      id: 'margin',
      kind: 'note',
      actor: tom,
      action: 'added the margin check for both scenarios',
      at: '2026-11-10T08:31',
    },
  ],
};

export type Source = {
  id: string;
  kind: 'email' | 'call' | 'note';
  /** Short, as the chip reads: whose and when. */
  label: string;
  href: string;
};

const sources = {
  email: {
    id: 'email',
    kind: 'email',
    label: 'Ingrid’s e-mail, Nov 10',
    href: '#inbox/halcyon-quote',
  },
  call: {
    id: 'call',
    kind: 'call',
    label: 'Renewal call, Nov 10',
    href: '#recordings/halcyon-renewal-call',
  },
  note: {
    id: 'note',
    kind: 'note',
    label: 'Tom’s margin note',
    href: '#deals/halcyon-renewal/notes/margin',
  },
} satisfies Record<string, Source>;

/** One field the assistant proposes to change: from what (none for a new entry) to what. */
export type FieldChange = { field: string; from?: string; to: string };

export type Change = {
  fields: FieldChange[];
  status: 'pending' | 'applied' | 'discarded';
};

export type Turn =
  | { id: string; role: 'user'; text: string }
  | {
      id: string;
      role: 'assistant';
      text: string;
      sources?: Source[];
      change?: Change;
      rating?: 'up' | 'down';
      /** Stopped before the answer was complete. */
      stopped?: boolean;
    };

/** The step the change adds, as it lands on the deal. */
export const proposedStep: NextStep = {
  id: 'committee',
  title: 'Call Ingrid after the finance committee',
  due: '2026-11-12',
};
export const proposedCloseDate = '2026-11-13';

/** The conversation as the page opens: one answer read, one change waiting. */
export const conversation: Turn[] = [
  { id: 'q1', role: 'user', text: 'Where does the Halcyon renewal stand?' },
  {
    id: 'a1',
    role: 'assistant',
    text: 'Ingrid needs the revised quote by noon tomorrow to put it on Thursday’s finance committee agenda. The quote is ready to go: two years at 8% under list, 12 dispatcher seats from January 1, and their $1,800 onboarding fee waived, which Priya approved after Tom’s margin check.\n\nOn this morning’s call Ingrid said the committee can sign off on Thursday.',
    sources: [sources.email, sources.call, sources.note],
    rating: 'up',
  },
  { id: 'q2', role: 'user', text: 'Update the close date and add the next step' },
  {
    id: 'a2',
    role: 'assistant',
    text: 'Ingrid said she can countersign on Friday if the committee approves on Thursday, so the deal can close on November 13. Here is the change:',
    sources: [sources.call],
    change: {
      status: 'pending',
      fields: [
        { field: 'Close date', from: 'Nov 30, 2026', to: 'Nov 13, 2026' },
        { field: 'Next step', to: `${proposedStep.title}, Nov 12` },
      ],
    },
  },
];

/** Three short prompts above the composer when the conversation is empty or has ended. */
export const suggestions = ['Summarise the call', 'Draft a reply', 'What is left?'];

/** What the assistant answers, by prompt; anything else gets `fallback`. */
export const answers: Record<string, { text: string; sources: Source[] }> = {
  'Summarise the call': {
    text: 'Ingrid and Dana confirmed the terms in the revised quote: two years at 8% under list, 12 dispatcher seats from January 1, and no onboarding fee for them. Dana asked for the new seats to be ready in December so the dispatchers can train first, and Jonas said that works.\n\nIngrid takes the quote to the finance committee on Thursday at 10:00.',
    sources: [sources.call],
  },
  'Draft a reply': {
    text: 'Here is a draft:\n\nHi Ingrid, thank you for the call this morning. The revised quote is attached: two years at 8% under list, the 12 dispatcher seats from January 1, and no onboarding fee for them. We will open the new seats on December 1 so Dana’s team can train first. I will call you after the committee on Thursday.\n\nBest, Maya',
    sources: [sources.email, sources.call],
  },
  'What is left?': {
    text: 'Two things. The revised quote has not gone out yet, and Ingrid needs it by noon tomorrow. The December setup for the new seats also needs a date from Jonas before the quote says so.',
    sources: [sources.email, sources.call],
  },
};

export const fallback = {
  text: 'I answer from this deal’s e-mails, calls and notes, and I can propose changes to its fields. I found nothing on that in this deal yet.',
  sources: [] as Source[],
};
