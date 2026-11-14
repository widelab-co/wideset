import { RiBarChartHorizontalFill, RiCloseLine, RiLineChartLine } from '@remixicon/react';
import { cn, IconButton, SegmentedControl, Tabs } from '@wideset/react';
import { useId } from 'react';

import { CARD_TYPES, MONTHLY_PERIOD, MONTHLY_VOLUME } from './data';
import { formatChange, formatDayPadded, formatUsd } from './format';

// Wideset has no data-visualisation colours yet: Figma's Gold and Brown become yellow and orange.
const CARD_COLOR = {
  blue: 'bg-ws-non-semantic-blue-strong',
  green: 'bg-ws-non-semantic-green-strong',
  yellow: 'bg-ws-non-semantic-yellow-strong',
  cyan: 'bg-ws-non-semantic-cyan-strong',
  pink: 'bg-ws-non-semantic-pink-strong',
  orange: 'bg-ws-non-semantic-orange-strong',
};

/** The side panel: this month's volume by tab, then volume by card type. */
export function VolumePanel({ onClose }: { onClose: () => void }) {
  return (
    <aside
      aria-labelledby="monthly-volume-title"
      className="bg-ws-static-alpha-subtle border-ws-static-subtle rounded-ws-container-lg my-ws-9 mr-ws-9 relative flex w-[27.5rem] shrink-0 flex-col overflow-y-auto border"
    >
      <IconButton
        variant="secondary"
        preset="border"
        size="sm"
        icon={RiCloseLine}
        aria-label="Close panel"
        onClick={onClose}
        className="top-ws-9 right-ws-9 absolute"
      />
      <h2
        id="monthly-volume-title"
        className="px-ws-14 pt-ws-14 typography-subtitle-md text-ws-static-strong"
      >
        Monthly Volume
      </h2>

      <Tabs size="lg" defaultValue="day-sale" className="mt-ws-7">
        <Tabs.List className="px-ws-14 w-full">
          {MONTHLY_VOLUME.map((tab) => (
            <Tabs.Item key={tab.value} value={tab.value}>
              <Tabs.Label>{tab.label}</Tabs.Label>
            </Tabs.Item>
          ))}
        </Tabs.List>
        {MONTHLY_VOLUME.map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value} className="px-ws-14 pt-ws-18">
            <p className="typography-title-md text-ws-static-strong tabular-nums">
              {formatUsd(tab.amount)}
            </p>
            <p className="mt-ws-9 typography-body-lg text-ws-static-subtle">
              This month {tab.noun} is {formatChange(tab.change)}
              <br />
              {tab.change >= 0 ? 'larger' : 'smaller'} than last month
            </p>
            <Sparkline series={tab.series} reference={tab.reference} className="mt-ws-14" />
          </Tabs.Content>
        ))}
      </Tabs>

      <section aria-labelledby="card-types-title" className="px-ws-14 pb-ws-18 mt-ws-26">
        <div className="flex items-center justify-between">
          <h3 id="card-types-title" className="typography-subtitle-sm text-ws-static-strong">
            Volume by Card Type
          </h3>
          <SegmentedControl size="sm" defaultValue="bars" aria-label="Chart type">
            <SegmentedControl.Item value="bars" icon={RiBarChartHorizontalFill} aria-label="Bars" />
            <SegmentedControl.Item value="line" icon={RiLineChartLine} aria-label="Line" />
          </SegmentedControl>
        </div>
        <ul className="mt-ws-11 gap-ws-9 flex flex-col">
          {CARD_TYPES.map((card) => (
            <li key={card.name} className="gap-ws-5 flex flex-col">
              <span
                aria-hidden
                className={cn('rounded-ws-control-full h-[3px]', CARD_COLOR[card.color])}
                style={{ width: `${card.share * 100}%` }}
              />
              <div className="typography-label-sm text-ws-static-base flex justify-between">
                <span>{card.name}</span>
                <span className="typography-number-sm tabular-nums">{formatUsd(card.amount)}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

const WIDTH = 376;
const HEIGHT = 104;
// The line keeps to the top 83px; the dates sit under the full box.
const LINE_HEIGHT = 83;

/** The month's series as a line, with its reference value marked by a dashed rule and a pill. */
function Sparkline({
  series,
  reference,
  className,
}: {
  series: number[];
  reference: number;
  className?: string;
}) {
  const gradientId = `sparkline-fill-${useId().replace(/[^\w-]/g, '')}`;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const y = (value: number) => ((max - value) / (max - min)) * LINE_HEIGHT;
  const path = series
    .map((value, index) => {
      const x = (index / (series.length - 1)) * WIDTH;
      return `${index ? 'L' : 'M'}${x.toFixed(1)} ${y(value).toFixed(1)}`;
    })
    .join('');
  const referenceY = y(reference);

  return (
    <figure aria-label="Daily values this month" className={className}>
      <div className="relative h-[6.5rem]">
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
              className="text-(--ws-static-fill-highlight-strong)"
            >
              <stop offset="0" stopColor="currentColor" />
              <stop offset="1" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={`${path}L${WIDTH} ${HEIGHT}L0 ${HEIGHT}Z`} fill={`url(#${gradientId})`} />
          <path
            d={path}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.5}
            strokeWidth={1.5}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="text-ws-static-subtle"
          />
          <line
            x1="0"
            x2={WIDTH}
            y1={referenceY}
            y2={referenceY}
            stroke="currentColor"
            strokeDasharray="2 4"
            vectorEffect="non-scaling-stroke"
            className="text-ws-static-strong"
          />
        </svg>
        <span
          className="bg-ws-static-inverse-background text-ws-static-inverse-strong typography-caption-strong-sm rounded-ws-control-full px-ws-5 py-ws-2 right-ws-0 absolute -translate-y-1/2 tabular-nums"
          style={{ top: `${(referenceY / HEIGHT) * 100}%` }}
        >
          {formatUsd(reference)}
        </span>
      </div>
      <div className="typography-label-sm text-ws-static-subtle flex justify-between">
        <span>{formatDayPadded(MONTHLY_PERIOD.from)}</span>
        <span>{formatDayPadded(MONTHLY_PERIOD.to)}</span>
      </div>
    </figure>
  );
}
