// TODO(custom): hand-built SVG line chart with a comparison series and a hover readout; no chart component and no data-viz colour tokens (uses non-semantic blue).
import { cn } from '@wideset/react';
import { useId, useState } from 'react';

import { isoOf } from './data';
import { formatDay, formatMonth, formatRange, formatUsd, formatUsdCompact } from './format';

// The plot in viewBox units; the SVG stretches to its box and the strokes keep their width.
const WIDTH = 1000;
const HEIGHT = 220;

// Wideset has no data-visualisation colours yet: the period in view takes the blue highlight, the
// period it is compared with stays a neutral grey, dashed so it does not rest on colour alone.
const CURRENT = 'stroke-(--ws-non-semantic-fill-blue-strong)';
const PREVIOUS = 'stroke-ws-static-subtle';
const DASH = '4 4';

/** The axis step: 1, 2, 2.5 or 5 times a power of ten, for about four gridlines. */
const niceStep = (max: number) => {
  const raw = max / 4;
  const power = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 2.5, 5, 10].map((factor) => factor * power).find((step) => step >= raw)!;
};

/** Which days get a date under the axis: month starts on a long period, else every few days. */
const labelled = (start: number, count: number) => {
  const days = Array.from({ length: count }, (_, index) => index);
  if (count > 62) return days.filter((index) => isoOf(start + index).endsWith('-01'));
  // Counted back from the last day, so today always has its date.
  const step = count <= 14 ? 3 : 7;
  return days.filter((index) => (count - 1 - index) % step === 0);
};

type RevenueChartProps = {
  /** The first day of the period, and the running revenue at the close of each day so far. */
  start: number;
  series: number[];
  /** The same for the period before, day for day. */
  previousStart: number;
  previousSeries: number[];
  className?: string;
};

/**
 * Revenue adding up over the period so far, over the same days of the period before: one line in
 * colour, the comparison a quiet grey. Hovering the plot reads one day off both lines in the
 * legend; at rest the legend reads today, the same two numbers as the first key figure.
 */
export function RevenueChart({
  start,
  series,
  previousStart,
  previousSeries,
  className,
}: RevenueChartProps) {
  const titleId = useId();
  const [hover, setHover] = useState<number | null>(null);
  const last = series.length - 1;

  // Running totals only rise, so each line's last point is its highest.
  const high = Math.max(series[last], previousSeries[last], 1);
  const step = niceStep(high);
  const ceiling = Math.ceil(high / step) * step;
  const ticks = Array.from({ length: ceiling / step + 1 }, (_, index) => ceiling - index * step);

  const x = (index: number) => (last ? (index / last) * WIDTH : WIDTH);
  const y = (value: number) => HEIGHT - (value / ceiling) * HEIGHT;
  const line = (values: number[]) =>
    values.map((value, index) => `${index ? 'L' : 'M'}${x(index)} ${y(value)}`).join('');

  // The day the readout shows: the hovered one, or today.
  const at = hover ?? last;
  const lines = [
    { key: 'previous', stroke: PREVIOUS, dash: DASH, first: previousStart, values: previousSeries },
    { key: 'current', stroke: CURRENT, dash: undefined, first: start, values: series },
  ];

  return (
    <section aria-labelledby={titleId} className={cn('gap-ws-11 flex flex-col', className)}>
      <div className="gap-ws-9 flex items-center justify-between">
        <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
          Revenue to date
        </h2>
        {/* The period in view reads first; the plot draws it last, over the comparison. */}
        <ul className="gap-ws-12 typography-label-sm flex items-center">
          {[...lines].reverse().map(({ key, stroke, dash, first, values }) => (
            <li key={key} className="gap-ws-5 flex items-center">
              <svg
                aria-hidden
                viewBox="0 0 20 2"
                className={cn('w-ws-11 h-ws-2 overflow-visible', stroke)}
              >
                <line x1="0" x2="20" y1="1" y2="1" strokeWidth={2} strokeDasharray={dash} />
              </svg>
              <span className="text-ws-static-subtle">
                {hover === null
                  ? formatRange(first, first + last)
                  : formatRange(first + at, first + at)}
              </span>
              <span
                className={cn(
                  'tabular-nums',
                  dash ? 'text-ws-static-base' : 'text-ws-static-strong',
                )}
              >
                {formatUsd(values[at])}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <figure aria-label="Revenue adding up over the period, against the period before">
        <div className="relative h-[13.75rem]">
          {/* Tick values: a second SVG with no viewBox, so the text keeps its shape. */}
          <svg aria-hidden className="inset-ws-0 absolute size-full overflow-visible">
            {ticks.map((tick) => (
              <text
                key={tick}
                x="0"
                y={`${((ceiling - tick) / ceiling) * 100}%`}
                dominantBaseline="middle"
                className="typography-caption-md fill-ws-static-subtle tabular-nums"
              >
                {formatUsdCompact(tick)}
              </text>
            ))}
          </svg>
          <div
            className="inset-y-ws-0 left-ws-18 right-ws-0 absolute"
            onPointerMove={(event) => {
              const box = event.currentTarget.getBoundingClientRect();
              const fraction = (event.clientX - box.left) / box.width;
              setHover(Math.min(Math.max(Math.round(fraction * last), 0), last));
            }}
            onPointerLeave={() => setHover(null)}
          >
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              preserveAspectRatio="none"
              aria-hidden
              className="size-full overflow-visible"
            >
              {ticks.map((tick) => (
                <line
                  key={tick}
                  x1="0"
                  x2={WIDTH}
                  y1={y(tick)}
                  y2={y(tick)}
                  vectorEffect="non-scaling-stroke"
                  className="stroke-(--ws-static-stroke-subtle)"
                />
              ))}
              {hover !== null && (
                <line
                  x1={x(at)}
                  x2={x(at)}
                  y1="0"
                  y2={HEIGHT}
                  vectorEffect="non-scaling-stroke"
                  className="stroke-(--ws-static-stroke-strong)"
                />
              )}
              {lines.map(({ key, stroke, dash, values }) => (
                <g
                  key={key}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={stroke}
                >
                  <path
                    d={line(values)}
                    strokeWidth={dash ? 1.5 : 2}
                    strokeDasharray={dash}
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* The day in the readout: a round cap on a zero-length line stays a circle. */}
                  <path
                    d={`M${x(at)} ${y(values[at])}h0`}
                    strokeWidth={8}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>
        <div className="pl-ws-18 mt-ws-5">
          <svg aria-hidden className="h-ws-9 w-full overflow-visible">
            {labelled(start, series.length).map((index) => (
              <text
                key={index}
                x={`${last ? (index / last) * 100 : 100}%`}
                y="50%"
                dominantBaseline="middle"
                textAnchor={index === 0 ? 'start' : index === last ? 'end' : 'middle'}
                className="typography-caption-md fill-ws-static-subtle"
              >
                {series.length > 62 ? formatMonth(start + index) : formatDay(start + index)}
              </text>
            ))}
          </svg>
        </div>
      </figure>
    </section>
  );
}
