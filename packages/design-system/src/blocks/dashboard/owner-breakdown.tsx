// TODO(custom): bar list (a bar per row against the largest, the label on it, the amount beside it); no BarList in Wideset, and no data-viz colour tokens (uses the chart's non-semantic blue).
import { cn } from '@wideset/react';
import { useId } from 'react';

import { formatUsd } from './format';

type Owner = { id: string; name: string; revenue: number };

/**
 * Revenue by the deal's owner, largest first. Each row is its own bar, the owner's revenue
 * against the largest: a pale fill in the revenue chart's blue, the name on it and the amount
 * beside it. Fills, not lines, so the list reads as a chart and not as rules under the names, and
 * the blue ties it to the period's line above.
 */
export function OwnerBreakdown({ owners, className }: { owners: Owner[]; className?: string }) {
  const titleId = useId();
  const sorted = [...owners].sort((a, b) => b.revenue - a.revenue);
  const max = sorted[0]?.revenue || 1;

  return (
    <section aria-labelledby={titleId} className={cn('gap-ws-9 flex flex-col', className)}>
      <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
        Revenue by owner
      </h2>
      <ul className="gap-ws-3 typography-label-sm flex flex-col">
        {sorted.map((owner) => (
          <li key={owner.id} className="gap-ws-9 flex items-center">
            <div className="h-ws-14 relative min-w-0 flex-1">
              <svg aria-hidden className="inset-ws-0 absolute size-full">
                <rect
                  width={`${(owner.revenue / max) * 100}%`}
                  height="100%"
                  rx="4"
                  className="fill-(--ws-non-semantic-fill-blue-subtle)"
                />
              </svg>
              <span className="px-ws-5 text-ws-static-strong relative flex h-full items-center truncate">
                {owner.name}
              </span>
            </div>
            <span className="text-ws-static-strong w-[4.5rem] shrink-0 text-right tabular-nums">
              {formatUsd(owner.revenue)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
