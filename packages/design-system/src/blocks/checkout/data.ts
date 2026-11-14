import {
  type RemixiconComponentType,
  RiBankCardFill,
  RiBankCardLine,
  RiContactsBook3Line,
  RiCustomerService2Line,
  RiHandCoinLine,
  RiHardDrive3Line,
  RiHome5Line,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartLine,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionLine,
  RiSettings3Line,
  RiStackLine,
  RiTeamLine,
} from '@remixicon/react';

/*
  Maya moves Lumen Studio from Growth to Scale on 10 November 2026. The new period starts that
  day, so November's Growth seats are credited for the 21 days they will not be used. Money is
  whole cents everywhere in this block: every sum is an integer, so the lines add up exactly.
*/

/** The product is Orbit; the workspace paying for it is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

/** The day the screen shows; the new billing period starts on it. */
export const today = '2026-11-10';

/** Where the links lead: replace with your routes. */
export const ROUTES = { terms: '#terms', receipt: '#order-confirmation' };

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

/** What the workspace pays for today: November's Growth seats, already charged. */
export const subscription = {
  plan: 'Growth',
  seatPrice: 39_00,
  seats: 40,
  /** Seats with a member in them: the fewest the workspace can buy. */
  seatsInUse: 38,
  periodStart: '2026-11-01',
  periodEnd: '2026-11-30',
};

/**
 * The plan it moves to: the price of a seat for a month, by how often it is billed. Each line of
 * the order carries an icon for its thumbnail.
 */
export const plan = {
  name: 'Scale',
  icon: RiStackLine,
  seatPrice: { monthly: 69_00, yearly: 57_00 } satisfies Record<Interval, number>,
};

export const MAX_SEATS = 500;

export type AddOn = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  icon: RemixiconComponentType;
};

/** Extras bought on top of the plan, priced by the month whatever the billing period. */
export const addOns: AddOn[] = [
  {
    id: 'priority-support',
    name: 'Priority support',
    description: 'A first reply within one hour, every day of the week.',
    monthlyPrice: 199_00,
    icon: RiCustomerService2Line,
  },
  {
    id: 'extra-storage',
    name: 'Extra storage',
    description: 'One more terabyte for files and call recordings.',
    monthlyPrice: 49_00,
    icon: RiHardDrive3Line,
  },
];

/** The card on file. */
export const savedCard = { brand: 'Mastercard', last4: '8812', expires: '2026-12' };

/** Where receipts and invoices go. */
export const receiptEmail = 'finance@lumenstudio.co';

export type BillingDetails = {
  company: string;
  address: string;
  city: string;
  postalCode: string;
  /** A `countries` value. */
  country: string;
  /** Empty when the company has none: VAT is then charged. */
  vatNumber: string;
};

export const billingDetails: BillingDetails = {
  company: 'Lumen Studio Ltd',
  address: '21 Hoxton Square',
  city: 'London',
  postalCode: 'N1 6NN',
  country: 'gb',
  vatNumber: 'GB 318 4471 26',
};

export const countries = [
  { value: 'de', label: 'Germany' },
  { value: 'ie', label: 'Ireland' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'pl', label: 'Poland' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
];

export const countryName = (value: string) =>
  countries.find((country) => country.value === value)?.label ?? value;

/**
 * Orbit Inc. is a US company and Lumen Studio a UK business. With a VAT number the VAT is
 * reverse-charged (0% here, accounted for by the buyer); without one it is charged at this rate.
 */
export const VAT_RATE = 0.2;

export type Promo = { code: string; /** The share taken off the first period. */ rate: number };

/** The codes that work. Anything else is rejected at the field. */
export const promos: Promo[] = [{ code: 'ORBIT20', rate: 0.2 }];

export const findPromo = (code: string) =>
  promos.find((promo) => promo.code === code.trim().toUpperCase());

/** What is being bought: everything the total depends on. */
export type Order = {
  seats: number;
  addOnIds: string[];
  interval: Interval;
  promo: Promo | null;
  vatNumber: string;
};

export type OrderLine = { id: string; label: string; detail?: string; amount: number };

const DAY = 86_400_000;
/** Calendar days from one ISO date to another, both included. */
const daysInclusive = (from: string, to: string) => (Date.parse(to) - Date.parse(from)) / DAY + 1;

/** `2026-11-10` plus a number of months, as an ISO date. */
const addMonths = (iso: string, months: number) => {
  const date = new Date(iso);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, 10);
};

/** The part of this month's Growth charge that will not be used once the workspace moves today. */
export const unusedCredit = Math.round(
  (subscription.seats * subscription.seatPrice * daysInclusive(today, subscription.periodEnd)) /
    daysInclusive(subscription.periodStart, subscription.periodEnd),
);

/**
 * Prices an order: the lines, what the promo code and the unused time take off, the VAT, what is
 * due today and what the next period costs. The promo code and the credit apply to the first
 * charge only. Everything is derived here, in cents, so no figure on the screen is typed twice.
 */
export function priceOrder({ seats, addOnIds, interval, promo, vatNumber }: Order) {
  const months = interval === 'yearly' ? 12 : 1;
  const seatPrice = plan.seatPrice[interval];
  const lines: OrderLine[] = [
    {
      id: 'plan',
      label: `${plan.name} plan`,
      detail: `${seats} seats`,
      amount: seats * seatPrice * months,
    },
    ...addOns
      .filter((addOn) => addOnIds.includes(addOn.id))
      .map((addOn) => ({
        id: addOn.id,
        label: addOn.name,
        amount: addOn.monthlyPrice * months,
      })),
  ];
  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const discount = promo ? Math.round(subtotal * promo.rate) : 0;
  const vatRate = vatNumber.trim() ? 0 : VAT_RATE;
  const net = subtotal - discount - unusedCredit;
  const vat = Math.round(net * vatRate);

  return {
    months,
    seatPrice,
    lines,
    subtotal,
    discount,
    credit: unusedCredit,
    vatRate,
    vat,
    total: net + vat,
    nextCharge: {
      date: addMonths(today, months),
      amount: subtotal + Math.round(subtotal * vatRate),
    },
  };
}

export type OrderTotals = ReturnType<typeof priceOrder>;
