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

/** The product is Orbit; the workspace paying for it is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

/** The day the screen shows; every date below is relative to it. */
export const today = '2026-11-10';

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

export type Interval = 'monthly' | 'yearly';
export type PlanId = 'starter' | 'growth' | 'scale';

export type Plan = {
  id: PlanId;
  name: string;
  /** Price per seat per month, by how often it is billed. */
  seatPrice: Record<Interval, number>;
  limits: { contacts: number; apiCalls: number; storageGb: number };
};

export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    seatPrice: { monthly: 19, yearly: 15 },
    limits: { contacts: 10_000, apiCalls: 100_000, storageGb: 20 },
  },
  {
    id: 'growth',
    name: 'Growth',
    seatPrice: { monthly: 39, yearly: 32 },
    limits: { contacts: 50_000, apiCalls: 1_000_000, storageGb: 100 },
  },
  {
    id: 'scale',
    name: 'Scale',
    seatPrice: { monthly: 69, yearly: 57 },
    limits: { contacts: 250_000, apiCalls: 5_000_000, storageGb: 1_000 },
  },
];

/** What the workspace pays for today. Seats are bought on top of any plan. */
export const subscription = {
  planId: 'growth' as PlanId,
  interval: 'monthly' as Interval,
  seats: 40,
  periodStart: '2026-11-01',
  periodEnd: '2026-11-30',
  renews: '2026-12-01',
};

/** What a cancelled workspace falls back to. */
export const freePlan = { seats: 3, contacts: 1_000, storageGb: 5 };

/** This period's usage, measured against the plan's limits and the seats bought. */
export const usage = { seats: 38, contacts: 41_280, apiCalls: 612_400, storageGb: 63.4 };

/** A meter is flagged from this share of its limit. */
export const NEAR_LIMIT = 0.9;

export const card = {
  brand: 'Mastercard',
  last4: '8812',
  expires: '2026-12',
  /** The first charge the card will not cover. */
  firstChargeAfterExpiry: '2027-01-01',
};

export const billingDetails = {
  email: 'finance@lumenstudio.co',
  company: 'Lumen Studio Ltd',
  address: ['21 Hoxton Square', 'London N1 6NN', 'United Kingdom'],
  vat: 'GB 318 4471 26',
};

export type InvoiceStatus = 'paid' | 'failed';

export type Invoice = {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
};

/** Newest first. Seats cost $39 a month on Growth; 4 seats added on 14 Oct are prorated. */
export const invoices: Invoice[] = [
  {
    id: 'ORB-2026-0118',
    date: '2026-11-01',
    description: 'Growth, 40 seats',
    amount: 1_560,
    status: 'failed',
  },
  {
    id: 'ORB-2026-0104',
    date: '2026-10-14',
    description: '4 seats added, Oct 14–31',
    amount: 90.58,
    status: 'paid',
  },
  {
    id: 'ORB-2026-0097',
    date: '2026-10-01',
    description: 'Growth, 36 seats',
    amount: 1_404,
    status: 'paid',
  },
  {
    id: 'ORB-2026-0081',
    date: '2026-09-01',
    description: 'Growth, 36 seats',
    amount: 1_404,
    status: 'paid',
  },
  {
    id: 'ORB-2026-0066',
    date: '2026-08-01',
    description: 'Growth, 36 seats',
    amount: 1_404,
    status: 'paid',
  },
  {
    id: 'ORB-2026-0052',
    date: '2026-07-01',
    description: 'Growth, 34 seats',
    amount: 1_326,
    status: 'paid',
  },
];

/** The charge that failed, and the day the workspace pauses if it stays unpaid. */
export const failedPayment = { invoiceId: 'ORB-2026-0118', pausesOn: '2026-11-21' };

export const planById = (id: PlanId) => plans.find((plan) => plan.id === id)!;

/** What one billing period costs: the seat price times the seats, times 12 when billed yearly. */
export const periodPrice = (plan: Plan, interval: Interval, seats: number) =>
  plan.seatPrice[interval] * seats * (interval === 'yearly' ? 12 : 1);
