// TODO(custom): goal meter (figure against a target, a bar under it); ProgressBar's own label shows only a percentage.
import { cn, ProgressBar } from '@wideset/react';

import { formatShare } from './format';

type GoalMeterProps = {
  /** The figure so far and the target, formatted in the goal's unit: `$199,600`, `$300,000`. */
  figure: string;
  target: string;
  value: number;
  max: number;
  /** What the bar is the progress of, for its accessible name. */
  label: string;
  className?: string;
};

/**
 * The goal meter from the dashboard, at row size: the figure against its target and the share
 * reached on one line, one bar under it. The bar turns positive once the target is met.
 */
export function GoalMeter({ figure, target, value, max, label, className }: GoalMeterProps) {
  const met = value >= max;

  return (
    <div className={cn('gap-ws-4 flex min-w-0 flex-col', className)}>
      <div className="gap-ws-7 typography-label-sm flex items-baseline justify-between tabular-nums">
        <p className="min-w-0 truncate">
          <span className="text-ws-static-strong font-ws-medium">{figure}</span>{' '}
          <span className="text-ws-static-subtle">of {target}</span>
        </p>
        <p className="text-ws-static-base">{formatShare(Math.min(value / max, 1))}</p>
      </div>
      <ProgressBar
        value={Math.min(value, max)}
        max={max}
        variant={met ? 'success' : 'default'}
        aria-label={label}
        getValueLabel={() => `${figure} of ${target}`}
      />
    </div>
  );
}
