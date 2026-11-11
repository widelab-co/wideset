import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiExchangeDollarFill,
  RiExchangeDollarLine,
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
  Maya pays Halcyon Freight its partner commission for the third quarter from Lumen Studio's
  balance in Orbit, on 10 November 2026. Money is whole cents everywhere in this block: every sum
  is an integer, so amount, fee and total add up exactly.
*/

/** The product is Orbit; the workspace paying is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

/** The day the screen shows: a Tuesday. */
export const today = '2026-11-10';

/** Where the links lead: replace with your routes. */
export const ROUTES = { transfers: '#payouts' };

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
    id: 'payouts',
    label: 'Payouts',
    icon: RiExchangeDollarLine,
    activeIcon: RiExchangeDollarFill,
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

/** What the workspace can send, in cents. */
export const balance = 48_210_75;

/** What a payment costs: a share of the amount, up to a ceiling. */
export const FEE = { rate: 0.005, max: 25_00 };

/** A payment above this is confirmed once more in a dialog; one at or under it goes straight out. */
export const CONFIRM_ABOVE = 10_000_00;

/** Bank days from the day a payment is sent to the day it arrives. */
export const ARRIVAL_DAYS = 2;

export type Recipient = {
  id: string;
  name: string;
  /** The account's last four digits. */ account: string;
};

/** Who has been paid before, by name. */
export const recipients: Recipient[] = [
  { id: 'atlas-robotics', name: 'Atlas Robotics', account: '6608' },
  { id: 'cobalt-security', name: 'Cobalt Security', account: '1175' },
  { id: 'halcyon-freight', name: 'Halcyon Freight', account: '4417' },
  { id: 'juniper-legal', name: 'Juniper Legal', account: '7392' },
  { id: 'kestrel-analytics', name: 'Kestrel Analytics', account: '2251' },
  { id: 'marlow-finch', name: 'Marlow & Finch', account: '5046' },
  { id: 'northwind-health', name: 'Northwind Health', account: '9034' },
  { id: 'tidewater-energy', name: 'Tidewater Energy', account: '3819' },
];

/** A recipient as one line: the name, then the masked account. */
export const recipientLabel = ({ name, account }: Recipient) => `${name} ··· ${account}`;

export const recipientById = (id: string) => recipients.find((recipient) => recipient.id === id);

export type TransferStatus = 'Scheduled' | 'Processing' | 'Completed';

export type Transfer = {
  /** The transfer's number, as the receipt shows it. */
  id: string;
  recipient: string;
  date: string;
  amount: number;
  status: TransferStatus;
};

/** The last payments sent, newest first. */
export const recentTransfers: Transfer[] = [
  {
    id: 'TRF-2026-0456',
    recipient: 'Northwind Health',
    date: '2026-11-06',
    amount: 1_820_00,
    status: 'Completed',
  },
  {
    id: 'TRF-2026-0455',
    recipient: 'Kestrel Analytics',
    date: '2026-11-03',
    amount: 960_00,
    status: 'Completed',
  },
  {
    id: 'TRF-2026-0454',
    recipient: 'Juniper Legal',
    date: '2026-10-28',
    amount: 2_400_00,
    status: 'Completed',
  },
  {
    id: 'TRF-2026-0453',
    recipient: 'Halcyon Freight',
    date: '2026-10-21',
    amount: 3_975_50,
    status: 'Completed',
  },
];

/** The number the next transfer gets. */
export const nextTransferId = 'TRF-2026-0457';
