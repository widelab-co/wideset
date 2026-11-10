/** The product is Orbit; the workspace choosing a plan is Lumen Studio. */
export const WORKSPACE = { name: 'Lumen Studio' };

export type Interval = 'monthly' | 'yearly';
export type PlanId = 'starter' | 'growth' | 'scale';

export type Plan = {
  id: PlanId;
  name: string;
  /** One line: who the plan is for. */
  audience: string;
  /** Price per seat per month, by how often it is billed. */
  seatPrice: Record<Interval, number>;
  /** The most contacts the plan holds; a workspace with more cannot move to it. */
  contacts: number;
  /** The few limits that tell the plans apart, in the same order on every plan. */
  limits: string[];
};

export const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    audience: 'For small teams tracking their first customers.',
    seatPrice: { monthly: 19, yearly: 15 },
    contacts: 10_000,
    limits: ['10,000 contacts', '1 deal pipeline', '5 workflows', 'Email support'],
  },
  {
    id: 'growth',
    name: 'Growth',
    audience: 'For teams that sell and renew every week.',
    seatPrice: { monthly: 39, yearly: 32 },
    contacts: 50_000,
    limits: ['50,000 contacts', '5 deal pipelines', '50 workflows', 'Live chat support'],
  },
  {
    id: 'scale',
    name: 'Scale',
    audience: 'For revenue teams working across regions.',
    seatPrice: { monthly: 69, yearly: 57 },
    contacts: 250_000,
    limits: [
      '250,000 contacts',
      'Unlimited pipelines',
      'Unlimited workflows',
      'A dedicated success manager',
    ],
  },
];

/** What Lumen Studio pays for today, and what it uses. */
export const SUBSCRIPTION = {
  planId: 'growth' as PlanId,
  interval: 'monthly' as Interval,
  seats: 40,
  contacts: 41_280,
};

/** The plan the page suggests: the one the workspace is growing into. */
export const RECOMMENDED: PlanId = 'scale';

/** A cell in the comparison: included, not included, or a limit. */
export type FeatureValue = boolean | number | string;

export type FeatureGroup = {
  title: string;
  features: { name: string; values: Record<PlanId, FeatureValue> }[];
};

const row = (name: string, starter: FeatureValue, growth: FeatureValue, scale: FeatureValue) => ({
  name,
  values: { starter, growth, scale },
});

export const FEATURES: FeatureGroup[] = [
  {
    title: 'Customers',
    features: [
      row('Contacts', 10_000, 50_000, 250_000),
      row('Custom fields', 25, 100, 'Unlimited'),
      row('Company enrichment', false, true, true),
      row('Duplicate merging', 'Manual', 'Automatic', 'Automatic'),
    ],
  },
  {
    title: 'Revenue',
    features: [
      row('Deal pipelines', 1, 5, 'Unlimited'),
      row('MRR and churn reports', true, true, true),
      row('Forecasting', false, true, true),
      row('Multiple currencies', false, false, true),
    ],
  },
  {
    title: 'Automation',
    features: [
      row('Workflows', 5, 50, 'Unlimited'),
      row('Workflow runs a month', 1_000, 25_000, 250_000),
      row('API calls a month', 100_000, 1_000_000, 5_000_000),
      row('Sandbox workspace', false, false, true),
    ],
  },
  {
    title: 'Security',
    features: [
      row('Two-factor authentication', true, true, true),
      row('Roles and permissions', 'Preset', 'Custom', 'Custom'),
      row('Audit log', false, '90 days', '1 year'),
      row('SAML single sign-on', false, false, true),
    ],
  },
  {
    title: 'Support',
    features: [
      row('Help center and email', true, true, true),
      row('First response', '2 business days', '1 business day', '4 hours'),
      row('Live chat', false, true, true),
      row('Success manager', false, false, 'Dedicated'),
    ],
  },
];

/** What one billing period costs: the seat price times the seats, times 12 when billed yearly. */
export const periodPrice = (plan: Plan, interval: Interval, seats: number) =>
  plan.seatPrice[interval] * seats * (interval === 'yearly' ? 12 : 1);

/** The largest share yearly billing takes off a plan's monthly seat price. */
export const yearlySaving = Math.max(
  ...PLANS.map((plan) => 1 - plan.seatPrice.yearly / plan.seatPrice.monthly),
);
