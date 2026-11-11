import {
  RiBarChartBoxLine,
  RiBuilding2Line,
  RiFileList3Line,
  RiFlagLine,
  RiHandCoinLine,
  RiHome5Line,
  RiRefreshLine,
  RiVipCrown2Line,
} from '@remixicon/react';

export type Plan = 'trial' | 'starter' | 'team' | 'business' | 'enterprise';
export type Health = 'healthy' | 'at-risk' | 'churned';
export type OwnerId = 'maya' | 'jonas' | 'priya' | 'tom' | 'elena';

export type Customer = {
  /** The customer's domain doubles as its id. */
  id: string;
  name: string;
  domain: string;
  plan: Plan;
  /** Monthly recurring revenue in USD; 0 while on trial or after churning. */
  mrr: number;
  health: Health;
  owner: OwnerId;
  /** ISO date and time of the last email, call or product event. */
  lastActivity: string;
};

/** The moment the sample data is seen from, so relative dates stay put. */
export const NOW = new Date('2026-11-10T16:00');

export const workspace = { name: 'Lumen Studio', seats: 14 };

export const OWNERS: Record<OwnerId, { name: string; initials: string }> = {
  maya: { name: 'Maya Chen', initials: 'MC' },
  jonas: { name: 'Jonas Weber', initials: 'JW' },
  priya: { name: 'Priya Raman', initials: 'PR' },
  tom: { name: 'Tom Okafor', initials: 'TO' },
  elena: { name: 'Elena Silva', initials: 'ES' },
};

/** The signed-in person. */
export const account = { id: 'maya' as const, ...OWNERS.maya, email: 'maya@lumenstudio.co' };

export const navigation = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'customers', label: 'Customers', icon: RiBuilding2Line },
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
  { id: 'invoices', label: 'Invoices', icon: RiFileList3Line },
  { id: 'reports', label: 'Reports', icon: RiBarChartBoxLine },
];

export const savedLists = [
  { id: 'renewals', label: 'Renewals this quarter', icon: RiRefreshLine },
  { id: 'enterprise', label: 'Enterprise accounts', icon: RiVipCrown2Line },
  { id: 'onboarding', label: 'Onboarding', icon: RiFlagLine },
];

export const PLAN_LABEL: Record<Plan, string> = {
  trial: 'Trial',
  starter: 'Starter',
  team: 'Team',
  business: 'Business',
  enterprise: 'Enterprise',
};

/** Health is a judgement of the account, so each state takes its semantic colour. */
export const HEALTH: Record<Health, { label: string; color: 'positive' | 'notice' | 'negative' }> =
  {
    healthy: { label: 'Healthy', color: 'positive' },
    'at-risk': { label: 'At risk', color: 'notice' },
    churned: { label: 'Churned', color: 'negative' },
  };

/** A tab: a saved segment of the list. At risk overlaps Active and Trial. */
export type Segment = { value: string; label: string; match: (customer: Customer) => boolean };

export const SEGMENTS: Segment[] = [
  { value: 'all', label: 'All', match: () => true },
  { value: 'active', label: 'Active', match: (c) => c.plan !== 'trial' && c.health !== 'churned' },
  { value: 'trial', label: 'Trial', match: (c) => c.plan === 'trial' },
  { value: 'at-risk', label: 'At risk', match: (c) => c.health === 'at-risk' },
  { value: 'churned', label: 'Churned', match: (c) => c.health === 'churned' },
];

export const planOptions = Object.entries(PLAN_LABEL).map(([value, label]) => ({ value, label }));
export const ownerOptions = Object.entries(OWNERS).map(([value, o]) => ({ value, label: o.name }));
export const healthOptions = Object.entries(HEALTH).map(([value, h]) => ({
  value,
  label: h.label,
}));

export type SortKey = 'lastActivity' | 'mrr' | 'name';
export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'lastActivity', label: 'Sort by last activity' },
  { value: 'mrr', label: 'Sort by MRR' },
  { value: 'name', label: 'Sort by name' },
];

const customer = (
  name: string,
  domain: string,
  plan: Plan,
  mrr: number,
  health: Health,
  owner: OwnerId,
  lastActivity: string,
): Customer => ({ id: domain, name, domain, plan, mrr, health, owner, lastActivity });

// One customer per line: name, domain, plan, MRR, health, owner, last activity.
// prettier-ignore
export const CUSTOMERS: Customer[] = [
  customer('Halcyon Freight', 'halcyonfreight.com', 'enterprise', 18500, 'healthy', 'jonas', '2026-11-10T15:42'),
  customer('Northwind Health', 'northwindhealth.com', 'business', 2400, 'healthy', 'maya', '2026-11-10T13:05'),
  customer('Brightline Dental', 'brightlinedental.com', 'team', 690, 'at-risk', 'priya', '2026-10-14T10:20'),
  customer('Kestrel Analytics', 'kestrel.io', 'business', 3600, 'healthy', 'tom', '2026-11-10T11:30'),
  customer('Marlow & Finch', 'marlowfinch.com', 'team', 490, 'healthy', 'elena', '2026-11-09T17:10'),
  customer('Copperleaf Foods', 'copperleaf.co', 'starter', 99, 'healthy', 'maya', '2026-11-08T09:45'),
  customer('Juniper Legal', 'juniperlegal.com', 'business', 1650, 'healthy', 'priya', '2026-11-10T09:12'),
  customer('Atlas Robotics', 'atlasrobotics.io', 'trial', 0, 'healthy', 'tom', '2026-11-10T14:55'),
  customer('Fernhill Schools', 'fernhillschools.org', 'team', 890, 'healthy', 'elena', '2026-11-06T16:30'),
  customer('Quarry Coffee Co.', 'quarrycoffee.com', 'starter', 0, 'churned', 'maya', '2026-09-22T12:00'),
  customer('Sable Insurance', 'sableinsurance.com', 'enterprise', 9600, 'at-risk', 'jonas', '2026-11-10T10:05'),
  customer('Tidewater Energy', 'tidewater.energy', 'enterprise', 12800, 'healthy', 'jonas', '2026-11-07T10:15'),
  customer('Orchard Pediatrics', 'orchardpeds.com', 'team', 290, 'healthy', 'priya', '2026-11-05T13:40'),
  customer('Lattice Bio', 'latticebio.com', 'trial', 0, 'healthy', 'tom', '2026-11-08T11:20'),
  customer('Pinecrest Realty', 'pinecrestrealty.com', 'starter', 149, 'healthy', 'elena', '2026-11-03T08:50'),
  customer('Bluebird Logistics', 'bluebirdlogistics.com', 'business', 2900, 'healthy', 'maya', '2026-11-04T15:25'),
  customer('Vantage Fitness', 'vantagefit.co', 'team', 0, 'churned', 'priya', '2026-08-30T10:00'),
  customer('Harbor & Vine', 'harborandvine.com', 'starter', 99, 'healthy', 'tom', '2026-11-02T18:05'),
  customer('Meridian Travel', 'meridiantravel.com', 'business', 1200, 'at-risk', 'elena', '2026-10-09T09:30'),
  customer('Cobalt Security', 'cobaltsec.io', 'enterprise', 8200, 'healthy', 'jonas', '2026-11-10T08:40'),
  customer('Saltmarsh Studios', 'saltmarsh.studio', 'team', 690, 'healthy', 'maya', '2026-10-31T14:10'),
  customer('Evergreen Credit Union', 'evergreencu.org', 'enterprise', 6500, 'healthy', 'jonas', '2026-11-06T11:00'),
  customer('Foxglove Florals', 'foxglove.shop', 'starter', 49, 'healthy', 'elena', '2026-10-29T10:35'),
  customer('Granite Peak Outfitters', 'granitepeak.com', 'team', 890, 'healthy', 'tom', '2026-11-09T09:05'),
  customer('Wren Architecture', 'wrenarchitecture.com', 'trial', 0, 'at-risk', 'priya', '2026-10-26T15:50'),
  customer('Basalt Capital', 'basaltcapital.com', 'business', 2400, 'healthy', 'jonas', '2026-11-08T16:20'),
  customer('Clearwater Labs', 'clearwaterlabs.io', 'trial', 0, 'healthy', 'tom', '2026-11-08T10:30'),
  customer('Larkspur Hotels', 'larkspurhotels.com', 'business', 0, 'churned', 'elena', '2026-09-12T11:15'),
  customer('Ironwood Manufacturing', 'ironwoodmfg.com', 'enterprise', 9600, 'healthy', 'jonas', '2026-11-03T14:45'),
  customer('Polaris Learning', 'polarislearning.org', 'team', 290, 'healthy', 'priya', '2026-11-01T12:30'),
  customer('Redfern Media', 'redfern.media', 'team', 490, 'at-risk', 'maya', '2026-11-09T14:30'),
  customer('Silverline Payroll', 'silverlinepayroll.com', 'business', 2900, 'healthy', 'tom', '2026-11-07T13:15'),
  customer('Thistle & Co.', 'thistleandco.com', 'starter', 149, 'healthy', 'elena', '2026-10-28T09:20'),
  customer('Upland Farms', 'uplandfarms.com', 'starter', 0, 'churned', 'priya', '2026-08-18T14:40'),
  customer('Waypoint Mobility', 'waypoint.app', 'trial', 0, 'healthy', 'maya', '2026-11-09T15:35'),
  customer('Alder Health Partners', 'alderhealth.com', 'business', 3600, 'healthy', 'priya', '2026-11-05T10:05'),
  customer('Beacon Hill Advisors', 'beaconhilladvisors.com', 'team', 890, 'healthy', 'jonas', '2026-11-04T11:45'),
  customer('Cinder Games', 'cindergames.io', 'team', 0, 'churned', 'tom', '2026-09-04T16:00'),
  customer('Driftwood Surf', 'driftwoodsurf.com', 'starter', 49, 'healthy', 'elena', '2026-10-24T13:25'),
  customer('Elmstead Clinics', 'elmsteadclinics.com', 'business', 1200, 'healthy', 'maya', '2026-11-02T09:55'),
  customer('Fieldnote Research', 'fieldnoteresearch.com', 'trial', 0, 'healthy', 'priya', '2026-11-08T14:10'),
  customer('Glasshouse Agency', 'glasshouse.agency', 'team', 490, 'healthy', 'tom', '2026-10-30T16:45'),
  customer('Hollis Bakery', 'hollisbakery.com', 'starter', 49, 'at-risk', 'elena', '2026-10-02T08:30'),
  customer('Indigo Telecom', 'indigotel.com', 'enterprise', 0, 'churned', 'jonas', '2026-09-29T10:10'),
  customer('Keystone Builders', 'keystonebuilders.com', 'team', 290, 'healthy', 'maya', '2026-10-27T11:35'),
  customer('Lumio Solar', 'lumiosolar.com', 'business', 2400, 'healthy', 'tom', '2026-11-06T15:05'),
  customer('Monarch Pet Care', 'monarchpetcare.com', 'starter', 149, 'healthy', 'priya', '2026-10-23T12:50'),
  customer('Nimbus Cloudworks', 'nimbuscloud.io', 'trial', 0, 'healthy', 'jonas', '2026-11-07T12:20'),
];
