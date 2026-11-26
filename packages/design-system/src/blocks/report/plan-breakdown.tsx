// TODO(custom): bar list (bar behind a label, value and share on the right); no BarList in Wideset.
import { cn } from '@wideset/react';
import { useId } from 'react';

import { formatShare, formatUsd } from './format';

type Plan = { id: string; label: string; mrr: number };

/**
 * MRR at the close of the range by plan, largest first: each bar is the plan's MRR against the
 * largest plan, drawn behind its name, with its share of the total beside the amount.
 */
export function PlanBreakdown({ plans, className }: { plans: Plan[]; className?: string }) {
  const titleId = useId();
  const total = plans.reduce((sum, plan) => sum + plan.mrr, 0);
  const sorted = [...plans].sort((a, b) => b.mrr - a.mrr);
  const max = sorted[0]?.mrr || 1;

  return (
    <section aria-labelledby={titleId} className={cn('gap-ws-11 flex flex-col', className)}>
      <h2 id={titleId} className="typography-subtitle-xs text-ws-static-strong">
        MRR by plan
      </h2>
      {/* Four 40px rows 16px apart span the 13rem plot beside them. */}
      <ul className="gap-ws-9 flex flex-col">
        {sorted.map((plan) => (
          <li key={plan.id} className="h-ws-16 gap-ws-9 flex items-center">
            <div className="h-ws-14 relative flex min-w-0 flex-1 items-center">
              <svg aria-hidden className="inset-ws-0 absolute size-full">
                <rect
                  width={`${(plan.mrr / max) * 100}%`}
                  height="100%"
                  rx="6"
                  className="fill-(--ws-static-fill-alpha-base)"
                />
              </svg>
              <span className="px-ws-5 typography-label-sm text-ws-static-base relative truncate">
                {plan.label}
              </span>
            </div>
            <span className="typography-label-sm text-ws-static-strong w-[5.5rem] text-right tabular-nums">
              {formatUsd(plan.mrr)}
            </span>
            <span className="typography-label-sm text-ws-static-subtle w-[2.5rem] text-right tabular-nums">
              {formatShare(plan.mrr / total)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
