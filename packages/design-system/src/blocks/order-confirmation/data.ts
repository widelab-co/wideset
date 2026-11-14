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

/*
  The order: on Nov 10, 2026 Maya moved Lumen Studio from Growth ($39 a seat) to Scale ($69 a
  seat), 40 seats, billed monthly. The billing period runs Nov 1 – 30 and Growth is already paid
  for it, so today's charge is the difference for the days that are left: 40 seats × $30 × 21/30 =
  $840.00. From Dec 1 the full Scale price applies: 40 × $69 = $2,760.00. Lumen Studio Ltd is a UK
  business with a VAT number, so the VAT is reverse-charged: 0%. Every amount on the page is
  worked out below from these values.
*/

/** The product is Orbit; the workspace that bought the plan is Lumen Studio. */
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
];

export const settingsLinks: NavLink[] = [
  { id: 'general', label: 'General', icon: RiSettings3Line },
  { id: 'members', label: 'Members', icon: RiTeamLine },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine, activeIcon: RiBankCardFill },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

export const order = {
  /** The order's number is also its invoice's. */
  number: 'ORB-2026-0131',
  placed: '2026-11-10',
  /** The plan the workspace left and the one it bought: price per seat per month. */
  previous: { name: 'Growth', seatPrice: 39 },
  plan: { name: 'Scale', seatPrice: 69 },
  interval: 'Billed monthly',
  seats: 40,
  /** The billing period the upgrade lands in: Scale is charged from `placed` to its end. */
  period: { from: '2026-11-01', to: '2026-11-30' },
  nextCharge: '2026-12-01',
  vat: { rate: 0, label: 'reverse charge' },
  card: { brand: 'Mastercard', last4: '8812' },
};

/** Seats with someone in them: the rest are free to hand out. */
export const seatsUsed = 38;

const DAY = 86_400_000;
/** The days from one calendar day to another, both counted. */
const days = (from: string, to: string) => (Date.parse(to) - Date.parse(from)) / DAY + 1;
/** Rounds to whole cents, the way the totals are charged. */
const cents = (value: number) => Math.round(value * 100) / 100;

/** What a seat costs more on the new plan, a month. */
export const seatDifference = order.plan.seatPrice - order.previous.seatPrice;
export const daysLeft = days(order.placed, order.period.to);
export const daysInPeriod = days(order.period.from, order.period.to);

/** Today's charge: the difference for every seat, for the share of the period that is left. */
export const subtotal = cents((order.seats * seatDifference * daysLeft) / daysInPeriod);
export const vatAmount = cents(subtotal * order.vat.rate);
export const total = cents(subtotal + vatAmount);
/** From the next period on: every seat at the new plan's full price. */
export const nextChargeAmount = order.seats * order.plan.seatPrice;

export type NextStep = { id: string; title: string; description: string; href: string };

/** What the new plan makes worth doing first: two at most, one line and one destination each. */
export const nextSteps: NextStep[] = [
  {
    id: 'invite',
    title: 'Invite teammates',
    description: `${order.seats - seatsUsed} of your ${order.seats} seats are still free.`,
    href: '#members',
  },
  {
    id: 'sso',
    title: 'Turn on single sign-on',
    description: `SAML sign-in comes with ${order.plan.name}. Connect your identity provider.`,
    href: '#single-sign-on',
  },
];
