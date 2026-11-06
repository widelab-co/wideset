import { cn } from '@wideset/react';

import { DISTRIBUTION } from './data';
import { formatPercent, formatUsd } from './format';

// Wideset has no data-visualisation colours yet: the closest non-semantic fills stand in.
const COLOR = {
  violet: {
    swatch: 'bg-ws-non-semantic-violet-strong',
    stroke: 'stroke-(--ws-non-semantic-fill-violet-strong)',
  },
  pink: {
    swatch: 'bg-ws-non-semantic-pink-strong',
    stroke: 'stroke-(--ws-non-semantic-fill-pink-strong)',
  },
  pinkSubtle: {
    swatch: 'bg-ws-non-semantic-pink-subtle',
    stroke: 'stroke-(--ws-non-semantic-fill-pink-subtle)',
  },
  neutral: { swatch: 'bg-ws-static-alpha-base', stroke: 'stroke-(--ws-static-fill-alpha-base)' },
};

// Donut geometry in its 174px box: a ring 18px wide.
const SIZE = 174;
const RING = 18;
const RADIUS = (SIZE - RING) / 2;

/** Holdings by asset: a donut and its legend. */
export function Distribution({ className }: { className?: string }) {
  let offset = 0;

  return (
    <section aria-labelledby="distribution-title" className={cn('flex flex-col', className)}>
      <h2 id="distribution-title" className="typography-subtitle-xs text-ws-static-base">
        Distribution
      </h2>

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden
        className="mt-ws-19 size-[10.875rem] shrink-0 self-center"
      >
        {DISTRIBUTION.map((item) => {
          const start = offset;
          offset += item.share;
          return (
            <circle
              key={item.name}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              strokeWidth={RING}
              pathLength={1}
              strokeDasharray={`${item.share} 1`}
              strokeDashoffset={-start}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              className={COLOR[item.color].stroke}
            />
          );
        })}
      </svg>

      <ul className="gap-ws-7 mt-auto flex flex-col">
        {DISTRIBUTION.map((item) => (
          <li key={item.name} className="gap-ws-6 flex items-center">
            <span
              aria-hidden
              className={cn('size-ws-7 rounded-ws-control-sm shrink-0', COLOR[item.color].swatch)}
            />
            <span className="typography-body-md text-ws-static-base flex-1">{item.name}</span>
            <span className="typography-number-sm text-ws-static-base w-[2rem] text-right">
              {formatPercent(item.share)}
            </span>
            <span className="typography-number-sm text-ws-static-subtle w-[6.25rem] text-right">
              {formatUsd(item.usd)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
