import { RiArrowDropDownFill } from '@remixicon/react';
import { cn } from '@wideset/react';

import type { ColumnSummary as Summary } from './data';

const BAR = 'bg-ws-non-semantic-brand-subtle';
const CHART = 'h-ws-12 gap-ws-1 rounded-ws-control-sm flex overflow-hidden';

/**
 * A column at a glance, in the summary row under its header: the type, a 24px chart of the
 * values and a caption. Screen content composed from tokens; the caption says what the chart
 * shows, so the chart is hidden from screen readers.
 */
export function ColumnSummary({ summary: { type, chart, caption } }: { summary: Summary }) {
  return (
    <div className="typography-caption-sm text-ws-static-subtle gap-ws-3 flex min-w-0 flex-1 flex-col">
      <span className="gap-ws-2 flex items-center">
        {type}
        <RiArrowDropDownFill aria-hidden className="size-ws-9" />
      </span>
      <Chart chart={chart} />
      {typeof caption === 'string' ? (
        <span className="truncate">{caption}</span>
      ) : (
        <span className="flex justify-between">
          <span>{caption[0]}</span>
          <span>{caption[1]}</span>
        </span>
      )}
    </div>
  );
}

// Bar heights and segment widths are data, so they are inline sizes, as in any chart.
function Chart({ chart }: { chart: Summary['chart'] }) {
  if (chart.kind === 'histogram')
    return (
      <span aria-hidden className={cn(CHART, 'items-end')}>
        {chart.bins.map((height, index) => (
          <span
            key={index}
            className={cn(BAR, 'flex-1')}
            style={{ height: `${(height / 24) * 100}%` }}
          />
        ))}
      </span>
    );

  if (chart.kind === 'categories')
    return (
      <span aria-hidden className={CHART}>
        {chart.segments.map(({ width, count }, index) => (
          <span
            key={index}
            style={width ? { width } : undefined}
            className={cn(
              BAR,
              'text-ws-non-semantic-indigo-on-subtle px-ws-2 py-ws-3 truncate text-center',
              width ? 'shrink-0' : 'min-w-0 flex-1',
            )}
          >
            {count}
          </span>
        ))}
        <span className="bg-ws-semantic-neutral w-ws-5 shrink-0" />
      </span>
    );

  return (
    <span aria-hidden className={CHART}>
      {Array.from({ length: chart.repeated }, (_, index) => (
        <span key={index} className={cn(BAR, 'w-ws-1 shrink-0')} />
      ))}
      <span className="bg-ws-static-alpha-base p-ws-3 min-w-0 flex-1 truncate text-center">
        Unique
      </span>
    </span>
  );
}
