import {
  type RemixiconComponentType,
  RiBankCardFill,
  RiBankCardLine,
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

import { formatDate, formatMonth, formatUsd } from './format';

/*
  Lumen Studio is on Scale: 40 seats at $69 a month = $2,760.00, paid up to 30 November 2026 and
  due to renew on 1 December. Cancelling lets the paid period run out, then the workspace drops to
  Free: 3 seats, no workflows, no single sign-on. Growth is $39 a seat (40 × $39 = $1,560.00,
  $1,200.00 less), keeps 50 workflows and has no single sign-on either. Every sentence on the page
  is put together below from these values.
*/

/** The product is Orbit; the workspace cancelling its plan is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

/** Where the links lead: replace with your routes. */
export const ROUTES = { billing: '#billing' };

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
];

export const settingsLinks: NavLink[] = [
  { id: 'general', label: 'General', icon: RiSettings3Line },
  { id: 'members', label: 'Members', icon: RiTeamLine },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine, activeIcon: RiBankCardFill },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

/** What the workspace pays for today. */
export const subscription = {
  plan: 'Scale',
  /** The price of a seat for a month. */
  seatPrice: 69,
  seats: 40,
  /** Seats with a member in them. */
  seatsInUse: 38,
  /** The last day already paid for. */
  periodEnd: '2026-11-30',
  /** The day the next period would start: the first day on the plan that follows. */
  renews: '2026-12-01',
};

/** What a cancelled workspace falls back to. It has no workflows and no single sign-on. */
export const freePlan = { name: 'Free', seats: 3 };

/** The plan under Scale. It keeps every seat and some workflows, and has no single sign-on. */
export const cheaperPlan = { name: 'Growth', seatPrice: 39, workflows: 50 };

/** A pause skips one period: nothing is charged, and the plan is back on this day. */
export const pause = { resumes: '2027-01-01' };

export const monthlyPrice = subscription.seats * subscription.seatPrice;
export const cheaperMonthlyPrice = subscription.seats * cheaperPlan.seatPrice;

const { plan, periodEnd, renews } = subscription;
const lastDay = formatDate(periodEnd);
const firstDay = formatDate(renews);

/** A fact as a row: what it is about, then one plain sentence. */
export type Fact = { term: string; text: string };

/** What goes on the day the workspace drops to Free, measured against what it uses today. */
export const losses: Fact[] = [
  {
    term: 'Seats',
    text: `${subscription.seatsInUse - freePlan.seats} of your ${subscription.seatsInUse} people lose access. ${freePlan.name} has ${freePlan.seats} seats.`,
  },
  { term: 'Workflows', text: `Every workflow stops running. ${freePlan.name} has none.` },
  {
    term: 'Single sign-on',
    text: 'SAML sign-in turns off. Everyone signs in with a password.',
  },
];

export type ReasonId = 'too-expensive' | 'not-using' | 'missing-feature' | 'switching' | 'other';

/** Why a team leaves: the closest answer, with room to write under the last one. */
export const reasons: { id: ReasonId; label: string }[] = [
  { id: 'too-expensive', label: 'It costs too much' },
  { id: 'not-using', label: 'We do not use it enough' },
  { id: 'missing-feature', label: 'It is missing something we need' },
  { id: 'switching', label: 'We are moving to another tool' },
  { id: 'other', label: 'Something else' },
];

/** How the page can end: the plan cancelled, or one of the two alternatives taken. */
export type OutcomeId = 'cancelled' | 'switched' | 'paused';

export type Outcome = {
  /** The result as the page's title, and one line under it. */
  title: string;
  line: string;
  /** What happens when, as rows. */
  facts: Fact[];
  /** The button that takes it back, and what the toast says once it has. */
  undo: string;
  undone: string;
};

export const outcomes: Record<OutcomeId, Outcome> = {
  cancelled: {
    title: `${plan} is cancelled`,
    line: `A confirmation is on its way to ${account.email}.`,
    facts: [
      { term: `Until ${lastDay}`, text: `${plan} stays on, with everything as it is today.` },
      {
        term: `From ${firstDay}`,
        text: `${workspace.name} is on ${freePlan.name}: ${freePlan.seats} seats, no workflows, no single sign-on.`,
      },
      { term: 'Charges', text: 'None. Your card is not charged again.' },
    ],
    undo: 'Undo cancellation',
    undone: `Cancellation undone. ${plan} stays on.`,
  },
  switched: {
    title: `${workspace.name} moves to ${cheaperPlan.name}`,
    line: `A confirmation is on its way to ${account.email}.`,
    facts: [
      { term: `Until ${lastDay}`, text: `${plan} stays on, with everything as it is today.` },
      {
        term: `From ${firstDay}`,
        text: `${cheaperPlan.name} with all ${subscription.seats} seats and ${cheaperPlan.workflows} workflows. Single sign-on turns off.`,
      },
      { term: 'Charges', text: `${formatUsd(cheaperMonthlyPrice)} a month, first on ${firstDay}.` },
    ],
    undo: `Stay on ${plan}`,
    undone: `Change undone. ${plan} stays on.`,
  },
  paused: {
    title: `${plan} is paused for ${formatMonth(renews)}`,
    line: `A confirmation is on its way to ${account.email}.`,
    facts: [
      { term: `Until ${lastDay}`, text: `${plan} stays on, with everything as it is today.` },
      {
        term: `From ${firstDay}`,
        text: `${workspace.name} is read-only: nothing is lost and nothing can be changed.`,
      },
      {
        term: 'Charges',
        text: `None on ${firstDay}. ${formatUsd(monthlyPrice)} again from ${formatDate(pause.resumes)}, when ${plan} is back on.`,
      },
    ],
    undo: 'Undo pause',
    undone: `Pause undone. ${plan} stays on.`,
  },
};

/** What is offered in place of cancelling: an outcome, and how it is put to the reader. */
export type Alternative = {
  outcome: Exclude<OutcomeId, 'cancelled'>;
  title: string;
  description: string;
  action: string;
};

/** The one alternative a reason has, when it has one. The other reasons get no offer. */
export const alternatives: Partial<Record<ReasonId, Alternative>> = {
  'too-expensive': {
    outcome: 'switched',
    title: `${cheaperPlan.name} costs ${formatUsd(monthlyPrice - cheaperMonthlyPrice)} less a month`,
    description: `${formatUsd(cheaperMonthlyPrice)} a month for the same ${subscription.seats} seats, from ${firstDay}. You keep ${cheaperPlan.workflows} workflows and lose single sign-on.`,
    action: `Switch to ${cheaperPlan.name}`,
  },
  'not-using': {
    outcome: 'paused',
    title: `You can pause ${plan} for a month`,
    description: `Nothing is charged on ${firstDay}. The workspace is read-only until ${plan} is back on ${formatDate(pause.resumes)}.`,
    action: 'Pause for a month',
  },
};
