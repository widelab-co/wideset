import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiHandCoinLine,
  RiHome5Line,
  RiInbox2Line,
  RiKey2Line,
  RiLayoutMasonryFill,
  RiLayoutMasonryLine,
  RiLineChartLine,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionLine,
  RiSettings3Line,
  RiTeamLine,
} from '@remixicon/react';
import type { AvatarColor } from '@wideset/react';

/*
  Orbit's template library as Lumen Studio sees it: playbooks, e-mail sequences, reports and
  dashboards, made by Orbit or by a teammate, free to add to the workspace. Two collections are
  Orbit's picks; one is Maya's own. Two templates are already in the workspace, three are saved.
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
  {
    id: 'templates',
    label: 'Templates',
    icon: RiLayoutMasonryLine,
    activeIcon: RiLayoutMasonryFill,
  },
];

export const settingsLinks: NavLink[] = [
  { id: 'general', label: 'General', icon: RiSettings3Line },
  { id: 'members', label: 'Members', icon: RiTeamLine },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

export type Person = { name: string; initials: string; color?: AvatarColor };
export type PersonId = 'maya' | 'jonas' | 'priya' | 'tom' | 'elena' | 'daniel' | 'leo' | 'nina';

export const PEOPLE: Record<PersonId, Person> = {
  maya: { name: account.name, initials: account.initials, color: 'orange' },
  jonas: { name: 'Jonas Weber', initials: 'JW' },
  priya: { name: 'Priya Raman', initials: 'PR' },
  tom: { name: 'Tom Becker', initials: 'TB' },
  elena: { name: 'Elena Silva', initials: 'ES' },
  daniel: { name: 'Daniel Reyes', initials: 'DR' },
  leo: { name: 'Leo Marchetti', initials: 'LM' },
  nina: { name: 'Nina Alvarez', initials: 'NA' },
};
export const ME: PersonId = 'maya';

/** Who made a template or a collection: Orbit, or someone in the workspace. */
export type Maker = 'orbit' | PersonId;
export const makerName = (maker: Maker) => (maker === 'orbit' ? 'Orbit' : PEOPLE[maker].name);

export type Kind = 'playbook' | 'sequence' | 'report' | 'dashboard';

export const CATEGORIES: { value: Kind | 'all' | 'saved'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'playbook', label: 'Playbooks' },
  { value: 'sequence', label: 'E-mail sequences' },
  { value: 'report', label: 'Reports' },
  { value: 'dashboard', label: 'Dashboards' },
  { value: 'saved', label: 'Saved' },
];
export type Category = (typeof CATEGORIES)[number]['value'];

export const KIND_LABEL: Record<Kind, string> = {
  playbook: 'Playbook',
  sequence: 'E-mail sequence',
  report: 'Report',
  dashboard: 'Dashboard',
};

/** Where an added template lives in Orbit, for the link that opens it. */
export const KIND_HOME: Record<Kind, { label: string; href: string }> = {
  playbook: { label: 'Open in Deals', href: '#deals' },
  sequence: { label: 'Open in Inbox', href: '#inbox' },
  report: { label: 'Open in Reports', href: '#reports' },
  dashboard: { label: 'Open in Reports', href: '#reports' },
};

export type Template = {
  id: string;
  name: string;
  /** One line under the name. */
  summary: string;
  kind: Kind;
  by: Maker;
  /** Teams across Orbit that use it. */
  teams: number;
  /** When it was published, for Newest. */
  published: string;
  /** A short paragraph for the detail. */
  about: string;
  /** What adding it brings, as a short list. */
  contents: string[];
  /** Teammates in Lumen Studio who already use it. */
  usedBy: PersonId[];
};

export const TEMPLATES: Template[] = [
  {
    id: 'discovery',
    name: 'Discovery call playbook',
    summary: 'Questions, qualification and next steps for a first call.',
    kind: 'playbook',
    by: 'orbit',
    teams: 4820,
    published: '2025-03-12',
    about:
      'A first call in four parts: why now, what hurts, who decides and what happens next. Each part has the questions to ask and a place for what you heard, so the notes land on the deal.',
    contents: [
      '12 discovery questions in four parts',
      'Qualification checklist (MEDDICC)',
      'Next-step e-mail to send after the call',
      'Call notes saved to the deal',
    ],
    usedBy: ['jonas', 'tom', 'nina'],
  },
  {
    id: 'qbr',
    name: 'Quarterly business review',
    summary: 'Prepare and run a QBR with an existing customer.',
    kind: 'playbook',
    by: 'orbit',
    teams: 2310,
    published: '2025-06-02',
    about:
      'Everything for a review with a customer: the agenda, the numbers to bring, the questions that surface expansion, and the follow-up that turns it into a plan.',
    contents: [
      'Agenda for a 45-minute review',
      'Usage and value summary to fill in',
      'Expansion questions',
      'Follow-up e-mail with the agreed plan',
    ],
    usedBy: ['priya'],
  },
  {
    id: 'renewal-risk',
    name: 'Renewal risk playbook',
    summary: 'Spot accounts at risk 90 days before renewal and act.',
    kind: 'playbook',
    by: 'priya',
    teams: 3,
    published: '2026-09-18',
    about:
      'How Lumen Studio handles a renewal that looks shaky: the signals to watch from 90 days out, who to bring in, and the save offer the team may make.',
    contents: [
      'Risk signals to check each week',
      'Escalation steps by account size',
      'Save offer guidelines',
      'Call script for the first risk call',
    ],
    usedBy: ['priya', 'leo'],
  },
  {
    id: 'deal-review',
    name: 'Enterprise deal review',
    summary: 'A weekly review for deals over $50,000.',
    kind: 'playbook',
    by: 'orbit',
    teams: 1460,
    published: '2025-11-20',
    about:
      'A short weekly review that keeps large deals honest: what changed, what is blocking, and the one action that moves the deal this week.',
    contents: [
      'Review checklist for each deal',
      'Mutual action plan template',
      'Risk and blocker log',
    ],
    usedBy: [],
  },
  {
    id: 'onboarding',
    name: 'New rep onboarding',
    summary: 'The first 30 days for a new account executive.',
    kind: 'playbook',
    by: 'elena',
    teams: 2,
    published: '2026-10-04',
    about:
      'What a new account executive at Lumen Studio does in the first month: who to meet, which calls to shadow and when to take a first deal.',
    contents: ['30-day checklist by week', 'Calls to shadow', 'Product and pricing quiz'],
    usedBy: ['elena'],
  },
  {
    id: 'outbound',
    name: 'Outbound to new accounts',
    summary: 'Five e-mails over three weeks for a cold account.',
    kind: 'sequence',
    by: 'orbit',
    teams: 6150,
    published: '2025-01-28',
    about:
      'A five-step sequence for an account that has not heard of you: a short opener, a proof point, a question, a resource and a polite close. It stops when someone replies.',
    contents: [
      '5 e-mails over 21 days',
      'Stops on reply or meeting booked',
      'Personal fields for name, company and role',
    ],
    usedBy: ['tom', 'nina'],
  },
  {
    id: 'renewal-reminders',
    name: 'Renewal reminders',
    summary: 'Three reminders from 60 days before the renewal date.',
    kind: 'sequence',
    by: 'orbit',
    teams: 3890,
    published: '2025-04-15',
    about:
      'Three reminders to the customer’s main contact, at 60, 30 and 7 days before the renewal, each with the renewal amount and a link to book a call.',
    contents: [
      '3 e-mails at 60, 30 and 7 days',
      'Renewal amount and date filled in',
      'Booking link for a renewal call',
    ],
    usedBy: [],
  },
  {
    id: 'post-demo',
    name: 'Post-demo follow-up',
    summary: 'The recap and two nudges after a product demo.',
    kind: 'sequence',
    by: 'tom',
    teams: 4,
    published: '2026-08-22',
    about:
      'What Tom sends after a demo: a recap the same day with the recording, then two short nudges a week apart if nobody answers.',
    contents: ['Recap e-mail with the recording', '2 follow-ups, 7 days apart'],
    usedBy: ['tom', 'jonas'],
  },
  {
    id: 'event-follow-up',
    name: 'Event follow-up',
    summary: 'Follow up with people you met at an event.',
    kind: 'sequence',
    by: 'orbit',
    teams: 2740,
    published: '2026-02-10',
    about:
      'A short sequence for the week after a trade show or meetup: a thank-you, the thing you promised, and an invitation to talk.',
    contents: ['3 e-mails over 10 days', 'Event name and booth notes filled in'],
    usedBy: [],
  },
  {
    id: 'pipeline-by-stage',
    name: 'Pipeline by stage',
    summary: 'Open deals and their value at each stage, week by week.',
    kind: 'report',
    by: 'orbit',
    teams: 7240,
    published: '2024-11-05',
    about:
      'The open pipeline at each stage and how it moved since last week, by owner. The report most teams start their Monday with.',
    contents: ['Value and count by stage', 'Change since last week', 'Breakdown by owner'],
    usedBy: ['jonas', 'priya', 'tom', 'daniel'],
  },
  {
    id: 'win-rate',
    name: 'Win rate by source',
    summary: 'Which lead sources turn into closed deals.',
    kind: 'report',
    by: 'orbit',
    teams: 3120,
    published: '2025-08-19',
    about:
      'Win rate and average deal size for each lead source over the last four quarters, so you know which channels deserve the next dollar.',
    contents: [
      'Win rate by source, by quarter',
      'Average deal size by source',
      'Time to close by source',
    ],
    usedBy: [],
  },
  {
    id: 'forecast',
    name: 'Forecast against target',
    summary: 'Commit, best case and closed against the quarter’s target.',
    kind: 'report',
    by: 'daniel',
    teams: 2,
    published: '2026-10-27',
    about:
      'Daniel’s weekly forecast view: what each rep commits, the best case and what is closed, against the quarter’s target.',
    contents: ['Commit and best case by rep', 'Closed against target', 'Gap to target by week'],
    usedBy: ['daniel', 'maya'],
  },
  {
    id: 'leadership',
    name: 'Sales leadership dashboard',
    summary: 'Bookings, pipeline coverage and forecast on one page.',
    kind: 'dashboard',
    by: 'orbit',
    teams: 5380,
    published: '2025-05-07',
    about:
      'One page for the head of sales: bookings this quarter, pipeline coverage for the next, the forecast and the deals that moved.',
    contents: [
      'Bookings and target',
      'Pipeline coverage for next quarter',
      'Forecast by rep',
      'Deals that moved this week',
    ],
    usedBy: [],
  },
  {
    id: 'rep-performance',
    name: 'Rep performance',
    summary: 'Activity, pipeline and wins for each rep.',
    kind: 'dashboard',
    by: 'orbit',
    teams: 4410,
    published: '2025-09-30',
    about:
      'Each rep’s calls, meetings, new pipeline and wins side by side, for one-to-ones and coaching.',
    contents: ['Activity by rep', 'New pipeline by rep', 'Wins and win rate by rep'],
    usedBy: ['maya'],
  },
  {
    id: 'customer-health',
    name: 'Customer health',
    summary: 'Usage, support and renewal dates for every customer.',
    kind: 'dashboard',
    by: 'leo',
    teams: 3,
    published: '2026-09-02',
    about:
      'Leo’s view of every customer: how much they use Orbit, open support tickets and how far the renewal is, sorted by what needs a call first.',
    contents: ['Usage trend by customer', 'Open support tickets', 'Days to renewal'],
    usedBy: ['leo', 'priya'],
  },
];

export type Collection = {
  id: string;
  name: string;
  description: string;
  by: Maker;
  templates: string[];
};

export const COLLECTIONS: Collection[] = [
  {
    id: 'start-of-quarter',
    name: 'Start of quarter',
    description: 'Plan the quarter: the reviews, the pipeline and the forecast.',
    by: 'orbit',
    templates: ['pipeline-by-stage', 'forecast', 'leadership', 'deal-review', 'qbr'],
  },
  {
    id: 'renewals',
    name: 'Renewals',
    description: 'Spot risk early, remind on time and renew without a scramble.',
    by: 'orbit',
    templates: ['renewal-risk', 'renewal-reminders', 'customer-health', 'qbr'],
  },
  {
    id: 'q1-kickoff',
    name: 'Q1 kickoff',
    description: 'What the team runs in the first weeks of January.',
    by: 'maya',
    templates: ['discovery', 'outbound', 'onboarding'],
  },
];

/** Templates already added to Lumen Studio's workspace. */
export const ADDED = ['discovery', 'pipeline-by-stage'];
/** Templates Maya has saved. */
export const SAVED = ['renewal-risk', 'leadership', 'outbound'];

export type SortKey = 'popular' | 'newest';
export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
];
