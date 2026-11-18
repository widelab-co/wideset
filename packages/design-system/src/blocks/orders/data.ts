import {
  type RemixiconComponentType,
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
  RiShoppingBag3Fill,
  RiShoppingBag3Line,
  RiTeamLine,
} from '@remixicon/react';

/*
  What Lumen Studio's customers bought through it in the four weeks to 10 November 2026: meeting
  room hardware, onboarding and licences. Lumen Studio Ltd is a UK business, so its UK customers
  pay 20% VAT and the others none. Money is kept in whole cents and every total is worked out
  from the order's lines.
*/

/** The product is Orbit; the workspace selling through it is Lumen Studio. */
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
  { id: 'orders', label: 'Orders', icon: RiShoppingBag3Line, activeIcon: RiShoppingBag3Fill },
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

/** The day the sample is seen from, so the calendar agrees with the rows. */
export const TODAY = '2026-11-10';

export type CustomerId =
  'atlas' | 'cobalt' | 'halcyon' | 'juniper' | 'kestrel' | 'marlow' | 'northwind' | 'tidewater';

/** Who buys: the initials on their avatar, the card each one pays with, and the VAT charged. */
export const CUSTOMERS: Record<
  CustomerId,
  { name: string; initials: string; card: string; vatRate: number }
> = {
  atlas: { name: 'Atlas Robotics', initials: 'AR', card: 'Amex ending 3007', vatRate: 0 },
  cobalt: { name: 'Cobalt Security', initials: 'CS', card: 'Visa ending 9034', vatRate: 0 },
  halcyon: { name: 'Halcyon Freight', initials: 'HF', card: 'Visa ending 2190', vatRate: 0 },
  juniper: { name: 'Juniper Legal', initials: 'JL', card: 'Mastercard ending 2264', vatRate: 0.2 },
  kestrel: { name: 'Kestrel Analytics', initials: 'KA', card: 'Visa ending 1881', vatRate: 0 },
  marlow: { name: 'Marlow & Finch', initials: 'MF', card: 'Visa ending 6411', vatRate: 0.2 },
  northwind: {
    name: 'Northwind Health',
    initials: 'NH',
    card: 'Mastercard ending 5510',
    vatRate: 0,
  },
  tidewater: {
    name: 'Tidewater Energy',
    initials: 'TE',
    card: 'Mastercard ending 7718',
    vatRate: 0.2,
  },
};

export type ItemId =
  'camera' | 'display' | 'hub' | 'licence' | 'onboarding' | 'sensor' | 'support' | 'training';

/** What Lumen Studio sells. Prices in cents; hardware ships, services and licences do not. */
export const ITEMS: Record<ItemId, { name: string; price: number; ships: boolean }> = {
  camera: { name: 'Lumen Cam 4K', price: 34900, ships: true },
  display: { name: 'Lumen Display 27', price: 89900, ships: true },
  hub: { name: 'Lumen Hub', price: 64900, ships: true },
  licence: { name: 'Lumen Suite licence, 1 year', price: 28800, ships: false },
  onboarding: { name: 'Onboarding package, Team', price: 240000, ships: false },
  sensor: { name: 'Room sensor, pack of 5', price: 19500, ships: true },
  support: { name: 'Priority support, 1 year', price: 180000, ships: false },
  training: { name: 'Admin training, half day', price: 90000, ships: false },
};

/** One parcel rate, charged once on any order with hardware in it. */
const SHIPPING = 3800;

export type Status =
  | 'cancelled'
  | 'delivered'
  | 'partially-refunded'
  | 'payment-failed'
  | 'processing'
  | 'refunded'
  | 'shipped';

/**
 * The status carries its meaning in colour: Processing is under way (info); Shipped and Delivered
 * mean the order went out as it should (positive); a failed payment needs someone (negative).
 * Refunded and Cancelled are how an order ended, with the money already where it belongs, so
 * there is nothing to signal and they stay neutral.
 */
export const STATUS: Record<
  Status,
  { label: string; color: 'info' | 'negative' | 'neutral' | 'positive' }
> = {
  processing: { label: 'Processing', color: 'info' },
  shipped: { label: 'Shipped', color: 'positive' },
  delivered: { label: 'Delivered', color: 'positive' },
  'partially-refunded': { label: 'Partially refunded', color: 'neutral' },
  refunded: { label: 'Refunded', color: 'neutral' },
  cancelled: { label: 'Cancelled', color: 'neutral' },
  'payment-failed': { label: 'Payment failed', color: 'negative' },
};

export const statusOptions = Object.entries(STATUS).map(([value, { label }]) => ({ value, label }));

export type Order = {
  /** The order number, shown as "#6178". */
  id: string;
  /** The calendar day it was placed. */
  placed: string;
  customer: CustomerId;
  status: Status;
  /** What was bought: an item and how many. */
  lines: [item: ItemId, quantity: number][];
  /** What went back to the customer so far, in cents. */
  refunded: number;
};

const order = (
  id: string,
  placed: string,
  customer: CustomerId,
  status: Status,
  ...lines: Order['lines']
): Order => ({ id, placed, customer, status, lines, refunded: 0 });

/** What the order comes to: its lines, the parcel if there is one, and the customer's VAT. */
export function totalOf({ customer, lines }: Pick<Order, 'customer' | 'lines'>) {
  const subtotal = lines.reduce((sum, [item, quantity]) => sum + ITEMS[item].price * quantity, 0);
  const shipping = lines.some(([item]) => ITEMS[item].ships) ? SHIPPING : 0;
  return Math.round((subtotal + shipping) * (1 + CUSTOMERS[customer].vatRate));
}

/** What the customer's card was charged: nothing when the payment failed or never ran. */
export const paidFor = (o: Order) =>
  o.status === 'payment-failed' || o.status === 'cancelled' ? 0 : totalOf(o);

/** What can still go back to the customer. */
export const refundableFor = (o: Order) => paidFor(o) - o.refunded;

const refunded = (o: Order, amount = totalOf(o)): Order => ({ ...o, refunded: amount });

/** Newest first. */
export const ORDERS: Order[] = [
  order('6187', '2026-11-10', 'atlas', 'processing', ['licence', 12]),
  order('6186', '2026-11-10', 'northwind', 'payment-failed', ['display', 3], ['hub', 3]),
  order('6185', '2026-11-10', 'halcyon', 'processing', ['sensor', 4], ['hub', 1]),
  order('6184', '2026-11-09', 'cobalt', 'processing', ['support', 1], ['licence', 25]),
  order(
    '6183',
    '2026-11-09',
    'tidewater',
    'processing',
    ['hub', 6],
    ['camera', 6],
    ['training', 1],
  ),
  order('6182', '2026-11-09', 'kestrel', 'shipped', ['display', 2]),
  order('6181', '2026-11-06', 'juniper', 'shipped', ['hub', 1], ['camera', 1]),
  order('6180', '2026-11-06', 'halcyon', 'delivered', ['licence', 40]),
  order('6179', '2026-11-06', 'atlas', 'shipped', ['sensor', 10], ['hub', 4], ['display', 4]),
  order('6178', '2026-11-05', 'marlow', 'shipped', ['hub', 2], ['camera', 2], ['onboarding', 1]),
  order('6177', '2026-11-05', 'cobalt', 'cancelled', ['training', 2]),
  order('6176', '2026-11-04', 'kestrel', 'delivered', ['onboarding', 1], ['training', 1]),
  order('6175', '2026-11-04', 'tidewater', 'delivered', ['licence', 60], ['support', 1]),
  refunded(order('6174', '2026-11-03', 'halcyon', 'refunded', ['display', 1])),
  order('6173', '2026-11-03', 'juniper', 'delivered', ['licence', 18]),
  order('6172', '2026-11-02', 'northwind', 'delivered', ['camera', 4], ['sensor', 2]),
  order('6171', '2026-10-30', 'atlas', 'delivered', ['training', 1]),
  refunded(
    order('6170', '2026-10-30', 'cobalt', 'partially-refunded', ['hub', 5], ['camera', 5]),
    34900,
  ),
  order('6169', '2026-10-29', 'marlow', 'delivered', ['licence', 24]),
  order('6168', '2026-10-28', 'kestrel', 'delivered', ['hub', 2], ['sensor', 2]),
  order('6167', '2026-10-28', 'halcyon', 'delivered', ['support', 1]),
  order('6166', '2026-10-27', 'tidewater', 'cancelled', ['display', 8], ['hub', 8]),
  order('6165', '2026-10-26', 'northwind', 'delivered', ['onboarding', 1], ['licence', 30]),
  order('6164', '2026-10-23', 'juniper', 'delivered', ['display', 1], ['camera', 1]),
  order('6163', '2026-10-22', 'atlas', 'delivered', ['hub', 3], ['camera', 3], ['sensor', 6]),
  order('6162', '2026-10-22', 'cobalt', 'delivered', ['licence', 15]),
  refunded(order('6161', '2026-10-21', 'kestrel', 'refunded', ['training', 1])),
  order('6160', '2026-10-20', 'halcyon', 'delivered', ['hub', 2], ['display', 2]),
  order('6159', '2026-10-19', 'marlow', 'delivered', ['training', 2]),
  order('6158', '2026-10-16', 'tidewater', 'delivered', ['sensor', 12]),
  order('6157', '2026-10-15', 'northwind', 'delivered', ['licence', 45], ['support', 1]),
  order('6156', '2026-10-15', 'atlas', 'delivered', ['display', 6]),
  order('6155', '2026-10-14', 'juniper', 'delivered', ['onboarding', 1]),
  order('6154', '2026-10-13', 'cobalt', 'delivered', ['camera', 2]),
  order('6153', '2026-10-13', 'kestrel', 'delivered', ['licence', 20]),
  order('6152', '2026-10-12', 'halcyon', 'delivered', ['sensor', 3], ['camera', 1]),
];

export type SortKey = 'placed' | 'total';
export type Sort = { key: SortKey; direction: 'asc' | 'desc' };

/** The sort as one value for the select: the column and its direction. */
export const sortOptions = [
  { value: 'placed-desc', label: 'Newest first' },
  { value: 'placed-asc', label: 'Oldest first' },
  { value: 'total-desc', label: 'Highest total' },
  { value: 'total-asc', label: 'Lowest total' },
];
