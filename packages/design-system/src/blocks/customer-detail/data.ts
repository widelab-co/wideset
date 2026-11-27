import {
  type RemixiconComponentType,
  RiBarChartBoxLine,
  RiBuilding2Fill,
  RiBuilding2Line,
  RiContactsBook3Line,
  RiHandCoinLine,
  RiHome5Line,
  RiInbox2Line,
  RiLineChartLine,
  RiQuestionLine,
  RiSettingsLine,
  RiTaskLine,
} from '@remixicon/react';
import type { AvatarColor } from '@wideset/react';

/*
  Orbit, a customer and revenue platform, in the Lumen Studio workspace. The record is one
  customer, Lanetrack; every figure on the page comes from the deals below: the two won deals make
  the current €64,800 a year (€5,400 a month, 120 seats at €45), the three open ones the pipeline.
*/

/** "Now" for the relative times in the activity; the sample is frozen at this moment. */
export const NOW = '2026-11-10T15:00:00Z';

export const workspace = { name: 'Lumen Studio', plan: 'Growth plan' };

export type Person = { name: string; initials: string; color: AvatarColor };

const maya: Person = { name: 'Maya Chen', initials: 'MC', color: 'teal' };
const priya: Person = { name: 'Priya Nair', initials: 'PN', color: 'purple' };
const tomas: Person = { name: 'Tomás Ruiz', initials: 'TR', color: 'orange' };

/** The signed-in user: the customer's owner. */
export const account = { ...maya, email: 'maya@lumenstudio.com' };

export type NavLink = {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  /** The icon while the page is open (a line icon swaps for its fill). */
  activeIcon?: RemixiconComponentType;
  /** A count that stays visible on the row. */
  count?: number;
};

export const mainLinks: NavLink[] = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'inbox', label: 'Inbox', icon: RiInbox2Line, count: 4 },
  { id: 'tasks', label: 'My tasks', icon: RiTaskLine, count: 7 },
];

export const recordLinks: NavLink[] = [
  { id: 'customers', label: 'Customers', icon: RiBuilding2Line, activeIcon: RiBuilding2Fill },
  { id: 'contacts', label: 'Contacts', icon: RiContactsBook3Line },
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
];

export const insightLinks: NavLink[] = [
  { id: 'reports', label: 'Reports', icon: RiBarChartBoxLine },
  { id: 'forecast', label: 'Forecast', icon: RiLineChartLine },
];

export const footerLinks: NavLink[] = [
  { id: 'settings', label: 'Settings', icon: RiSettingsLine },
  { id: 'help', label: 'Help', icon: RiQuestionLine },
];

export type Contact = Person & { role: string; email: string };

const pieter: Contact = {
  name: 'Pieter de Vries',
  initials: 'PV',
  color: 'blue',
  role: 'Head of Operations',
  email: 'pieter@lanetrack.io',
};
const sanne: Contact = {
  name: 'Sanne Bakker',
  initials: 'SB',
  color: 'pink',
  role: 'CFO',
  email: 'sanne@lanetrack.io',
};
const jonas: Contact = {
  name: 'Jonas Meier',
  initials: 'JM',
  color: 'lime',
  role: 'IT Lead',
  email: 'jonas@lanetrack.io',
};
const aylin: Contact = {
  name: 'Aylin Kaya',
  initials: 'AK',
  color: 'yellow',
  role: 'Dispatch Manager',
  email: 'aylin@lanetrack.io',
};

export type DealStage = 'Discovery' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export type Deal = {
  id: string;
  name: string;
  /** What kind of deal, under its name. */
  kind: string;
  stage: DealStage;
  owner: Person;
  /** ISO day it closes (open) or closed (won, lost). */
  closeDate: string;
  /** Value a year, in euros. */
  value: number;
};

export const deals: Deal[] = [
  {
    id: 'sso',
    name: 'SSO and audit log',
    kind: 'Add-on',
    stage: 'Negotiation',
    owner: maya,
    closeDate: '2026-11-27',
    value: 9_600,
  },
  {
    id: 'seats-160',
    name: 'Q4 seat expansion',
    kind: 'Expansion, 40 seats',
    stage: 'Proposal',
    owner: maya,
    closeDate: '2026-12-11',
    value: 21_600,
  },
  {
    id: 'analytics',
    name: 'Advanced analytics',
    kind: 'Add-on',
    stage: 'Discovery',
    owner: priya,
    closeDate: '2027-02-26',
    value: 14_400,
  },
  {
    id: 'seats-120',
    name: '2025 seat expansion',
    kind: 'Expansion, 40 seats',
    stage: 'Won',
    owner: maya,
    closeDate: '2025-09-30',
    value: 21_600,
  },
  {
    id: 'automation',
    name: 'Workflow automation',
    kind: 'Add-on',
    stage: 'Lost',
    owner: tomas,
    closeDate: '2025-06-18',
    value: 7_200,
  },
  {
    id: 'scale',
    name: 'Scale plan, 80 seats',
    kind: 'New business',
    stage: 'Won',
    owner: maya,
    closeDate: '2025-03-03',
    value: 43_200,
  },
];

export const openDeals = deals.filter(({ stage }) => stage !== 'Won' && stage !== 'Lost');

/** The customer the page is about. */
export const customer = {
  name: 'Lanetrack',
  initials: 'LT',
  domain: 'lanetrack.io',
  status: 'Active',
  owner: maya,
  plan: 'Scale, billed yearly',
  /** Monthly recurring revenue, in euros: 120 seats at €45. */
  mrr: 5_400,
  customerSince: '2025-03-03',
  seats: { used: 112, licensed: 120 },
  industry: 'Logistics software',
  employees: 120,
  location: 'Rotterdam, Netherlands',
  /** 0–100, from usage, support load and engagement. */
  health: { score: 82, label: 'Good', previous: 76 },
  contacts: [pieter, sanne, jonas, aylin],
};

export type ActivityKind = 'stage' | 'call' | 'email' | 'note' | 'deal';

export type Activity = {
  id: string;
  kind: ActivityKind;
  /** Who did it. */
  actor: Person;
  /** What they did, read after the actor's name ("logged a call with"). */
  action: string;
  /** What or whom it was done to, read after the action. */
  subject?: string;
  /** What it said or changed, under the line: the email, the call notes, the note, the stages. */
  detail?: string;
  /** ISO date and time. */
  at: string;
};

export const activity: Activity[] = [
  {
    id: 'stage-proposal',
    kind: 'stage',
    actor: maya,
    action: 'moved',
    subject: 'Q4 seat expansion',
    detail: 'Discovery → Proposal',
    at: '2026-11-10T13:05:00Z',
  },
  {
    id: 'call-quote',
    kind: 'call',
    actor: maya,
    action: 'logged a call with',
    subject: pieter.name,
    detail:
      'Walked through the 160-seat quote. Pieter needs Sanne’s sign-off before 5 Dec; the revised order form goes out on Friday.',
    at: '2026-11-09T16:20:00Z',
  },
  {
    id: 'email-sso',
    kind: 'email',
    actor: jonas,
    action: 'replied to',
    subject: maya.name,
    detail:
      'Our SAML setup passed the security review. I’ll send the completed questionnaire this week.',
    at: '2026-11-07T09:42:00Z',
  },
  {
    id: 'note-qbr',
    kind: 'note',
    actor: priya,
    action: 'added a note',
    detail:
      'QBR done. Dispatch is at 112 of 120 seats, and the Antwerp and Hamburg depots go live in January: expect 40 more users.',
    at: '2026-11-05T11:10:00Z',
  },
  {
    id: 'email-pricing',
    kind: 'email',
    actor: maya,
    action: 'emailed',
    subject: sanne.name,
    detail: 'Revised pricing for 160 seats, with the SSO add-on on the same yearly invoice.',
    at: '2026-11-03T08:30:00Z',
  },
  {
    id: 'deal-analytics',
    kind: 'deal',
    actor: priya,
    action: 'created the deal',
    subject: 'Advanced analytics',
    at: '2026-10-29T14:00:00Z',
  },
  {
    id: 'call-sso-demo',
    kind: 'call',
    actor: tomas,
    action: 'logged a call with',
    subject: jonas.name,
    detail:
      'SSO demo with Okta. Jonas wants audit log exports in their SIEM; confirmed they are part of the add-on.',
    at: '2026-10-22T13:00:00Z',
  },
  {
    id: 'note-invoice',
    kind: 'note',
    actor: maya,
    action: 'added a note',
    detail:
      'Sanne wants one invoice a year for the plan and every add-on, in euros, on their PO number.',
    at: '2026-10-20T10:15:00Z',
  },
];
