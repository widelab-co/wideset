// TODO(custom): goal meter (a count against a target, one bar, what is left); ProgressBar's own label shows only a percentage.
import { cn, ProgressBar } from '@wideset/react';
import { useId } from 'react';

type RewardProgressProps = {
  label: string;
  /** How far it has got, and how far it has to go: `3` of `5`. */
  value: number;
  target: number;
  /** What is counted, after the target: `teams subscribed`. */
  unit: string;
  /** What is left and what it earns: one line. */
  note: string;
  className?: string;
};

/**
 * Progress to the next reward, drawn like the key figures beside it: the count against its
 * target, then one bar, then what is left in words. It is the only bar in the row, so the eye
 * lands on the one figure that is still moving.
 */
export function RewardProgress({
  label,
  value,
  target,
  unit,
  note,
  className,
}: RewardProgressProps) {
  const labelId = useId();

  return (
    <div className={cn('gap-ws-5 flex min-w-0 flex-col', className)}>
      <div className="gap-ws-3 flex flex-col">
        <p id={labelId} className="typography-label-sm text-ws-static-subtle">
          {label}
        </p>
        <p className="gap-ws-5 flex items-baseline tabular-nums">
          <span className="typography-subtitle-md text-ws-static-strong">{value}</span>
          <span className="typography-body-md text-ws-static-subtle">
            of {target} {unit}
          </span>
        </p>
      </div>
      <ProgressBar
        value={Math.min(value, target)}
        max={target}
        aria-labelledby={labelId}
        getValueLabel={() => `${value} of ${target} ${unit}`}
      />
      <p className="typography-label-sm text-ws-static-subtle tabular-nums">{note}</p>
    </div>
  );
}
