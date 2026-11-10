import { cn } from '@wideset/react';
import { useState } from 'react';

import { type Metric, type Period, PERIODS, report } from './data';
import { formatCount, formatPercent, formatPoints, formatRange } from './format';
import { KpiCard } from './kpi-card';
import { PageHeader } from './page-header';
import { AppSidebar } from './sidebar';
import { TopPagesTable } from './top-pages-table';
import { TrafficSources } from './traffic-sources';
import { TrendChart } from './trend-chart';

const formatValue = (metric: Metric) =>
  metric.kind === 'rate' ? formatPercent(metric.value, metric.decimals) : formatCount(metric.value);

/** A metric as a key figure: the value, its change and what the change is measured against. */
const toKpi = (metric: Metric) => {
  const delta = metric.value - metric.previous;
  const direction = delta >= 0 ? 'up' : 'down';
  return {
    label: metric.label,
    value: formatValue(metric),
    change:
      metric.kind === 'rate'
        ? formatPoints(delta, metric.decimals)
        : formatPercent(Math.abs(delta / metric.previous)),
    direction,
    good: direction === metric.better,
    comparison: `from ${formatValue({ ...metric, value: metric.previous })}`,
  } as const;
};

/**
 * Product analytics, Flat direction: the sidebar and the page on one white surface, the page's
 * regions split by lines. The period switch in the header recounts every figure.
 */
export default function Analytics() {
  const [period, setPeriod] = useState<Period>('30d');
  const { days } = PERIODS.find((entry) => entry.value === period)!;
  const { current, previous, metrics, pages, sources } = report(period);
  const first = current[0].date;
  const last = current[current.length - 1].date;

  return (
    <div className="bg-ws-static-foreground flex h-dvh">
      <AppSidebar />
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <PageHeader period={period} onPeriodChange={setPeriod} range={formatRange(first, last)} />

        <section aria-label="Key figures" className="border-ws-static-subtle px-ws-12 border-b">
          <div className="mx-auto grid w-full max-w-[80rem] grid-cols-4">
            {metrics.map((metric, index) => (
              <KpiCard
                key={metric.label}
                {...toKpi(metric)}
                className={cn(
                  'py-ws-12 pr-ws-12',
                  index > 0 && 'border-ws-static-subtle pl-ws-12 border-l',
                )}
              />
            ))}
          </div>
        </section>

        <div className="border-ws-static-subtle px-ws-12 py-ws-12 border-b">
          <TrendChart
            title="Visitors"
            dates={current.map((day) => day.date)}
            current={current.map((day) => day.visitors)}
            previous={previous.map((day) => day.visitors)}
            currentLabel={`Last ${days} days`}
            previousLabel={`Previous ${days} days`}
            className="mx-auto w-full max-w-[80rem]"
          />
        </div>

        {/* The last band takes the rest of the window: the line between its columns runs to the
            bottom edge instead of stopping in the air. */}
        <div className="px-ws-12 flex-1">
          <div className="mx-auto grid h-full w-full max-w-[80rem] grid-cols-4">
            <TopPagesTable
              pages={pages}
              className="border-ws-static-subtle py-ws-12 pr-ws-12 col-span-3 border-r"
            />
            <TrafficSources sources={sources} className="py-ws-12 pl-ws-12" />
          </div>
        </div>
      </main>
    </div>
  );
}
