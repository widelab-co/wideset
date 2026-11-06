import { cn, Select } from '@wideset/react';
import { useId } from 'react';

import { Change } from './Change';
import { OUTCOMES, PERIODS, VOLUME } from './data';
import { formatCount, formatDay, formatUsdWhole } from './format';

const MAX = 100_000;
const TICKS = [100_000, 75_000, 50_000, 25_000, 0];
// The plot in viewBox units; the SVG stretches to the plot, strokes keep their width.
const WIDTH = 1000;
const HEIGHT = 240;

// Wideset has no data-visualisation colours yet: gross takes the brand fill, net the subtle text.
const SERIES = {
  gross: { color: 'text-(--ws-non-semantic-fill-brand-strong)', opacity: 1 },
  net: { color: 'text-ws-static-subtle', opacity: 0.5 },
};

const toPoints = (series: number[]) =>
  series.map((value, index) => [
    (index / (series.length - 1)) * WIDTH,
    HEIGHT - (value / MAX) * HEIGHT,
  ]);

const toPath = (points: number[][]) =>
  points.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');

/** Gross and net volume over the year, with weekly transactions as bars along the bottom. */
export function VolumeChart() {
  const gradientId = `gross-fill-${useId().replace(/[^\w-]/g, '')}`;
  const gross = toPoints(VOLUME.grossSeries);
  const net = toPoints(VOLUME.netSeries);
  const maxWeekly = Math.max(...VOLUME.weeklyTransactions);

  return (
    <section aria-label="Volume" className="gap-ws-12 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="gap-ws-14 flex items-center">
          <Total series="gross" {...VOLUME.gross} />
          <span aria-hidden className="h-ws-12 border-ws-static-base border-l" />
          <Total series="net" {...VOLUME.net} />
        </div>
        <div className="gap-ws-5 flex">
          <Select
            size="sm"
            options={PERIODS}
            defaultValue="this-year"
            aria-label="Period"
            className="w-fit"
          />
          <Select
            size="sm"
            options={OUTCOMES}
            defaultValue="decline"
            aria-label="Outcome"
            className="w-fit"
          />
        </div>
      </div>

      <figure aria-label="Gross and net volume this year" className="flex items-start">
        <div className="flex h-[16.25rem] w-[3.5rem] shrink-0 flex-col justify-between text-right">
          {TICKS.map((tick) => (
            <span key={tick} className="typography-number-sm text-ws-static-subtle">
              {formatCount(tick)}
            </span>
          ))}
        </div>
        <div className="ml-ws-11 min-w-0 flex-1">
          <div className="mt-ws-7 relative h-[15rem]">
            {TICKS.map((tick) => (
              <div
                key={tick}
                className="border-ws-static-subtle inset-x-ws-0 absolute border-t"
                style={{ top: `${100 - (tick / MAX) * 100}%` }}
              />
            ))}
            <div className="h-ws-14 inset-x-ws-0 bottom-ws-0 absolute flex items-end gap-[3px]">
              {VOLUME.weeklyTransactions.map((count, week) => (
                <div
                  key={week}
                  className="bg-ws-static-alpha-base rounded-t-ws-control-sm flex-1"
                  style={{ height: `${(count / maxWeekly) * 100}%` }}
                />
              ))}
            </div>
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              preserveAspectRatio="none"
              aria-hidden
              className="inset-ws-0 absolute size-full overflow-visible"
            >
              <defs>
                <linearGradient
                  id={gradientId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                  className={SERIES.gross.color}
                >
                  <stop offset="0" stopColor="currentColor" stopOpacity={0.1} />
                  <stop offset="0.6" stopColor="currentColor" stopOpacity={0} />
                </linearGradient>
              </defs>
              <path
                d={`${toPath(gross)}L${WIDTH} ${HEIGHT}L0 ${HEIGHT}Z`}
                fill={`url(#${gradientId})`}
              />
              {(['net', 'gross'] as const).map((key) => {
                const points = key === 'gross' ? gross : net;
                const [lastX, lastY] = points[points.length - 1];
                return (
                  <g
                    key={key}
                    className={SERIES[key].color}
                    stroke="currentColor"
                    strokeOpacity={SERIES[key].opacity}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  >
                    <path d={toPath(points)} strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    <path
                      d={`M${lastX} ${lastY}h0`}
                      strokeWidth={10}
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="mt-ws-9 grid grid-cols-12 gap-[3px]">
            {VOLUME.axis.map((date) => (
              <span key={date} className="typography-label-sm text-ws-static-subtle text-center">
                {formatDay(date)}
              </span>
            ))}
          </div>
        </div>
      </figure>
    </section>
  );
}

/** A series' legend: its swatch and name, the total and its change. */
function Total({
  series,
  label,
  total,
  change,
}: {
  series: keyof typeof SERIES;
  label: string;
  total: number;
  change: number;
}) {
  return (
    <div className="gap-ws-3 flex flex-col">
      <div className="gap-ws-5 flex items-center">
        <svg aria-hidden viewBox="0 0 12 12" className={cn('size-ws-7', SERIES[series].color)}>
          <rect
            width="12"
            height="12"
            rx="2"
            fill="currentColor"
            fillOpacity={SERIES[series].opacity}
          />
        </svg>
        <span className="typography-label-sm text-ws-static-subtle">{label}</span>
      </div>
      <div className="gap-ws-5 flex items-baseline">
        <span className="typography-subtitle-md text-ws-static-strong tabular-nums">
          {formatUsdWhole(total)}
        </span>
        <Change value={change}>last year</Change>
      </div>
    </div>
  );
}
