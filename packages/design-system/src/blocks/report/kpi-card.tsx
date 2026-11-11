// TODO(custom): key figure card, version 01 (figure, delta, comparison); no KpiCard in Wideset yet.
import { RiArrowDownLine, RiArrowUpLine } from '@remixicon/react';
import { cn, StatusBadge } from '@wideset/react';

export type KpiCardProps = {
  label: string;
  /** The figure, formatted: `$897,873`, `2,056`. */
  value: string;
  /** The change against the comparison, formatted and unsigned (`11.0%`); left out without one. */
  change?: string;
  direction: 'up' | 'down';
  /** Whether the change is good news. It picks the colour; the arrow follows `direction`. */
  good: boolean;
  /** What the change is measured against, e.g. `from $728,506`. */
  comparison: string;
  className?: string;
};

/**
 * A key figure: what it measures, the number, and how it moved against the comparison. The colour
 * of the change follows its meaning, not its direction: churned MRR going down is green.
 */
export function KpiCard({
  label,
  value,
  change,
  direction,
  good,
  comparison,
  className,
}: KpiCardProps) {
  const Arrow = direction === 'up' ? RiArrowUpLine : RiArrowDownLine;

  return (
    <div className={cn('gap-ws-5 flex flex-col', className)}>
      <div className="gap-ws-3 flex flex-col">
        <p className="typography-label-sm text-ws-static-subtle">{label}</p>
        <p className="typography-subtitle-md text-ws-static-strong tabular-nums">{value}</p>
      </div>
      <div className="gap-ws-5 flex items-center">
        {change && (
          <StatusBadge size="sm" color={good ? 'positive' : 'negative'}>
            <StatusBadge.Icon icon={Arrow} />
            <StatusBadge.Label>
              <span className="sr-only">{direction === 'up' ? 'Up' : 'Down'} </span>
              {change}
            </StatusBadge.Label>
          </StatusBadge>
        )}
        <span className="typography-label-sm text-ws-static-subtle tabular-nums">{comparison}</span>
      </div>
    </div>
  );
}
