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
  One order from the Orders list: #6178, placed by Marlow & Finch on Thursday 5 November 2026 to
  fit out two meeting rooms: two hubs, two cameras and the onboarding package. Lumen Studio Ltd
  and Marlow & Finch are both UK businesses, so the order carries 20% VAT. The hardware left the
  warehouse on Friday with Northline, crossed the weekend, and is on the van today, 10 November.
  Money is kept in whole cents and every total is worked out from the lines.
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

/** Who bought, and the person there who placed the order. */
export const customer = {
  id: 'marlow-finch',
  name: 'Marlow & Finch',
  initials: 'MF',
  /** The month they first bought. */
  since: '2025-03-01',
  contact: {
    name: 'Imogen Hartley',
    role: 'Office manager',
    email: 'imogen.hartley@marlowfinch.com',
    phone: '+44 117 496 0142',
  },
};

export const shippingAddress = [
  'Marlow & Finch',
  'Imogen Hartley',
  '14 Queen Square',
  'Bristol BS1 4NT',
  'United Kingdom',
];

export const billingAddress = [
  'Marlow & Finch LLP',
  'Accounts payable',
  '40 Carter Lane',
  'London EC4V 5EA',
  'United Kingdom',
  'VAT GB 284 6093 71',
];

/** What the customer asked of the courier at checkout. */
export const note =
  'Please use the loading bay on Mill Avenue, behind the building. Reception signs for parcels until 4 PM.';

export type OrderLine = {
  id: string;
  name: string;
  /** What the item is and its stock number, under its name. */
  detail: string;
  quantity: number;
  /** In cents. */
  unitPrice: number;
};

export const order = {
  /** As shown: "Order #6178". */
  number: '#6178',
  /** ISO date and time, UTC. */
  placed: '2026-11-05T09:42:00Z',
  lines: [
    {
      id: 'hub',
      name: 'Lumen Hub',
      detail: 'Meeting room console, LS-HUB-02',
      quantity: 2,
      unitPrice: 64900,
    },
    {
      id: 'camera',
      name: 'Lumen Cam 4K',
      detail: 'Conference camera, LS-CAM-4K',
      quantity: 2,
      unitPrice: 34900,
    },
    {
      id: 'onboarding',
      name: 'Onboarding package, Team',
      detail: 'Remote setup and two training sessions, SV-ONB-TM',
      quantity: 1,
      unitPrice: 240000,
    },
  ] satisfies OrderLine[],
  /** The hardware travels; the onboarding does not. */
  shipping: {
    service: 'Northline Standard',
    price: 3800,
    trackingNumber: '3409-4934-6178',
    /** The day and the hour the courier promises. */
    expected: { day: '2026-11-10', by: '2:00 PM' },
  },
  vatRate: 0.2,
  card: 'Visa ending 6411',
  paidOn: '2026-11-05',
};

export const lineAmount = (line: OrderLine) => line.quantity * line.unitPrice;
export const subtotal = order.lines.reduce((sum, line) => sum + lineAmount(line), 0);
/** VAT is charged on the goods and on getting them there. */
export const vatAmount = Math.round((subtotal + order.shipping.price) * order.vatRate);
export const total = subtotal + order.shipping.price + vatAmount;

export type TrackingKind = 'confirmed' | 'depot' | 'out-for-delivery' | 'shipped';

export type TrackingEvent = {
  id: string;
  kind: TrackingKind;
  title: string;
  /** ISO date and time, UTC. */
  at: string;
  /** Where it happened, or what it meant. */
  text: string;
};

/** The order's way to the door, newest first: the first event is where the parcels are now. */
export const tracking: TrackingEvent[] = [
  {
    id: 'out-for-delivery',
    kind: 'out-for-delivery',
    title: 'Out for delivery',
    at: '2026-11-10T07:48:00Z',
    text: 'On the van from the Avonmouth depot.',
  },
  {
    id: 'depot',
    kind: 'depot',
    title: 'Arrived at the delivery depot',
    at: '2026-11-09T21:15:00Z',
    text: 'Northline depot, Avonmouth, Bristol.',
  },
  {
    id: 'shipped',
    kind: 'shipped',
    title: 'Product shipped',
    at: '2026-11-06T16:05:00Z',
    text: 'Two parcels handed over to Northline in London.',
  },
  {
    id: 'confirmed',
    kind: 'confirmed',
    title: 'Order confirmed',
    at: '2026-11-05T09:44:00Z',
    text: `Payment processed with the ${order.card}.`,
  },
];
