// TODO(custom): goal meter (figure against a target, bar, what is left); ProgressBar's own label shows only a percentage.
import { cn, ProgressBar } from '@wideset/react';
import { useId } from 'react';

import { formatCount, formatShare, formatUsd } from './format';

type GoalProgressProps = {
  label: string;
  revenue: number;
  target: number;
  daysLeft: number;
  className?: string;
};

/**
 * Progress to the quarter's goal: the revenue so far against the target, one bar, then what is
 * left as plain facts. The bar turns positive once the goal is met.
 */
export function GoalProgress({ label, revenue, target, daysLeft, className }: GoalProgressProps) {
  const titleId = useId();
  const met = revenue >= target;
  const toGo = Math.max(target - revenue, 0);
  // What is left: the money, the time, and the pace that closes the gap in that time.
  const left = [
    ['To go', formatUsd(toGo)],
    ['Days left in the quarter', formatCount(daysLeft)],
    ['Needed a week', formatUsd(daysLeft > 0 ? toGo / (daysLeft / 7) : toGo)],
  ];

  return (
    <section aria-labelledby={titleId} className={cn('gap-ws-9 flex flex-col', className)}>
      <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
        {label}
      </h2>
      <div className="gap-ws-7 flex flex-col">
        <div className="gap-ws-9 flex items-baseline justify-between tabular-nums">
          <p className="gap-ws-5 flex items-baseline">
            <span className="typography-subtitle-md text-ws-static-strong">
              {formatUsd(revenue)}
            </span>
            <span className="typography-body-md text-ws-static-subtle">of {formatUsd(target)}</span>
          </p>
          <p className="typography-label-sm text-ws-static-base">{formatShare(revenue / target)}</p>
        </div>
        <ProgressBar
          value={Math.min(revenue, target)}
          max={target}
          variant={met ? 'success' : 'default'}
          aria-labelledby={titleId}
          getValueLabel={() => `${formatUsd(revenue)} of ${formatUsd(target)}`}
        />
      </div>
      <dl className="gap-ws-5 typography-label-sm flex flex-col tabular-nums">
        {left.map(([term, value]) => (
          <div key={term} className="gap-ws-9 flex justify-between">
            <dt className="text-ws-static-subtle">{term}</dt>
            <dd className="text-ws-static-strong">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
