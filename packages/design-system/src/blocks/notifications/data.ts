import {
  type RemixiconComponentType,
  RiBarChartBoxLine,
  RiBriefcase4Line,
  RiHome5Line,
  RiInbox2Line,
  RiMoneyDollarCircleLine,
  RiSettings3Line,
  RiTeamLine,
  RiUserLine,
} from '@remixicon/react';

/** The sample's clock: every relative time on the page is measured from here (a Thursday). */
export const NOW = new Date('2026-11-12T16:20:00');

export const workspace = { name: 'Lumen Studio' };

export type Person = { name: string; initials: string };

/** The signed-in user: the "you" of every notification. */
export const account = {
  name: 'Nina Alvarez',
  initials: 'NA',
  email: 'nina@lumen.studio',
  role: 'Account executive',
};

export const navigation: { id: string; label: string; icon: RemixiconComponentType }[] = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'inbox', label: 'Inbox', icon: RiInbox2Line },
  { id: 'customers', label: 'Customers', icon: RiUserLine },
  { id: 'deals', label: 'Deals', icon: RiBriefcase4Line },
  { id: 'revenue', label: 'Revenue', icon: RiMoneyDollarCircleLine },
  { id: 'reports', label: 'Reports', icon: RiBarChartBoxLine },
];

export const workspaceNavigation: { id: string; label: string; icon: RemixiconComponentType }[] = [
  { id: 'team', label: 'Team', icon: RiTeamLine },
  { id: 'settings', label: 'Settings', icon: RiSettings3Line },
];

const maya = { name: 'Maya Chen', initials: 'MC' };
const marcus = { name: 'Marcus Bell', initials: 'MB' };
const priya = { name: 'Priya Raman', initials: 'PR' };
const jonas = { name: 'Jonas Lindqvist', initials: 'JL' };
const kofi = { name: 'Kofi Mensah', initials: 'KM' };
const leila = { name: 'Leila Haddad', initials: 'LH' };
const hana = { name: 'Hana Kobayashi', initials: 'HK' };
const nina: Person = account;

/** What a notification is about; the detail shows its facts and opens it. */
export type Subject = {
  kind: 'Deal' | 'Account' | 'Invoice' | 'Task' | 'Report';
  /** Where it lives, for the breadcrumb: "Deals". */
  section: string;
  name: string;
  facts: { label: string; value: string }[];
};

export type Message = { author: Person; at: string; text: string };

/** What happened, as the detail shows it. */
export type Context =
  /**
   * A conversation, or the note left with an assignment or a share; the last message is the one
   * that notified you.
   */
  | { type: 'comment'; thread: Message[] }
  | { type: 'change'; field: string; from: string; to: string }
  /** Something Orbit itself reports and someone has to act on. */
  | { type: 'alert'; status: 'error' | 'warning'; title: string; text: string };

export type Notification = {
  id: string;
  /** Muting a thread hides every notification in it. */
  thread: string;
  /** Who did it; `null` when Orbit itself reports it. */
  actor: Person | null;
  /**
   * The sentence, as actor + action + target + trail: "Maya Chen" "mentioned you in" "Lanetrack";
   * "Priya Raman" "moved" "Kestrel Labs" "to Closed won". The actor and target are what the eye
   * looks for.
   */
  action: string;
  target: string;
  trail?: string;
  /** Why it reached you, for the tabs. */
  reason: 'mention' | 'assigned' | 'following';
  /** One line under the sentence: what was said or what changed. */
  preview: string;
  at: string;
  read: boolean;
  subject: Subject;
  context: Context;
};

const lanetrack: Subject = {
  kind: 'Deal',
  section: 'Deals',
  name: 'Lanetrack · Annual renewal',
  facts: [
    { label: 'Stage', value: 'Negotiation' },
    { label: 'Amount', value: '$48,000 a year' },
    { label: 'Close date', value: 'Nov 28, 2026' },
    { label: 'Owner', value: 'Nina Alvarez' },
    { label: 'Plan', value: 'Scale, 3 years' },
  ],
};

const kestrel: Subject = {
  kind: 'Deal',
  section: 'Deals',
  name: 'Kestrel Labs · New business',
  facts: [
    { label: 'Stage', value: 'Closed won' },
    { label: 'Amount', value: '$36,000 a year' },
    { label: 'Closed on', value: 'Nov 12, 2026' },
    { label: 'Owner', value: 'Priya Raman' },
    { label: 'Plan', value: 'Growth, 1 year' },
  ],
};

const brightwave: Subject = {
  kind: 'Deal',
  section: 'Deals',
  name: 'Brightwave · Renewal 2027',
  facts: [
    { label: 'Stage', value: 'Negotiation' },
    { label: 'Amount', value: '$21,600 a year' },
    { label: 'Close date', value: 'Dec 15, 2026' },
    { label: 'Owner', value: 'Nina Alvarez' },
    { label: 'Plan', value: 'Growth, 1 year' },
  ],
};

export const notifications: Notification[] = [
  // Today
  {
    id: 'n1',
    thread: 'lanetrack-renewal',
    actor: maya,
    action: 'mentioned you in',
    target: 'Lanetrack',
    reason: 'mention',
    preview: 'Can you confirm the 12% multi-year discount before I send the order form?',
    at: '2026-11-12T16:06:00',
    read: true,
    subject: lanetrack,
    context: {
      type: 'comment',
      thread: [
        {
          author: marcus,
          at: '2026-11-12T11:32:00',
          text: 'Procurement came back: they will sign for three years if we hold this year’s price per seat.',
        },
        {
          author: maya,
          at: '2026-11-12T16:06:00',
          text: '@Nina Alvarez can you confirm the 12% multi-year discount before I send the order form? Legal signed off on the MSA this morning.',
        },
      ],
    },
  },
  {
    id: 'n2',
    thread: 'northwind-expansion',
    actor: marcus,
    action: 'assigned you',
    target: 'Northwind Health',
    reason: 'assigned',
    preview: 'Expansion to 120 seats across four clinics',
    at: '2026-11-12T15:02:00',
    read: false,
    subject: {
      kind: 'Deal',
      section: 'Deals',
      name: 'Northwind Health · Expansion',
      facts: [
        { label: 'Stage', value: 'Discovery' },
        { label: 'Amount', value: '$64,800 a year' },
        { label: 'Close date', value: 'Jan 15, 2027' },
        { label: 'Owner', value: 'Nina Alvarez' },
        { label: 'Plan', value: 'Scale, 120 seats' },
      ],
    },
    context: {
      type: 'comment',
      thread: [
        {
          author: marcus,
          at: '2026-11-12T15:02:00',
          text: 'They are moving all four clinics onto Scale in January. Can you own the commercial side? I will stay on for the rollout.',
        },
      ],
    },
  },
  {
    id: 'n3',
    thread: 'kestrel-new',
    actor: priya,
    action: 'moved',
    target: 'Kestrel Labs',
    trail: 'to Closed won',
    reason: 'following',
    preview: 'Negotiation → Closed won · $36,000 a year',
    at: '2026-11-12T13:18:00',
    read: false,
    subject: kestrel,
    context: { type: 'change', field: 'Stage', from: 'Negotiation', to: 'Closed won' },
  },
  {
    id: 'n4',
    thread: 'halcyon-invoice',
    actor: null,
    action: 'Payment failed for',
    target: 'Halcyon Foods',
    reason: 'following',
    preview: 'INV-2214 · $2,400 · Card declined',
    at: '2026-11-12T09:41:00',
    read: false,
    subject: {
      kind: 'Invoice',
      section: 'Invoices',
      name: 'INV-2214 · Halcyon Foods',
      facts: [
        { label: 'Amount', value: '$2,400.00' },
        { label: 'Due', value: 'Nov 12, 2026' },
        { label: 'Method', value: 'Visa ending 4417' },
        { label: 'Account owner', value: 'Nina Alvarez' },
        { label: 'Next retry', value: 'Nov 15, 2026' },
      ],
    },
    context: {
      type: 'alert',
      status: 'error',
      title: 'The card was declined',
      text: 'Orbit tries again on Nov 15. Ask the customer to update their card before then to keep the account active.',
    },
  },

  // Yesterday
  {
    id: 'n5',
    thread: 'atlas-sso',
    actor: jonas,
    action: 'mentioned you in',
    target: 'Atlas Freight',
    reason: 'mention',
    preview: 'Atlas asked for a second SSO domain. Is that in Growth or only Scale?',
    at: '2026-11-11T17:24:00',
    read: false,
    subject: {
      kind: 'Account',
      section: 'Customers',
      name: 'Atlas Freight',
      facts: [
        { label: 'Plan', value: 'Growth' },
        { label: 'MRR', value: '$2,350' },
        { label: 'Seats', value: '46 of 50 in use' },
        { label: 'Owner', value: 'Nina Alvarez' },
        { label: 'Renews', value: 'Mar 1, 2027' },
      ],
    },
    context: {
      type: 'comment',
      thread: [
        {
          author: jonas,
          at: '2026-11-11T17:24:00',
          text: '@Nina Alvarez Atlas asked for a second SSO domain for their Rotterdam office. Is that in Growth or only Scale?',
        },
      ],
    },
  },
  {
    id: 'n6',
    thread: 'brightwave-renewal',
    actor: kofi,
    action: 'replied in',
    target: 'Brightwave',
    reason: 'following',
    preview: 'They want quarterly billing instead of annual. I said we would come back by Friday.',
    at: '2026-11-11T14:10:00',
    read: true,
    subject: brightwave,
    context: {
      type: 'comment',
      thread: [
        {
          author: nina,
          at: '2026-11-10T10:05:00',
          text: 'Sent the renewal quote. Same seats, Growth plan, 4% uplift.',
        },
        {
          author: kofi,
          at: '2026-11-11T14:10:00',
          text: 'They want quarterly billing instead of annual. I said we would come back by Friday.',
        },
      ],
    },
  },
  {
    id: 'n7',
    thread: 'ferro-questionnaire',
    actor: maya,
    action: 'assigned you a task in',
    target: 'Ferro & Co',
    reason: 'assigned',
    preview: 'Send the updated security questionnaire · Due Friday',
    at: '2026-11-11T10:47:00',
    read: true,
    subject: {
      kind: 'Task',
      section: 'Tasks',
      name: 'Send the updated security questionnaire',
      facts: [
        { label: 'Account', value: 'Ferro & Co' },
        { label: 'Due', value: 'Nov 13, 2026' },
        { label: 'Assignee', value: 'Nina Alvarez' },
        { label: 'Created by', value: 'Maya Chen' },
      ],
    },
    context: {
      type: 'comment',
      thread: [
        {
          author: maya,
          at: '2026-11-11T10:47:00',
          text: 'Their IT team needs the 2026 version with the new data residency answers before the pilot starts.',
        },
      ],
    },
  },
  {
    id: 'n8',
    thread: 'q4-forecast',
    actor: leila,
    action: 'shared a report with you:',
    target: 'Q4 forecast',
    reason: 'following',
    preview: 'Commit and best case by region, updated every Monday',
    at: '2026-11-11T09:15:00',
    read: true,
    subject: {
      kind: 'Report',
      section: 'Reports',
      name: 'Q4 forecast by region',
      facts: [
        { label: 'Owner', value: 'Leila Haddad' },
        { label: 'Period', value: 'Oct 1 – Dec 31, 2026' },
        { label: 'Updated', value: 'Nov 9, 2026' },
      ],
    },
    context: {
      type: 'comment',
      thread: [
        {
          author: leila,
          at: '2026-11-11T09:15:00',
          text: 'Your Europe numbers are in. Could you check the Brightwave and Lanetrack lines before Monday’s call?',
        },
      ],
    },
  },

  // Earlier this week
  {
    id: 'n9',
    thread: 'pinecrest-renewal',
    actor: null,
    action: '',
    target: 'Pinecrest Dental',
    trail: 'renews in 30 days',
    reason: 'following',
    preview: '$1,180 MRR on Growth · Renews Dec 10',
    at: '2026-11-10T08:00:00',
    read: true,
    subject: {
      kind: 'Account',
      section: 'Customers',
      name: 'Pinecrest Dental',
      facts: [
        { label: 'Plan', value: 'Growth' },
        { label: 'MRR', value: '$1,180' },
        { label: 'Renews', value: 'Dec 10, 2026' },
        { label: 'Owner', value: 'Nina Alvarez' },
      ],
    },
    context: {
      type: 'alert',
      status: 'warning',
      title: 'Renews in 30 days',
      text: 'Pinecrest Dental renews on Dec 10 with 18 seats on Growth. Usage is down 22% since September.',
    },
  },
  {
    id: 'n10',
    thread: 'solace-owner',
    actor: hana,
    action: 'made you the owner of',
    target: 'Solace Clinics',
    reason: 'assigned',
    preview: 'Account handed over from Amara Nwosu',
    at: '2026-11-10T15:36:00',
    read: true,
    subject: {
      kind: 'Account',
      section: 'Customers',
      name: 'Solace Clinics',
      facts: [
        { label: 'Plan', value: 'Scale' },
        { label: 'MRR', value: '$4,920' },
        { label: 'Seats', value: '82 of 90 in use' },
        { label: 'Owner', value: 'Nina Alvarez' },
        { label: 'Renews', value: 'Jun 30, 2027' },
      ],
    },
    context: {
      type: 'comment',
      thread: [
        {
          author: hana,
          at: '2026-11-10T15:36:00',
          text: 'Amara is moving to the partnerships team. Solace is healthy; their next review is in January.',
        },
      ],
    },
  },
  {
    id: 'n11',
    thread: 'kestrel-pricing',
    actor: priya,
    action: 'mentioned you in',
    target: 'Kestrel Labs',
    reason: 'mention',
    preview: 'Pricing approved on our side, over to you for the order form.',
    at: '2026-11-09T16:52:00',
    read: true,
    subject: kestrel,
    context: {
      type: 'comment',
      thread: [
        {
          author: priya,
          at: '2026-11-09T16:52:00',
          text: '@Nina Alvarez pricing approved on our side, over to you for the order form.',
        },
      ],
    },
  },
  {
    id: 'n12',
    thread: 'brightwave-stage',
    actor: kofi,
    action: 'moved',
    target: 'Brightwave',
    trail: 'to Negotiation',
    reason: 'following',
    preview: 'Proposal → Negotiation · $21,600 a year',
    at: '2026-11-09T11:20:00',
    read: true,
    subject: brightwave,
    context: { type: 'change', field: 'Stage', from: 'Proposal', to: 'Negotiation' },
  },
];

export type Tab = 'all' | 'mentions' | 'assigned';

export const TABS: { value: Tab; label: string; includes: (n: Notification) => boolean }[] = [
  { value: 'all', label: 'All', includes: () => true },
  { value: 'mentions', label: 'Mentions', includes: (n) => n.reason === 'mention' },
  { value: 'assigned', label: 'Assigned to me', includes: (n) => n.reason === 'assigned' },
];
