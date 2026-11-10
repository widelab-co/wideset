// TODO(custom): key figure card, version 02 (figure, sparkline, progress to target); no KpiCard in Wideset yet.
import { cn, ProgressBar } from '@wideset/react';

import { Sparkline } from './sparkline';

export type KpiCardProps = {
  label: string;
  /** The figure, formatted: `$412,300`, `38`. */
  value: string;
  /** The figure as a share of its target; above 1 once the target is met. */
  progress: number;
  /** The share and the target, formatted: `82% of $500K`. */
  target: string;
  /** What is left to reach the target, formatted: `$87.7K to go`. */
  remaining: string;
  /** The figure period by period, oldest first, for the sparkline. */
  trend: number[];
  className?: string;
};

/**
 * A key figure measured against its target: the number with its recent trend, and how far it is
 * to the target. The bar turns positive only once the target is met.
 */
export function KpiCard({
  label,
  value,
  progress,
  target,
  remaining,
  trend,
  className,
}: KpiCardProps) {
  return (
    <div
      className={cn(
        'bg-ws-static-foreground rounded-ws-container-md p-ws-11 gap-ws-9 flex flex-col',
        className,
      )}
    >
      <div className="gap-ws-9 flex items-end justify-between">
        <div className="gap-ws-3 flex min-w-0 flex-col">
          <p className="typography-label-sm text-ws-static-subtle">{label}</p>
          <p className="typography-subtitle-lg text-ws-static-strong tabular-nums">{value}</p>
        </div>
        <Sparkline values={trend} className="h-ws-14 mb-ws-3 w-[4.5rem] shrink-0" />
      </div>
      <div className="gap-ws-5 flex flex-col">
        <ProgressBar
          value={Math.min(progress, 1) * 100}
          variant={progress >= 1 ? 'success' : 'default'}
          aria-label={`${label}: ${target}`}
        />
        <div className="typography-caption-md gap-ws-5 flex justify-between tabular-nums">
          <span className="text-ws-static-base">{target}</span>
          <span className="text-ws-static-subtle">{remaining}</span>
        </div>
      </div>
    </div>
  );
}
