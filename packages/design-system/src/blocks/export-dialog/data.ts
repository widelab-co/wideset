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
  Lumen Studio's customers in Orbit: 1,496 companies, 48 of them Enterprise. The list is filtered
  to Enterprise and three rows are selected, so the export dialog can offer all three scopes. The
  customers are generated below from two word lists, so every count the dialog names is the length
  of a real list. Today is 10 November 2026.
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

/** Today in the sample, as a date the calendar reads (yyyy-MM-dd). */
export const TODAY = '2026-11-10';

export type PersonId = 'maya' | 'jonas' | 'priya' | 'tom' | 'elena' | 'daniel' | 'leo' | 'nina';
export type Person = { name: string; initials: string; color?: AvatarColor };

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
const OWNERS = Object.keys(PEOPLE) as PersonId[];

export type Segment = 'enterprise' | 'mid-market' | 'small-business';
export const SEGMENT_LABEL: Record<Segment, string> = {
  enterprise: 'Enterprise',
  'mid-market': 'Mid-market',
  'small-business': 'Small business',
};

export type Health = 'healthy' | 'at-risk';
/** Health is a judgement of the account, so each state takes its semantic colour. */
export const HEALTH: Record<Health, { label: string; color: 'positive' | 'notice' }> = {
  healthy: { label: 'Healthy', color: 'positive' },
  'at-risk': { label: 'At risk', color: 'notice' },
};

export type Customer = {
  id: string;
  name: string;
  domain: string;
  segment: Segment;
  owner: PersonId;
  health: Health;
  /** Annual recurring revenue in USD. */
  arr: number;
  /** The day it was added to Orbit (yyyy-MM-dd). */
  added: string;
};

export const TOTAL = 1496;
const ENTERPRISE = 48;
const MID_MARKET = 310;

// prettier-ignore
const FIRST = ['Halcyon', 'Northwind', 'Kestrel', 'Atlas', 'Cobalt', 'Juniper', 'Tidewater', 'Marlow', 'Alder', 'Basalt', 'Beacon', 'Bluebird', 'Brightline', 'Cinder', 'Clearwater', 'Copperleaf', 'Driftwood', 'Elmstead', 'Evergreen', 'Fernhill', 'Foxglove', 'Glasshouse', 'Granite', 'Harbor', 'Indigo', 'Ironwood', 'Keystone', 'Larkspur', 'Lattice', 'Lumio', 'Meridian', 'Monarch', 'Nimbus', 'Orchard', 'Pinecrest', 'Polaris', 'Quarry', 'Redfern', 'Saltmarsh', 'Silverline', 'Thistle', 'Upland', 'Vantage', 'Waypoint', 'Wren', 'Sable'];
// prettier-ignore
const SECOND = ['Freight', 'Health', 'Analytics', 'Robotics', 'Security', 'Legal', 'Energy', 'Labs', 'Logistics', 'Capital', 'Clinics', 'Foods', 'Media', 'Systems', 'Studios', 'Partners', 'Insurance', 'Software', 'Mobility', 'Hotels', 'Farms', 'Learning', 'Payroll', 'Realty', 'Advisors', 'Builders', 'Telecom', 'Outfitters', 'Research', 'Games', 'Manufacturing', 'Travel', 'Dental'];
/** The largest accounts, which the list opens on. */
const TOP_ARR = [486000, 412000, 365000, 331000, 298000, 276000, 251000, 224000];

const DAY = 24 * 60 * 60 * 1000;
const FIRST_DAY = Date.parse('2021-02-01');
const SPAN_DAYS = (Date.parse(TODAY) - FIRST_DAY) / DAY;

/** A number from 0 to `range`, the same for the same `n` and `salt` on every run. */
const pick = (n: number, salt: number, range: number) => ((n + 1) * 7919 + salt * 104729) % range;

const make = (n: number): Customer => {
  // Each first word meets each second word at most once, so the names stay unique.
  const first = n % FIRST.length;
  const second = (first + Math.floor(n / FIRST.length)) % SECOND.length;
  const name = n === 7 ? 'Marlow & Finch' : `${FIRST[first]} ${SECOND[second]}`;
  const segment: Segment =
    n < ENTERPRISE ? 'enterprise' : n < ENTERPRISE + MID_MARKET ? 'mid-market' : 'small-business';
  const arr =
    TOP_ARR[n] ??
    {
      enterprise: 60000 + pick(n, 1, 150) * 1000,
      'mid-market': 18000 + pick(n, 1, 40) * 1000,
      'small-business': 1200 + pick(n, 1, 90) * 100,
    }[segment];
  // Added on days spread over the years, in no order of the list.
  const added = new Date(FIRST_DAY + Math.floor(((n * 7919) % TOTAL) * (SPAN_DAYS / TOTAL)) * DAY);
  return {
    id: `c${n}`,
    name,
    domain: `${name.toLowerCase().replace(/[^a-z]+/g, '')}.com`,
    segment,
    owner: OWNERS[pick(n, 2, OWNERS.length)],
    health: pick(n, 3, 7) === 0 ? 'at-risk' : 'healthy',
    arr,
    added: added.toISOString().slice(0, 10),
  };
};

export const CUSTOMERS: Customer[] = Array.from({ length: TOTAL }, (_, n) => make(n));

/** Selected when the screen loads, on the first page of the Enterprise list. */
export const START_SELECTION = ['c2', 'c4', 'c5'];

/** The columns a file can hold, in its order. The name is always in it. */
export const COLUMNS = [
  { id: 'name', label: 'Name', value: (c: Customer) => c.name },
  { id: 'domain', label: 'Domain', value: (c: Customer) => c.domain },
  { id: 'segment', label: 'Segment', value: (c: Customer) => SEGMENT_LABEL[c.segment] },
  { id: 'owner', label: 'Owner', value: (c: Customer) => PEOPLE[c.owner].name },
  { id: 'health', label: 'Health', value: (c: Customer) => HEALTH[c.health].label },
  { id: 'arr', label: 'ARR (USD)', value: (c: Customer) => c.arr },
  { id: 'added', label: 'Added', value: (c: Customer) => c.added },
] as const;
export type ColumnId = (typeof COLUMNS)[number]['id'];

export const segmentOptions = Object.entries(SEGMENT_LABEL).map(([value, label]) => ({
  value,
  label,
}));
export const ownerOptions = OWNERS.map((id) => ({ value: id, label: PEOPLE[id].name }));
export const healthOptions = Object.entries(HEALTH).map(([value, health]) => ({
  value,
  label: health.label,
}));
