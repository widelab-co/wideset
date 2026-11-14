import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Fill,
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
import type { AvatarColor } from '@wideset/react';

/*
  Lumen Studio's customers in Orbit, the first ten by last activity: who owns each account, how
  healthy it is, its tags and what it pays a month. The menu opens on Kestrel Analytics, as if it
  had just been right-clicked. Today is 10 November 2026.
*/

/** The product is Orbit; the workspace is Lumen Studio. */
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
  {
    id: 'customers',
    label: 'Customers',
    icon: RiContactsBook3Line,
    activeIcon: RiContactsBook3Fill,
  },
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
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

/** The moment the sample data is seen from, so relative dates stay put. */
export const NOW = new Date('2026-11-10T16:00');

/** Where a customer's page lives, for Copy link and Open in new tab. */
export const customerUrl = (id: string) => `https://app.orbit.so/lumen-studio/customers/${id}`;

export type PersonId = 'maya' | 'jonas' | 'priya' | 'tom' | 'elena' | 'daniel' | 'leo' | 'nina';
export type Person = { name: string; initials: string; color?: AvatarColor };

/** Everyone who can own an account, the signed-in person first. */
export const PEOPLE: Record<PersonId, Person> = {
  maya: { name: account.name, initials: account.initials, color: 'orange' },
  jonas: { name: 'Jonas Weber', initials: 'JW' },
  priya: { name: 'Priya Raman', initials: 'PR' },
  tom: { name: 'Tom Becker', initials: 'TB' },
  elena: { name: 'Elena Silva', initials: 'ES' },
  daniel: { name: 'Daniel Reyes', initials: 'DR' },
  leo: { name: 'Leo Marchetti', initials: 'LM' },
  nina: { name: 'Nina Alvarez', initials: 'NA' },
};

export type TagId = 'key-account' | 'renewal' | 'expansion' | 'follow-up';

/** The workspace's tags, in the order the menu lists them. */
export const TAGS: { id: TagId; label: string }[] = [
  { id: 'key-account', label: 'Key account' },
  { id: 'renewal', label: 'Renewal' },
  { id: 'expansion', label: 'Expansion' },
  { id: 'follow-up', label: 'Needs follow-up' },
];

export type Health = 'healthy' | 'at-risk';

/** Health is a judgement of the account, so each state takes its semantic colour. */
export const HEALTH: Record<Health, { label: string; color: 'positive' | 'notice' }> = {
  healthy: { label: 'Healthy', color: 'positive' },
  'at-risk': { label: 'At risk', color: 'notice' },
};

export type Customer = {
  /** The domain, for the customers on file; a duplicate gets an id of its own. */
  id: string;
  name: string;
  domain: string;
  owner: PersonId;
  health: Health;
  tags: TagId[];
  /** Monthly recurring revenue in USD. */
  mrr: number;
  /** ISO date and time of the last email, call or product event. */
  lastActivity: string;
};

const customer = (
  name: string,
  id: string,
  owner: PersonId,
  health: Health,
  tags: TagId[],
  mrr: number,
  lastActivity: string,
): Customer => ({ id, name, domain: id, owner, health, tags, mrr, lastActivity });

// One customer per line: name, domain, owner, health, tags, MRR, last activity.
// prettier-ignore
export const CUSTOMERS: Customer[] = [
  customer('Halcyon Freight', 'halcyonfreight.com', 'jonas', 'healthy', ['key-account'], 18500, '2026-11-10T15:42'),
  customer('Northwind Health', 'northwindhealth.com', 'maya', 'healthy', ['renewal'], 2400, '2026-11-10T13:05'),
  customer('Kestrel Analytics', 'kestrel.io', 'tom', 'healthy', ['expansion'], 3600, '2026-11-10T11:30'),
  customer('Cobalt Security', 'cobaltsec.io', 'daniel', 'healthy', ['key-account'], 8200, '2026-11-10T08:40'),
  customer('Atlas Robotics', 'atlasrobotics.io', 'priya', 'at-risk', [], 1200, '2026-11-09T14:55'),
  customer('Juniper Legal', 'juniperlegal.com', 'elena', 'healthy', [], 1650, '2026-11-09T09:12'),
  customer('Tidewater Energy', 'tidewater.energy', 'jonas', 'healthy', ['key-account', 'expansion'], 12800, '2026-11-07T10:15'),
  customer('Sable Insurance', 'sableinsurance.com', 'nina', 'at-risk', ['renewal'], 9600, '2026-11-06T10:05'),
  customer('Fernhill Schools', 'fernhillschools.org', 'daniel', 'healthy', [], 890, '2026-11-04T16:30'),
  customer('Marlow & Finch', 'marlowfinch.com', 'leo', 'at-risk', ['follow-up'], 490, '2026-10-28T17:10'),
];

/** The row the menu is open on when the screen loads. */
export const OPEN_ON = 'kestrel.io';
