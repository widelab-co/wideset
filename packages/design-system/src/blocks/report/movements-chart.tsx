// TODO(custom): hand-built SVG stacked bar chart (new and expansion up, churned down) with a hover readout; no chart component and no data-viz colour tokens.
import { cn } from '@wideset/react';
import { useId, useState } from 'react';

import type { Bucket, Unit } from './data';
import { formatDay, formatMonth, formatUsd, formatUsdCompact } from './format';

// What the money did, in Wideset's one highlight and its lighter step; churn is the neutral grey
// below the line, so the colours stay for growth.
const SERIES = [
  { key: 'new', label: 'New', fill: 'fill-(--ws-non-semantic-fill-blue-strong)' },
  { key: 'expansion', label: 'Expansion', fill: 'fill-(--ws-non-semantic-fill-blue-subtle)' },
  { key: 'churn', label: 'Churned', fill: 'fill-(--ws-static-fill-alpha-strong)' },
] as const;

/** The axis step: 1, 2, 2.5 or 5 times a power of ten, for about three gridlines a side. */
const niceStep = (max: number) => {
  const raw = Math.max(max, 1) / 3;
  const power = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 2.5, 5, 10].map((factor) => factor * power).find((step) => step >= raw)!;
};

const labelOf = (bucket: Bucket, unit: Unit) =>
  unit === 'month' ? formatMonth(bucket.from) : formatDay(bucket.from);
const pct = (value: number) => `${value * 100}%`;

type MovementsChartProps = {
  buckets: Bucket[];
  unit: Unit;
  /** The range's totals, shown in the legend while no bar is hovered. */
  totals: { new: number; expansion: number; churn: number };
  className?: string;
};

/**
 * Where MRR came from and where it went, bar by bar: new and expansion stacked above the line,
 * churned below it. Hovering a bar reads it in the legend.
 */
export function MovementsChart({ buckets, unit, totals, className }: MovementsChartProps) {
  const titleId = useId();
  const [hover, setHover] = useState<number | null>(null);

  const up = Math.max(...buckets.map((b) => b.new + b.expansion));
  const down = Math.max(...buckets.map((b) => b.churn));
  const step = niceStep(Math.max(up, down));
  // Whole steps above and below the line, at least one each way.
  const top = Math.max(Math.ceil(up / step), 1);
  const bottom = Math.max(Math.ceil(down / step), 1);
  const span = (top + bottom) * step;
  const ticks = Array.from({ length: top + bottom + 1 }, (_, index) => (top - index) * step);
  /** A value's height as a share of the plot; `y` places it from the top. */
  const h = (value: number) => value / span;
  const y = (value: number) => (top * step - value) / span;

  const band = 1 / buckets.length;
  const bar = band * (buckets.length > 16 ? 0.56 : 0.36);
  const stride = Math.ceil(buckets.length / 8);
  const shown = hover === null ? totals : buckets[hover];

  return (
    <section aria-labelledby={titleId} className={cn('gap-ws-11 flex flex-col', className)}>
      <div className="gap-ws-9 flex items-center justify-between">
        <h2 id={titleId} className="typography-subtitle-xs text-ws-static-strong">
          MRR movements
        </h2>
        <ul className="gap-ws-11 typography-label-sm flex items-center">
          {hover !== null && (
            <li className="text-ws-static-strong">{labelOf(buckets[hover], unit)}</li>
          )}
          {SERIES.map((series) => (
            <li key={series.key} className="gap-ws-5 flex items-center">
              <svg aria-hidden viewBox="0 0 8 8" className={cn('size-ws-5', series.fill)}>
                <rect width="8" height="8" rx="2" />
              </svg>
              <span className="text-ws-static-subtle">{series.label}</span>
              <span className="text-ws-static-base tabular-nums">
                {formatUsd(shown[series.key])}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <figure aria-label="New, expansion and churned MRR" className="gap-ws-5 flex flex-col">
        <div className="relative h-[13rem]">
          <svg aria-hidden className="inset-ws-0 absolute size-full overflow-visible">
            {ticks.map((tick) => (
              <text
                key={tick}
                x="0"
                y={pct(y(tick))}
                dominantBaseline="middle"
                className="typography-caption-md fill-ws-static-subtle tabular-nums"
              >
                {tick < 0 ? `-${formatUsdCompact(-tick)}` : formatUsdCompact(tick)}
              </text>
            ))}
          </svg>
          {/* No viewBox: bars are placed in percent, so their corners stay round at any width. */}
          <div className="inset-y-ws-0 left-ws-18 right-ws-0 absolute">
            <svg
              aria-hidden
              className="size-full overflow-visible"
              onPointerLeave={() => setHover(null)}
            >
              {ticks.map((tick) => (
                <line
                  key={tick}
                  x1="0"
                  x2="100%"
                  y1={pct(y(tick))}
                  y2={pct(y(tick))}
                  className={
                    tick === 0 ? 'stroke-ws-static-subtle' : 'stroke-(--ws-static-stroke-base)'
                  }
                />
              ))}
              {buckets.map((bucket, index) => {
                const x = pct(index * band + (band - bar) / 2);
                const width = pct(bar);
                const dim = hover !== null && hover !== index;
                return (
                  <g key={bucket.from} opacity={dim ? 0.4 : 1}>
                    <rect
                      x={x}
                      width={width}
                      y={pct(y(bucket.new))}
                      height={pct(h(bucket.new))}
                      rx="2"
                      className={SERIES[0].fill}
                    />
                    <rect
                      x={x}
                      width={width}
                      y={pct(y(bucket.new + bucket.expansion))}
                      height={pct(h(bucket.expansion))}
                      rx="2"
                      className={SERIES[1].fill}
                    />
                    <rect
                      x={x}
                      width={width}
                      y={pct(y(0))}
                      height={pct(h(bucket.churn))}
                      rx="2"
                      className={SERIES[2].fill}
                    />
                    {/* The whole band is the hover target, not only the bar. */}
                    <rect
                      x={pct(index * band)}
                      width={pct(band)}
                      y="0"
                      height="100%"
                      fill="transparent"
                      onPointerEnter={() => setHover(index)}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
        <div className="pl-ws-18">
          <svg aria-hidden className="h-ws-9 w-full overflow-visible">
            {buckets.map((bucket, index) =>
              index % stride === 0 ? (
                <text
                  key={bucket.from}
                  x={pct((index + 0.5) * band)}
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className={cn(
                    'typography-caption-md',
                    hover === index ? 'fill-ws-static-strong' : 'fill-ws-static-subtle',
                  )}
                >
                  {labelOf(bucket, unit)}
                </text>
              ) : null,
            )}
          </svg>
        </div>
      </figure>
    </section>
  );
}
