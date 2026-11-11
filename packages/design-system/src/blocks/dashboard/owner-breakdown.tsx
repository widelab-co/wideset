// TODO(custom): bar list (label, amount, a 4px bar against the largest); no BarList in Wideset.
import { cn } from '@wideset/react';
import { useId } from 'react';

import { formatUsd } from './format';

type Owner = { id: string; name: string; revenue: number };

/**
 * Revenue by the deal's owner, largest first: each bar is the owner's revenue against the
 * largest. The bars are neutral and 4px, the thickness of `ProgressBar`, so every bar on the
 * page has one weight and the goal's is the only one in colour.
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
      <ul className="gap-ws-7 flex flex-col">
        {sorted.map((owner) => (
          <li key={owner.id} className="gap-ws-3 flex flex-col">
            <div className="typography-label-sm gap-ws-5 flex items-baseline justify-between">
              <span className="text-ws-static-base truncate">{owner.name}</span>
              <span className="text-ws-static-strong tabular-nums">{formatUsd(owner.revenue)}</span>
            </div>
            <svg aria-hidden className="h-ws-3 w-full">
              <rect
                width={`${(owner.revenue / max) * 100}%`}
                height="100%"
                rx="2"
                className="fill-(--ws-semantic-stroke-neutral)"
              />
            </svg>
          </li>
        ))}
      </ul>
    </section>
  );
}
