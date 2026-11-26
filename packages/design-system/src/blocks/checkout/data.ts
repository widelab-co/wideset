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

// Example checkout for Lumen Studio's plan change. Display amounts are in cents.

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

export const subscription = {
  plan: 'Growth',
  seats: 40,
  seatsInUse: 38,
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

/** Example invoice adjustments and dates supplied with the demo. */
export const sampleInvoice = {
  credit: 1_092_00,
  tax: { label: 'VAT 0%, reverse charge', amount: 0 },
  nextChargeDate: { monthly: '2026-12-10', yearly: '2027-11-10' },
};

export const samplePromo = { code: 'ORBIT20', amount: { monthly: 552_00, yearly: 5_472_00 } };

type OrderSelection = {
  seats: number;
  addOnIds: string[];
  interval: Interval;
  showDiscount: boolean;
};

/** Assemble the display lines for the selected items using the sample invoice amounts. */
export function demoSummary({ seats, addOnIds, interval, showDiscount }: OrderSelection) {
  const months = interval === 'yearly' ? 12 : 1;
  const seatPrice = plan.seatPrice[interval];
  const lines: { id: string; label: string; detail?: string; amount: number }[] = [
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
  const discount = showDiscount ? samplePromo.amount[interval] : 0;
  const { credit, tax, nextChargeDate } = sampleInvoice;

  return {
    months,
    seatPrice,
    lines,
    subtotal,
    discount,
    credit,
    tax,
    total: subtotal - discount - credit + tax.amount,
    nextCharge: { date: nextChargeDate[interval], amount: subtotal },
  };
}

export type OrderTotals = ReturnType<typeof demoSummary>;
