import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, cn, IconButton } from '@wideset/react';
import { useId, useState } from 'react';

import { GOAL, type Period, revenueFor } from './data';
import { formatCount, formatPercent, formatPoints, formatRange, formatUsd } from './format';
import { GoalProgress } from './goal-progress';
import { KeyFigure } from './key-figure';
import { OwnerBreakdown } from './owner-breakdown';
import { PageHeader } from './page-header';
import { RevenueChart } from './revenue-chart';
import { DashboardSidebar } from './sidebar';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';
/** A module under another: a line and space above it. No module has a box of its own. */
const LINE = 'border-ws-static-subtle pt-ws-12 border-t';

type Figure = {
  label: string;
  value: number;
  previous: number;
  format: (value: number) => string;
  /** A rate: its change is counted in percentage points, not in percent of what it was. */
  rate?: boolean;
};

/** A figure as a key figure: the value, its change, and what the change is measured against. */
const toKeyFigure = ({ label, value, previous, format, rate }: Figure) =>
  ({
    label,
    value: format(value),
    change: rate ? formatPoints(value - previous) : formatPercent((value - previous) / previous),
    direction: value >= previous ? 'up' : 'down',
    comparison: `from ${format(previous)}`,
  }) as const;

/**
 * Dashboard (Inset direction): revenue for a period on the raised page beside the workspace
 * sidebar. Everything sits on the page's white, split by lines and space: four key figures, the
 * trend against the period before, then who the revenue came from and how far the quarter's goal
 * is. The period control recounts every figure from one list of closed deals; the goal stays the
 * quarter's.
 */
export default function Dashboard() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [period, setPeriod] = useState<Period>('month');

  const { current, previous, range, comparison, series, previousSeries } = revenueFor(period);

  const figures: Figure[] = [
    { label: 'Closed won', value: current.revenue, previous: previous.revenue, format: formatUsd },
    { label: 'Deals won', value: current.won, previous: previous.won, format: formatCount },
    {
      label: 'Average deal size',
      value: current.average,
      previous: previous.average,
      format: formatUsd,
    },
    {
      label: 'Win rate',
      value: current.winRate,
      previous: previous.winRate,
      format: formatPercent,
      rate: true,
    },
  ];

  return (
    <AppShell direction="inset">
      <DashboardSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <AppShell.Main>
        <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
          {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
              left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
          <div className="gap-ws-5 px-ws-11 flex w-full items-center">
            <IconButton
              icon={RiSideBarLine}
              variant="secondary"
              preset="ghost"
              size="sm"
              iconClassName="text-ws-static-subtle size-ws-9"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              aria-controls={sidebarId}
              onClick={() => setCollapsed(!collapsed)}
              className="-ml-ws-5"
            />
            <Breadcrumbs separator="arrow">
              <Breadcrumbs.Item>Revenue</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
            <PageHeader
              summary={`Closed revenue for ${formatRange(range.from, range.to)}, compared with ${formatRange(comparison.from, comparison.to)}`}
              period={period}
              onPeriodChange={setPeriod}
            />

            {/* Lines between the figures, not boxes round them: they read as one row. */}
            <section aria-label="Key figures" className="grid grid-cols-4">
              {figures.map((figure) => (
                <KeyFigure
                  key={figure.label}
                  {...toKeyFigure(figure)}
                  className="border-ws-static-subtle pl-ws-12 first:pl-ws-0 border-l first:border-l-0"
                />
              ))}
            </section>

            <RevenueChart
              start={range.from}
              series={series}
              previousStart={comparison.from}
              previousSeries={previousSeries}
              className={LINE}
            />

            <div className={cn(LINE, 'grid grid-cols-2')}>
              <OwnerBreakdown owners={current.owners} className="pr-ws-12" />
              <GoalProgress {...GOAL} className="border-ws-static-subtle pl-ws-12 border-l" />
            </div>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
