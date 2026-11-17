import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiHandCoinLine,
  RiHome5Line,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartFill,
  RiLineChartLine,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionLine,
  RiSettings3Line,
  RiTeamLine,
} from '@remixicon/react';

/** The product is Orbit; the workspace whose revenue this is, Lumen Studio. */
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
  { id: 'revenue', label: 'Revenue', icon: RiLineChartLine, activeIcon: RiLineChartFill },
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

/*
  The dataset: every deal the team has closed since Jan 1, 2025, won or lost, with its owner and
  its amount. Every figure on the screen is counted from these rows, so the key figures, the
  chart, the breakdown and the goal always add up. The rows are generated once from a seeded
  sequence, up to the sample's today; a real app fetches the same rows for the period on screen.
*/

const DAY = 86_400_000;
const START = Date.UTC(2025, 0, 1);

/** A calendar day (`2026-11-10`) as a day number (days since Jan 1, 2025), and back. */
export const dayOf = (iso: string) => Math.round((Date.parse(iso) - START) / DAY);
export const isoOf = (day: number) => new Date(START + day * DAY).toISOString().slice(0, 10);

/** The sample is frozen on this day. */
export const TODAY = dayOf('2026-11-10');

export const OWNERS = [
  { id: 'jonas', name: 'Jonas Weber', share: 0.26 },
  { id: 'priya', name: 'Priya Raman', share: 0.23 },
  { id: 'maya', name: 'Maya Okafor', share: 0.2 },
  { id: 'tom', name: 'Tom Becker', share: 0.17 },
  { id: 'elena', name: 'Elena Silva', share: 0.14 },
] as const;

type Deal = { day: number; owner: (typeof OWNERS)[number]['id']; amount: number; won: boolean };

/** A repeatable sequence in [0, 1). */
const random = (() => {
  let seed = 20_251_109;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
})();

const DEALS: Deal[] = (() => {
  const rows: Deal[] = [];
  for (let day = 0; day <= TODAY; day++) {
    const weekday = new Date(START + day * DAY).getUTCDay();
    // Deals close on working days: three or four a day at first, a third more a year on.
    if (weekday === 0 || weekday === 6) continue;
    for (let n = Math.floor(3.2 * (1 + (0.3 * day) / 365) + random()); n > 0; n--) {
      // The owner whose share of the team's deals the draw lands in.
      let draw = random();
      const owner = OWNERS.find((entry) => (draw -= entry.share) < 0) ?? OWNERS[0];
      // $2,000 to $26,000 in steps of $500, most of them small; a third are won.
      const amount = 2_000 + Math.round(random() ** 2 * 48) * 500;
      rows.push({ day, owner: owner.id, amount, won: random() < 0.34 });
    }
  }
  return rows;
})();

/** What closed between two days, both included. */
const totals = (from: number, to: number) => {
  const closed = DEALS.filter((deal) => deal.day >= from && deal.day <= to);
  const won = closed.filter((deal) => deal.won);
  const revenue = won.reduce((sum, deal) => sum + deal.amount, 0);
  return {
    revenue,
    won: won.length,
    average: won.length ? revenue / won.length : 0,
    winRate: closed.length ? won.length / closed.length : 0,
    owners: OWNERS.map(({ id, name }) => ({
      id,
      name,
      revenue: won.reduce((sum, deal) => (deal.owner === id ? sum + deal.amount : sum), 0),
    })),
  };
};

/** Revenue won from `from` to the close of each day up to `to`: a running total. */
const running = (from: number, to: number) => {
  const days = new Array<number>(to - from + 1).fill(0);
  for (const deal of DEALS) {
    if (deal.won && deal.day >= from && deal.day <= to) days[deal.day - from] += deal.amount;
  }
  for (let index = 1; index < days.length; index++) days[index] += days[index - 1];
  return days;
};

export type Period = 'month' | 'quarter' | 'year';

export const PERIODS: { value: Period; label: string }[] = [
  { value: 'month', label: 'This month' },
  { value: 'quarter', label: 'This quarter' },
  { value: 'year', label: 'This year' },
];

// The sample's today never moves, so each period's first day and the one before it are written out.
const SPANS: Record<Period, { from: string; before: string }> = {
  month: { from: '2026-11-01', before: '2026-10-01' },
  quarter: { from: '2026-10-01', before: '2026-07-01' },
  year: { from: '2026-01-01', before: '2025-01-01' },
};

/**
 * Everything the page shows for one period. The period runs to today and is compared with the
 * same number of days at the start of the period before: a month ten days in is measured against
 * the first ten days of last month, not against all of it.
 */
export function revenueFor(period: Period) {
  const from = dayOf(SPANS[period].from);
  const before = dayOf(SPANS[period].before);
  const beforeTo = before + TODAY - from;
  return {
    /** The days on screen, and the days they are compared with. */
    range: { from, to: TODAY },
    comparison: { from: before, to: beforeTo },
    current: totals(from, TODAY),
    previous: totals(before, beforeTo),
    /** Running revenue, day by day, for both. */
    series: running(from, TODAY),
    previousSeries: running(before, beforeTo),
  };
}

/** The quarter's goal. It does not move with the period control: it is always this quarter's. */
export const GOAL = {
  label: 'Q4 goal',
  target: 1_100_000,
  revenue: totals(dayOf(SPANS.quarter.from), TODAY).revenue,
  daysLeft: dayOf('2026-12-31') - TODAY,
};
