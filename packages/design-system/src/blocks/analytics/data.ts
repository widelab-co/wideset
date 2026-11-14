import {
  type RemixiconComponentType,
  RiBarChartBoxLine,
  RiBriefcase4Line,
  RiFileChart2Line,
  RiHome5Line,
  RiInbox2Line,
  RiLineChartLine,
  RiMoneyDollarCircleLine,
  RiPieChart2Line,
  RiTeamLine,
} from '@remixicon/react';

export const WORKSPACE = { name: 'Lumen Studio', plan: 'Growth plan', seats: 24 };
export const ACCOUNT = { name: 'Nina Alvarez', initials: 'NA', email: 'nina@lumen.studio' };

export const NAVIGATION: {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  count?: number;
}[] = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'inbox', label: 'Inbox', icon: RiInbox2Line, count: 4 },
  { id: 'customers', label: 'Customers', icon: RiTeamLine },
  { id: 'deals', label: 'Deals', icon: RiBriefcase4Line },
  { id: 'analytics', label: 'Analytics', icon: RiBarChartBoxLine },
  { id: 'revenue', label: 'Revenue', icon: RiMoneyDollarCircleLine },
];

export const DASHBOARDS: { id: string; label: string; icon: RemixiconComponentType }[] = [
  { id: 'marketing-site', label: 'Marketing site', icon: RiLineChartLine },
  { id: 'onboarding', label: 'Onboarding funnel', icon: RiPieChart2Line },
  { id: 'pricing-test', label: 'Pricing page test', icon: RiFileChart2Line },
];

export type Period = '7d' | '30d' | '90d';

export const PERIODS: { value: Period; label: string; days: number }[] = [
  { value: '7d', label: 'Last 7 days', days: 7 },
  { value: '30d', label: 'Last 30 days', days: 30 },
  { value: '90d', label: 'Last 90 days', days: 90 },
];

/*
  180 days of lumen.studio traffic up to today, enough for the longest period and the one before
  it. Every figure on the screen is summed from these days, so the numbers always add up. The
  series is generated once, deterministically: weekdays busier than weekends, slow growth, and the
  December newsletter on the 3rd and 4th.
*/
const TODAY = Date.UTC(2026, 11, 14);
const DAY = 86_400_000;
const WEEKDAY = [0.62, 1.08, 1.12, 1.1, 1.06, 0.94, 0.58];
const NEWSLETTER: Record<string, number> = { '2026-12-03': 1.9, '2026-12-04': 1.35 };
/** Repeatable noise in [-1, 1]. */
const noise = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43_758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

export type Day = { date: string; visitors: number; signups: number; bounces: number };

export const DAYS: Day[] = Array.from({ length: 180 }, (_, index) => {
  const time = TODAY - (179 - index) * DAY;
  const date = new Date(time).toISOString().slice(0, 10);
  const boost = NEWSLETTER[date] ?? 1;
  const visitors = Math.round(
    1_034 *
      (1 + index * 0.0024) *
      WEEKDAY[new Date(time).getUTCDay()] *
      (1 + noise(index) * 0.07) *
      boost,
  );
  // Newsletter readers sign up less and leave sooner than search traffic.
  const conversion = (0.0284 - index * 0.000_008 + noise(index + 500) * 0.0025) / Math.sqrt(boost);
  const bounce = 0.5 - index * 0.000_8 + noise(index + 900) * 0.02 + (boost - 1) * 0.1;
  return {
    date,
    visitors,
    signups: Math.round(visitors * conversion),
    bounces: Math.round(visitors * bounce),
  };
});

/** Each page's share of the period's visitors, and how people use it. */
export const PAGES = [
  { path: '/', share: 0.58, viewsPerVisitor: 1.38, bounceRate: 0.42, seconds: 48 },
  { path: '/pricing', share: 0.27, viewsPerVisitor: 1.52, bounceRate: 0.24, seconds: 104 },
  {
    path: '/product/scheduling',
    share: 0.19,
    viewsPerVisitor: 1.21,
    bounceRate: 0.31,
    seconds: 87,
  },
  {
    path: '/blog/reduce-no-shows',
    share: 0.14,
    viewsPerVisitor: 1.06,
    bounceRate: 0.68,
    seconds: 192,
  },
  { path: '/customers', share: 0.08, viewsPerVisitor: 1.17, bounceRate: 0.36, seconds: 71 },
  { path: '/changelog', share: 0.05, viewsPerVisitor: 1.44, bounceRate: 0.29, seconds: 63 },
];

/** Where visitors came from, as shares of the period's visitors; the rest is spread thin. */
export const SOURCES = [
  { name: 'Google', share: 0.41 },
  { name: 'Direct', share: 0.23 },
  { name: 'LinkedIn', share: 0.12 },
  { name: 'Newsletter', share: 0.09 },
  { name: 'ChatGPT', share: 0.06 },
  { name: 'G2', share: 0.04 },
];

export type Metric = {
  label: string;
  value: number;
  previous: number;
  /** A `rate` is a fraction; its change is told in percentage points. */
  kind: 'count' | 'rate';
  decimals?: number;
  /** The direction that is good news: bounce rate going down is. */
  better: 'up' | 'down';
};

const total = (days: Day[], key: Exclude<keyof Day, 'date'>) =>
  days.reduce((sum, day) => sum + day[key], 0);

/** Everything the screen shows for one period, summed from `DAYS`. */
export function report(period: Period) {
  const { days } = PERIODS.find((entry) => entry.value === period)!;
  const current = DAYS.slice(-days);
  const previous = DAYS.slice(-2 * days, -days);
  const visitors = total(current, 'visitors');
  const previousVisitors = total(previous, 'visitors');

  const metrics: Metric[] = [
    { label: 'Visitors', value: visitors, previous: previousVisitors, kind: 'count', better: 'up' },
    {
      label: 'Sign-ups',
      value: total(current, 'signups'),
      previous: total(previous, 'signups'),
      kind: 'count',
      better: 'up',
    },
    {
      label: 'Conversion rate',
      value: total(current, 'signups') / visitors,
      previous: total(previous, 'signups') / previousVisitors,
      kind: 'rate',
      decimals: 2,
      better: 'up',
    },
    {
      label: 'Bounce rate',
      value: total(current, 'bounces') / visitors,
      previous: total(previous, 'bounces') / previousVisitors,
      kind: 'rate',
      decimals: 1,
      better: 'down',
    },
  ];

  return {
    current,
    previous,
    metrics,
    pages: PAGES.map(({ share, viewsPerVisitor, ...page }) => ({
      ...page,
      visitors: Math.round(visitors * share),
      views: Math.round(visitors * share * viewsPerVisitor),
    })),
    sources: SOURCES.map((source) => ({
      ...source,
      visitors: Math.round(visitors * source.share),
    })),
  };
}
