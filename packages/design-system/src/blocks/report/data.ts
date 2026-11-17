import {
  type RemixiconComponentType,
  RiBarChartBoxLine,
  RiBriefcase4Line,
  RiFileChart2Line,
  RiHome5Line,
  RiInbox2Line,
  RiLineChartLine,
  RiPieChart2Line,
  RiUserLine,
} from '@remixicon/react';

export const WORKSPACE = { name: 'Lumen Studio' };
export const ACCOUNT = {
  name: 'Nina Alvarez',
  initials: 'NA',
  email: 'nina@lumen.studio',
  role: 'Account executive',
};

export const NAVIGATION: {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  count?: number;
}[] = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'inbox', label: 'Inbox', icon: RiInbox2Line, count: 4 },
  { id: 'customers', label: 'Customers', icon: RiUserLine },
  { id: 'deals', label: 'Deals', icon: RiBriefcase4Line },
  { id: 'analytics', label: 'Analytics', icon: RiBarChartBoxLine },
];

export const REPORTS: { id: string; label: string; icon: RemixiconComponentType }[] = [
  { id: 'revenue', label: 'Revenue', icon: RiLineChartLine },
  { id: 'retention', label: 'Retention', icon: RiPieChart2Line },
  { id: 'pipeline', label: 'Pipeline', icon: RiFileChart2Line },
];

export type PlanId = 'starter' | 'growth' | 'scale' | 'enterprise';
export type RegionId = 'na' | 'eu' | 'apac' | 'latam';
export type Compare = 'period' | 'year';

export const COMPARE_OPTIONS: { value: Compare; label: string }[] = [
  { value: 'period', label: 'Previous period' },
  { value: 'year', label: 'Previous year' },
];

/*
  The dataset: every MRR movement since Jan 1, 2023, one row per new customer, expansion and
  cancellation, each with its plan and region. Every figure on the screen is summed from these
  rows and the opening balances, so the KPIs, the charts and the table always add up.

  The rows are generated once and deterministically (a seeded random sequence), up to the real
  today: the date picker's presets ("This month", "Last year") count from today, so the data has
  to reach it. A real app fetches the same rows for the range on screen.
*/

const DAY = 86_400_000;
const START = Date.UTC(2023, 0, 1);
const now = new Date();
/** Today as a day number: days since Jan 1, 2023. */
export const TODAY = Math.round(
  (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - START) / DAY,
);
/** The first day a range may start: a year in, so a range always has a year before it. */
export const FIRST_DAY = 365;

/** A calendar day (`2026-11-10`) as a day number, and back. */
export const dayOf = (iso: string) => Math.round((Date.parse(iso) - START) / DAY);
export const isoOf = (day: number) => new Date(START + day * DAY).toISOString().slice(0, 10);

type PlanDef = {
  id: PlanId;
  label: string;
  /** Customers and their average MRR on Jan 1, 2023. */
  customers: number;
  arpa: number;
  /** A new customer's MRR, low to high, in whole dollars of `step`. */
  price: [number, number];
  step: number;
  newPerDay: number;
  /** Share of customers who cancel, and who expand, in a month. */
  churn: number;
  expansion: number;
};

const PLAN_DEFS: PlanDef[] = [
  {
    id: 'starter',
    label: 'Starter',
    customers: 720,
    arpa: 79,
    price: [49, 129],
    step: 10,
    newPerDay: 1.45,
    churn: 0.034,
    expansion: 0.015,
  },
  {
    id: 'growth',
    label: 'Growth',
    customers: 330,
    arpa: 410,
    price: [240, 640],
    step: 20,
    newPerDay: 0.52,
    churn: 0.017,
    expansion: 0.026,
  },
  {
    id: 'scale',
    label: 'Scale',
    customers: 58,
    arpa: 1_620,
    price: [1_100, 2_400],
    step: 50,
    newPerDay: 0.08,
    churn: 0.009,
    expansion: 0.036,
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    customers: 6,
    arpa: 6_100,
    price: [4_000, 9_000],
    step: 250,
    newPerDay: 0.008,
    churn: 0.004,
    expansion: 0.04,
  },
];

export const PLANS = PLAN_DEFS.map(({ id, label }) => ({ id, label }));

export const REGIONS: { id: RegionId; label: string; share: number }[] = [
  { id: 'na', label: 'North America', share: 0.46 },
  { id: 'eu', label: 'Europe', share: 0.31 },
  { id: 'apac', label: 'Asia Pacific', share: 0.15 },
  { id: 'latam', label: 'Latin America', share: 0.08 },
];

export type Kind = 'new' | 'expansion' | 'churn';
/** One MRR movement. `amount` is always positive; a churn takes it away. */
export type Movement = {
  day: number;
  plan: PlanId;
  region: RegionId;
  kind: Kind;
  amount: number;
};

type Cell = { plan: PlanId; region: RegionId; mrr: number; customers: number };

/** A repeatable sequence in [0, 1). */
const random = (() => {
  let seed = 20_230_101;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
})();
/** How many events happen in a day that averages `mean` of them. */
const poisson = (mean: number) => {
  const limit = Math.exp(-mean);
  let count = 0;
  for (let p = random(); p > limit; p *= random()) count++;
  return count;
};
// Sunday to Saturday: sign-ups and cancellations happen on working days.
const WEEKDAY = [0.35, 1.18, 1.22, 1.2, 1.16, 1.05, 0.4];

/** Every plan in every region on Jan 1, 2023. */
export const OPENING: Cell[] = PLAN_DEFS.flatMap((plan) =>
  REGIONS.map((region) => {
    const customers = Math.round(plan.customers * region.share);
    return { plan: plan.id, region: region.id, customers, mrr: customers * plan.arpa };
  }),
);

export const MOVEMENTS: Movement[] = (() => {
  const cells = OPENING.map((cell) => ({ ...cell }));
  const rows: Movement[] = [];
  for (let day = 0; day <= TODAY; day++) {
    const weekday = WEEKDAY[new Date(START + day * DAY).getUTCDay()];
    // Sign-ups grow slowly as the product does.
    const growth = 0.85 + day * 0.000_25;
    cells.forEach((cell, index) => {
      const plan = PLAN_DEFS[Math.floor(index / REGIONS.length)];
      const region = REGIONS[index % REGIONS.length];
      const add = (kind: Kind, amount: number) =>
        rows.push({ day, plan: cell.plan, region: cell.region, kind, amount });

      for (let n = poisson(plan.newPerDay * region.share * weekday * growth); n > 0; n--) {
        const steps = (plan.price[1] - plan.price[0]) / plan.step;
        const amount = plan.price[0] + Math.floor(random() * (steps + 1)) * plan.step;
        cell.mrr += amount;
        cell.customers += 1;
        add('new', amount);
      }
      const average = cell.customers ? cell.mrr / cell.customers : 0;
      for (let n = poisson((cell.customers * plan.expansion * weekday) / 30); n > 0; n--) {
        const amount = Math.round((average * (0.15 + random() * 0.35)) / 10) * 10;
        cell.mrr += amount;
        add('expansion', amount);
      }
      for (let n = poisson((cell.customers * plan.churn * weekday) / 30); n > 0; n--) {
        if (cell.customers <= 1) break;
        const amount = Math.min(Math.round(average * (0.6 + random() * 0.8)), cell.mrr);
        cell.mrr -= amount;
        cell.customers -= 1;
        add('churn', amount);
      }
    });
  }
  return rows;
})();

/** A span of whole days, both ends included, as day numbers. */
export type Range = { from: number; to: number };

const OPENING_MRR = OPENING.reduce((sum, cell) => sum + cell.mrr, 0);
const OPENING_CUSTOMERS = OPENING.reduce((sum, cell) => sum + cell.customers, 0);

/** MRR and customers at the close of every day, summed once from the movements. */
const CLOSE = (() => {
  const mrr = new Array<number>(TODAY + 1).fill(0);
  const customers = new Array<number>(TODAY + 1).fill(0);
  for (const row of MOVEMENTS) {
    mrr[row.day] += row.kind === 'churn' ? -row.amount : row.amount;
    customers[row.day] += row.kind === 'new' ? 1 : row.kind === 'churn' ? -1 : 0;
  }
  for (let day = 0; day <= TODAY; day++) {
    mrr[day] += day ? mrr[day - 1] : OPENING_MRR;
    customers[day] += day ? customers[day - 1] : OPENING_CUSTOMERS;
  }
  return { mrr, customers };
})();

const mrrAt = (day: number) => (day < 0 ? OPENING_MRR : CLOSE.mrr[day]);

/** The same calendar day a year earlier; Feb 29 falls back to Feb 28. */
const yearEarlier = (day: number) => {
  const iso = isoOf(day);
  return dayOf(
    `${Number(iso.slice(0, 4)) - 1}${iso.slice(4) === '-02-29' ? '-02-28' : iso.slice(4)}`,
  );
};

/** What a range is compared with: the same number of days just before it, or a year earlier. */
export function comparisonOf({ from, to }: Range, compare: Compare): Range {
  if (compare === 'year') return { from: yearEarlier(from), to: yearEarlier(to) };
  return { from: from - (to - from + 1), to: from - 1 };
}

export type Unit = 'day' | 'week' | 'month';
export type Bucket = { from: number; to: number; new: number; expansion: number; churn: number };

/** How finely the movements chart splits a range: by day up to a month, by week up to ~4 months. */
const unitOf = ({ from, to }: Range): Unit =>
  to - from < 31 ? 'day' : to - from < 120 ? 'week' : 'month';

/** The key a day falls under at a unit: itself, its week's Monday, or its month. */
const keyOf = (day: number, unit: Unit) => {
  if (unit === 'day') return String(day);
  if (unit === 'week') return String(day - ((new Date(START + day * DAY).getUTCDay() + 6) % 7));
  return isoOf(day).slice(0, 7);
};

/** Everything the page shows for one range, summed from the movements. */
function summarise(range: Range) {
  const { from, to } = range;
  const rows = MOVEMENTS.filter((row) => row.day >= from && row.day <= to);
  const total = (kind: Kind, list: Movement[] = rows) =>
    list.reduce((sum, row) => (row.kind === kind ? sum + row.amount : sum), 0);
  const signed = (row: Movement) => (row.kind === 'churn' ? -row.amount : row.amount);

  const unit = unitOf(range);
  const buckets: Bucket[] = [];
  for (let day = from; day <= to; day++) {
    const last = buckets[buckets.length - 1];
    if (last && keyOf(last.from, unit) === keyOf(day, unit)) last.to = day;
    else buckets.push({ from: day, to: day, new: 0, expansion: 0, churn: 0 });
  }
  for (const row of rows) {
    const bucket = buckets.find((entry) => row.day >= entry.from && row.day <= entry.to)!;
    bucket[row.kind] += row.amount;
  }

  // Each plan's and region's MRR at the close of the range: its opening plus everything since.
  const upTo = MOVEMENTS.filter((row) => row.day <= to);
  const closing = (match: (cell: { plan: PlanId; region: RegionId }) => boolean) =>
    OPENING.filter(match).reduce((sum, cell) => sum + cell.mrr, 0) +
    upTo.filter(match).reduce((sum, row) => sum + signed(row), 0);

  const movements = { new: total('new'), expansion: total('expansion'), churn: total('churn') };
  return {
    range,
    opening: mrrAt(from - 1),
    mrr: mrrAt(to),
    customers: CLOSE.customers[to],
    ...movements,
    net: movements.new + movements.expansion - movements.churn,
    /** MRR at the close of the day before the range, then of every day in it. */
    daily: Array.from({ length: to - from + 2 }, (_, index) => mrrAt(from - 1 + index)),
    unit,
    buckets,
    plans: PLANS.map((plan) => ({ ...plan, mrr: closing((cell) => cell.plan === plan.id) })),
    regions: REGIONS.map((region) => {
      const inRegion = rows.filter((row) => row.region === region.id);
      const regionMovements = {
        new: total('new', inRegion),
        expansion: total('expansion', inRegion),
        churn: total('churn', inRegion),
      };
      return {
        id: region.id,
        label: region.label,
        ...regionMovements,
        net: regionMovements.new + regionMovements.expansion - regionMovements.churn,
        mrr: closing((cell) => cell.region === region.id),
      };
    }),
  };
}

export type Summary = ReturnType<typeof summarise>;

/**
 * The report for a range and what it is compared with. Without data for the comparison (a long
 * custom range that reaches back before the first day), `previous` is `null`.
 */
export function revenueReport(range: Range, compare: Compare) {
  const comparison = comparisonOf(range, compare);
  return {
    current: summarise(range),
    previous: comparison.from >= 0 ? summarise(comparison) : null,
  };
}
