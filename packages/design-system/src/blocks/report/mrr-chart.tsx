// TODO(custom): hand-built SVG line chart with a comparison series and a hover readout; no chart component and no data-viz colour tokens (uses non-semantic blue).
import { cn } from '@wideset/react';
import { useId, useState } from 'react';

import { isoOf } from './data';
import { formatDay, formatMonth, formatRange, formatUsd, formatUsdCompact } from './format';

// The plot in viewBox units; the SVG stretches to its box and the strokes keep their width.
const WIDTH = 1000;
const HEIGHT = 240;

// Wideset has no data-visualisation colours yet: the range in view takes the blue highlight, the
// range it is compared with stays a neutral grey.
const CURRENT = 'stroke-(--ws-non-semantic-fill-blue-strong)';
const PREVIOUS = 'stroke-ws-static-subtle';

/** The axis step: 1, 2, 2.5 or 5 times a power of ten, for about four gridlines. */
const niceStep = (span: number) => {
  const raw = span / 4;
  const power = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 2.5, 5, 10].map((factor) => factor * power).find((step) => step >= raw)!;
};

/** Which points get a date under the axis: month starts on a long range, else every few days. */
const labelled = (days: number[]) => {
  const last = days.length - 1;
  if (last > 62) {
    return days
      .map((day, index) => ({ day, index }))
      .filter(({ day, index }) => index > 0 && isoOf(day).endsWith('-01'))
      .map(({ index }) => index);
  }
  // The first point is the close of the day before the range: it gets no date of its own.
  const step = last <= 8 ? 1 : last <= 31 ? 7 : 14;
  return days.map((_, index) => index).filter((index) => index > 0 && (last - index) % step === 0);
};

type MrrChartProps = {
  /** The day of every point: the close of the day before the range, then every day in it. */
  days: number[];
  current: number[];
  /** The comparison range, point by point; `null` when there is none. */
  previous: number[] | null;
  previousDays: number[] | null;
  currentLabel: string;
  previousLabel: string;
  className?: string;
};

/**
 * MRR at the close of every day of the range, over the range it is compared with. Hovering the
 * plot reads one day off both lines in the legend.
 */
export function MrrChart({
  days,
  current,
  previous,
  previousDays,
  currentLabel,
  previousLabel,
  className,
}: MrrChartProps) {
  const id = useId().replace(/[^\w-]/g, '');
  const [hovered, setHover] = useState<number | null>(null);
  const last = current.length - 1;
  // A range change (by keyboard, the pointer still) can leave fewer days than the hovered index.
  const hover = hovered !== null && hovered <= last ? hovered : null;

  const values = [...current, ...(previous ?? [])];
  const low = Math.min(...values);
  const high = Math.max(...values);
  const step = niceStep(Math.max(high - low, high * 0.02));
  const floor = Math.floor(low / step) * step;
  const ceiling = Math.max(Math.ceil(high / step) * step, floor + step);
  const ticks = Array.from(
    { length: Math.round((ceiling - floor) / step) + 1 },
    (_, index) => ceiling - index * step,
  );

  const x = (index: number, count: number) => (count > 1 ? (index / (count - 1)) * WIDTH : WIDTH);
  const y = (value: number) => HEIGHT - ((value - floor) / (ceiling - floor)) * HEIGHT;
  const line = (series: number[]) =>
    series
      .map((value, index) => `${index ? 'L' : 'M'}${x(index, series.length)} ${y(value)}`)
      .join('');

  // The point the readout shows: the hovered day, or the last one.
  const at = hover ?? last;
  const previousAt = previous ? Math.round((at / Math.max(last, 1)) * (previous.length - 1)) : 0;

  return (
    <section aria-labelledby={`${id}-title`} className={cn('gap-ws-11 flex flex-col', className)}>
      <div className="gap-ws-9 flex items-center justify-between">
        <h2 id={`${id}-title`} className="typography-subtitle-xs text-ws-static-strong">
          MRR
        </h2>
        <ul className="gap-ws-12 typography-label-sm flex items-center">
          <li className="gap-ws-5 flex items-center">
            <Swatch className={CURRENT} />
            <span className="text-ws-static-subtle">
              {hover === null ? currentLabel : formatRange(days[at], days[at])}
            </span>
            <span className="text-ws-static-strong tabular-nums">{formatUsd(current[at])}</span>
          </li>
          {previous && previousDays && (
            <li className="gap-ws-5 flex items-center">
              <Swatch className={PREVIOUS} dashed />
              <span className="text-ws-static-subtle">
                {hover === null
                  ? previousLabel
                  : formatRange(previousDays[previousAt], previousDays[previousAt])}
              </span>
              <span className="text-ws-static-base tabular-nums">
                {formatUsd(previous[previousAt])}
              </span>
            </li>
          )}
        </ul>
      </div>

      <figure aria-label={`MRR, ${currentLabel}, against ${previousLabel}`}>
        <div className="relative h-[15rem]">
          {/* Tick values: a second SVG with no viewBox, so the text keeps its shape. */}
          <svg aria-hidden className="inset-ws-0 absolute size-full overflow-visible">
            {ticks.map((tick) => (
              <text
                key={tick}
                x="0"
                y={`${((ceiling - tick) / (ceiling - floor)) * 100}%`}
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
              <defs>
                <linearGradient
                  id={`${id}-fill`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                  className="text-(--ws-non-semantic-fill-blue-strong)"
                >
                  <stop offset="0" stopColor="currentColor" stopOpacity={0.12} />
                  <stop offset="1" stopColor="currentColor" stopOpacity={0} />
                </linearGradient>
              </defs>
              {ticks.map((tick) => (
                <line
                  key={tick}
                  x1="0"
                  x2={WIDTH}
                  y1={y(tick)}
                  y2={y(tick)}
                  vectorEffect="non-scaling-stroke"
                  className="stroke-(--ws-static-stroke-base)"
                />
              ))}
              {previous && (
                <path
                  d={line(previous)}
                  fill="none"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  className={PREVIOUS}
                />
              )}
              <path
                d={`${line(current)}L${WIDTH} ${HEIGHT}L0 ${HEIGHT}Z`}
                fill={`url(#${id}-fill)`}
              />
              {hover !== null && (
                <line
                  x1={x(at, current.length)}
                  x2={x(at, current.length)}
                  y1="0"
                  y2={HEIGHT}
                  vectorEffect="non-scaling-stroke"
                  className="stroke-(--ws-static-stroke-strong)"
                />
              )}
              <g fill="none" strokeLinecap="round" strokeLinejoin="round" className={CURRENT}>
                <path d={line(current)} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                {/* The point in the readout: a round cap on a zero-length line stays a circle. */}
                <path
                  d={`M${x(at, current.length)} ${y(current[at])}h0`}
                  strokeWidth={8}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </svg>
          </div>
        </div>
        <div className="pl-ws-18 mt-ws-5">
          <svg aria-hidden className="h-ws-9 w-full overflow-visible">
            {labelled(days).map((index) => (
              <text
                key={days[index]}
                x={`${(index / Math.max(last, 1)) * 100}%`}
                y="50%"
                dominantBaseline="middle"
                textAnchor={index === last ? 'end' : index === 0 ? 'start' : 'middle'}
                className="typography-caption-md fill-ws-static-subtle"
              >
                {last > 62 ? formatMonth(days[index]) : formatDay(days[index])}
              </text>
            ))}
          </svg>
        </div>
      </figure>
    </section>
  );
}

/** A legend key: a short stroke in the series' colour and dash. */
function Swatch({ className, dashed }: { className: string; dashed?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 2"
      className={cn('w-ws-11 h-ws-2 overflow-visible', className)}
    >
      <line
        x1="0"
        x2="20"
        y1="1"
        y2="1"
        strokeWidth={2}
        strokeDasharray={dashed ? '4 4' : undefined}
      />
    </svg>
  );
}
