import { AppShell, cn, type DateRangePreset, type DateRangeValue } from '@wideset/react';
import { useState } from 'react';

import {
  type Compare,
  comparisonOf,
  dayOf,
  FIRST_DAY,
  isoOf,
  type Range,
  revenueReport,
  type Summary,
  TODAY,
} from './data';
import { formatCount, formatPercent, formatRange, formatUsd, formatUsdSigned } from './format';
import { KpiCard } from './kpi-card';
import { MovementsChart } from './movements-chart';
import { MrrChart } from './mrr-chart';
import { PageHeader } from './page-header';
import { PlanBreakdown } from './plan-breakdown';
import { RegionTable } from './region-table';
import { ReportSidebar } from './sidebar';

/** One column for the title row and every section, so their edges line up. */
const COLUMN = 'mx-auto w-full max-w-[80rem]';
/** A module of the report: white on the grey canvas, no border, a light shadow to lift it. */
const SECTION = 'bg-ws-static-foreground rounded-ws-container-md shadow-ws-low p-ws-12';

type Figure = {
  label: string;
  value: number;
  previous?: number;
  /** The direction that is good news: churned MRR going down is. */
  better: 'up' | 'down';
  format: (value: number) => string;
};

/** A figure as a key figure: the value, its change and what the change is measured against. */
const toKpi = ({ label, value, previous, better, format }: Figure) => {
  const direction = previous === undefined || value >= previous ? 'up' : 'down';
  return {
    label,
    value: format(value),
    // A change in percent needs a positive base: a net loss before the range has none.
    change:
      previous !== undefined && previous > 0
        ? formatPercent((value - previous) / previous)
        : undefined,
    direction,
    good: direction === better,
    comparison: previous === undefined ? 'Nothing to compare with' : `from ${format(previous)}`,
  } as const;
};

/** The region breakdown as a CSV file, the way a spreadsheet opens it. */
function exportCsv({ range, regions, ...total }: Summary) {
  const lines = [
    ['Region', 'New MRR', 'Expansion MRR', 'Churned MRR', 'Net new MRR', 'MRR'],
    ...regions.map((r) => [r.label, r.new, r.expansion, r.churn, r.net, r.mrr]),
    ['Total', total.new, total.expansion, total.churn, total.net, total.mrr],
  ];
  const file = new Blob([lines.map((line) => line.join(',')).join('\n')], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = `revenue-report-${isoOf(range.from)}-to-${isoOf(range.to)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

const year = isoOf(TODAY).slice(0, 4);
/** The day of every point of a daily series: the close of the day before the range, then each day. */
const daysFrom = (range: Range) =>
  Array.from({ length: range.to - range.from + 2 }, (_, index) => range.from - 1 + index);

/**
 * Revenue report, Canvas direction: the sidebar and the title row on the grey canvas, every module
 * in its own white section. MRR for a range against an earlier one. The date range and the
 * comparison recount every figure on the page from one set of MRR movements, so the key figures,
 * the charts and the table always add up.
 */
export default function Report() {
  const [picked, setPicked] = useState<{ range: DateRangeValue; preset: DateRangePreset }>({
    range: { from: `${year}-01-01`, to: `${year}-12-31` },
    preset: 'thisYear',
  });
  const [compare, setCompare] = useState<Compare>('year');

  // A preset can reach past today ("This year" ends on Dec 31): the report stops at today.
  const range: Range = {
    from: Math.max(dayOf(picked.range.from!), FIRST_DAY),
    to: Math.min(dayOf(picked.range.to!), TODAY),
  };
  const comparison = comparisonOf(range, compare);
  const { current, previous } = revenueReport(range, compare);
  const currentLabel = formatRange(range.from, range.to);
  const previousLabel = formatRange(comparison.from, comparison.to);

  const figures: Figure[] = [
    { label: 'MRR', value: current.mrr, previous: previous?.mrr, better: 'up', format: formatUsd },
    {
      label: 'Net new MRR',
      value: current.net,
      previous: previous?.net,
      better: 'up',
      format: formatUsdSigned,
    },
    {
      label: 'Churned MRR',
      value: current.churn,
      previous: previous?.churn,
      better: 'down',
      format: formatUsd,
    },
    {
      label: 'Customers',
      value: current.customers,
      previous: previous?.customers,
      better: 'up',
      format: formatCount,
    },
  ];

  return (
    <AppShell direction="canvas">
      <ReportSidebar />
      <AppShell.Main className="flex flex-col">
        <PageHeader
          range={picked.range}
          preset={picked.preset}
          onRangeChange={(next, preset) => setPicked({ range: next, preset })}
          compare={compare}
          onCompareChange={setCompare}
          summary={
            previous
              ? `${currentLabel}, compared with ${previousLabel}`
              : `${currentLabel}; there is no earlier data to compare with`
          }
          onExport={() => exportCsv(current)}
        />

        {/* The controls stay in view; the report scrolls under them. */}
        <div className="px-ws-12 pb-ws-12 min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-9 flex flex-col')}>
            <section aria-label="Key figures" className="gap-ws-9 grid grid-cols-4">
              {figures.map((figure) => (
                <KpiCard key={figure.label} {...toKpi(figure)} className={SECTION} />
              ))}
            </section>

            <MrrChart
              days={daysFrom(range)}
              current={current.daily}
              previous={previous?.daily ?? null}
              previousDays={previous ? daysFrom(comparison) : null}
              currentLabel={currentLabel}
              previousLabel={previousLabel}
              className={SECTION}
            />

            <div className="gap-ws-9 grid grid-cols-3">
              <MovementsChart
                buckets={current.buckets}
                unit={current.unit}
                totals={current}
                className={cn(SECTION, 'col-span-2')}
              />
              <PlanBreakdown plans={current.plans} className={SECTION} />
            </div>

            <RegionTable current={current} previous={previous} className={SECTION} />
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
