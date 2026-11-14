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
  One invoice from Billing's list: ORB-2026-0097, October's Growth seats for Lumen Studio, 36 at
  $39 = $1,404.00, charged to the card on the day it was issued. Orbit Inc. is a US company and
  Lumen Studio Ltd a UK business with a VAT number, so the VAT is reverse-charged: 0% on the
  invoice, and Lumen Studio accounts for it to HMRC. Every total is worked out from the lines.
*/

/** The product is Orbit; the workspace paying for it is Lumen Studio. */
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

/** A company on the invoice: who bills, or who is billed. */
export type Party = { name: string; address: string[]; taxId: string; email: string };

export const issuer: Party = {
  name: 'Orbit Inc.',
  address: ['548 Market Street, Suite 41210', 'San Francisco, CA 94104', 'United States'],
  taxId: 'EIN 88-4127305',
  email: 'billing@orbit.so',
};

export const billedTo: Party = {
  name: 'Lumen Studio Ltd',
  address: ['21 Hoxton Square', 'London N1 6NN', 'United Kingdom'],
  taxId: 'VAT GB 318 4471 26',
  email: 'finance@lumenstudio.co',
};

export type InvoiceLine = {
  id: string;
  description: string;
  /** What the line covers, under its description. */
  detail: string;
  quantity: number;
  /** The quantity's unit, after the number ("36 seats"). */
  unit: string;
  unitPrice: number;
};

export const invoice = {
  number: 'ORB-2026-0097',
  /** As Billing's list words it. */
  description: 'Growth, 36 seats',
  status: 'Paid',
  currency: 'USD',
  issued: '2026-10-01',
  /** Charged automatically, so it falls due the day it is issued. */
  due: '2026-10-01',
  paid: '2026-10-01',
  period: { from: '2026-10-01', to: '2026-10-31' },
  lines: [
    {
      id: 'growth-seats',
      description: 'Growth plan',
      detail: 'Seats, billed monthly',
      quantity: 36,
      unit: 'seats',
      unitPrice: 39,
    },
  ] satisfies InvoiceLine[],
  vat: { rate: 0, label: 'reverse charge' },
  card: { brand: 'Mastercard', last4: '8812' },
};

/** Rounds to whole cents, the way the totals are charged. */
const cents = (value: number) => Math.round(value * 100) / 100;

export const lineAmount = (line: InvoiceLine) => cents(line.quantity * line.unitPrice);
export const subtotal = cents(invoice.lines.reduce((sum, line) => sum + lineAmount(line), 0));
export const vatAmount = cents(subtotal * invoice.vat.rate);
export const total = cents(subtotal + vatAmount);
export const amountPaid = total;
export const amountDue = cents(total - amountPaid);

export type InvoiceEventKind = 'created' | 'paid' | 'sent' | 'viewed';

export type InvoiceEvent = {
  id: string;
  kind: InvoiceEventKind;
  /** What happened, as one line. */
  label: string;
  /** ISO date and time, UTC. */
  at: string;
};

/** What happened to the invoice, newest first. */
export const activity: InvoiceEvent[] = [
  {
    id: 'viewed',
    kind: 'viewed',
    label: `Viewed by ${account.name}`,
    at: '2026-10-02T08:24:00Z',
  },
  {
    id: 'sent',
    kind: 'sent',
    label: `Sent to ${billedTo.email}`,
    at: '2026-10-01T09:02:00Z',
  },
  {
    id: 'paid',
    kind: 'paid',
    label: `Paid with ${invoice.card.brand} ending ${invoice.card.last4}`,
    at: '2026-10-01T09:01:00Z',
  },
  {
    id: 'created',
    kind: 'created',
    label: `Issued by ${issuer.name}`,
    at: '2026-10-01T09:00:00Z',
  },
];
