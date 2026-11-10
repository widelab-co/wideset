import { cn } from '@wideset/react';
import { useId } from 'react';

import { formatCompact, formatDay } from './format';

// The plot in viewBox units; the SVG stretches to its box and the strokes keep their width.
const WIDTH = 1000;
const HEIGHT = 240;

// Wideset has no data-visualisation colours yet: the period in view takes the blue highlight, the
// period it is compared with stays a neutral grey.
const CURRENT = 'stroke-(--ws-non-semantic-fill-blue-strong)';
const PREVIOUS = 'stroke-ws-static-subtle';

/** The axis step: 1, 2, 2.5 or 5 times a power of ten, for about three gridlines. */
const niceStep = (max: number) => {
  const raw = max / 3;
  const power = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 2.5, 5, 10].map((factor) => factor * power).find((step) => step >= raw)!;
};

/** Every `step`-th day counted back from the last, so the newest day always has its label. */
const labelled = (count: number) => {
  const step = count <= 7 ? 1 : count <= 30 ? 7 : 14;
  return Array.from({ length: count }, (_, index) => index).filter(
    (index) => (count - 1 - index) % step === 0,
  );
};

type TrendChartProps = {
  title: string;
  /** Calendar days (`2026-12-14`), one per value of `current`. */
  dates: string[];
  current: number[];
  /** The previous period, day by day, drawn under the current one. */
  previous: number[];
  currentLabel: string;
  previousLabel: string;
  className?: string;
};

/** A daily series for the period in view, drawn over the same days of the period before it. */
export function TrendChart({
  title,
  dates,
  current,
  previous,
  currentLabel,
  previousLabel,
  className,
}: TrendChartProps) {
  const id = useId().replace(/[^\w-]/g, '');
  const step = niceStep(Math.max(...current, ...previous));
  const max = Math.ceil(Math.max(...current, ...previous) / step) * step;
  const ticks = Array.from({ length: max / step + 1 }, (_, index) => max - index * step);

  const x = (index: number) => (index / (current.length - 1)) * WIDTH;
  const y = (value: number) => HEIGHT - (value / max) * HEIGHT;
  const line = (values: number[]) =>
    values.map((value, index) => `${index ? 'L' : 'M'}${x(index)} ${y(value)}`).join('');
  const last = current.length - 1;

  return (
    <section aria-labelledby={`${id}-title`} className={cn('gap-ws-11 flex flex-col', className)}>
      <div className="gap-ws-9 flex items-center justify-between">
        <h2 id={`${id}-title`} className="typography-label-strong-md text-ws-static-strong">
          {title}
        </h2>
        <ul className="gap-ws-11 typography-label-sm text-ws-static-base flex items-center">
          <li className="gap-ws-5 flex items-center">
            <Swatch className={CURRENT} />
            {currentLabel}
          </li>
          <li className="gap-ws-5 flex items-center">
            <Swatch className={PREVIOUS} dashed />
            {previousLabel}
          </li>
        </ul>
      </div>

      <figure aria-label={`${title}, ${currentLabel}, against ${previousLabel}`}>
        <div className="relative h-[15rem]">
          {/* Tick values: a second SVG with no viewBox, so the text keeps its shape. */}
          <svg aria-hidden className="inset-ws-0 absolute size-full overflow-visible">
            {ticks.map((tick) => (
              <text
                key={tick}
                x="0"
                y={`${(1 - tick / max) * 100}%`}
                dominantBaseline="middle"
                className="typography-caption-md fill-ws-static-subtle tabular-nums"
              >
                {formatCompact(tick)}
              </text>
            ))}
          </svg>
          <div className="inset-y-ws-0 left-ws-16 right-ws-0 absolute">
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
              <path
                d={line(previous)}
                fill="none"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                className={PREVIOUS}
              />
              <path
                d={`${line(current)}L${WIDTH} ${HEIGHT}L0 ${HEIGHT}Z`}
                fill={`url(#${id}-fill)`}
              />
              <g fill="none" strokeLinecap="round" strokeLinejoin="round" className={CURRENT}>
                <path d={line(current)} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                {/* Today: a round cap on a zero-length line stays a circle however the plot stretches. */}
                <path
                  d={`M${x(last)} ${y(current[last])}h0`}
                  strokeWidth={8}
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </svg>
          </div>
        </div>
        <div className="pl-ws-16 mt-ws-5">
          <svg aria-hidden className="h-ws-9 w-full overflow-visible">
            {labelled(dates.length).map((index) => (
              <text
                key={dates[index]}
                x={`${(index / last) * 100}%`}
                y="50%"
                dominantBaseline="middle"
                textAnchor={index === last ? 'end' : 'middle'}
                className="typography-caption-md fill-ws-static-subtle"
              >
                {formatDay(dates[index])}
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
