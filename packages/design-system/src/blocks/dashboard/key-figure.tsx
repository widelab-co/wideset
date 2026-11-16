// TODO(custom): key figure (label, figure, change badge, what it changed from); no stat or KpiCard component in Wideset.
import { RiArrowDownLine, RiArrowUpLine } from '@remixicon/react';
import { cn, StatusBadge } from '@wideset/react';

export type KeyFigureProps = {
  label: string;
  /** The figure, formatted: `$149,000`, `14`, `40.0%`. */
  value: string;
  /** The change against the period before, formatted and unsigned: `12.0%`, `3.6 pts`. */
  change: string;
  direction: 'up' | 'down';
  /** What the change is measured against: `from $133,000`. */
  comparison: string;
  className?: string;
};

/**
 * A key figure: what it measures, the number, and how it moved against the period before. One
 * visual per value: the change badge, and nothing else. Every figure here is better when it
 * rises, so up is positive and down negative; a figure that is better falling (churn) flips that.
 */
export function KeyFigure({
  label,
  value,
  change,
  direction,
  comparison,
  className,
}: KeyFigureProps) {
  const up = direction === 'up';

  return (
    <div className={cn('gap-ws-5 flex min-w-0 flex-col', className)}>
      <div className="gap-ws-3 flex flex-col">
        <p className="typography-label-sm text-ws-static-subtle">{label}</p>
        <p className="typography-title-md text-ws-static-strong tabular-nums">{value}</p>
      </div>
      <div className="gap-ws-5 flex items-center">
        <StatusBadge size="sm" color={up ? 'positive' : 'negative'}>
          <StatusBadge.Icon icon={up ? RiArrowUpLine : RiArrowDownLine} />
          <StatusBadge.Label>
            <span className="sr-only">{up ? 'Up' : 'Down'} </span>
            {change}
          </StatusBadge.Label>
        </StatusBadge>
        <span className="typography-label-sm text-ws-static-subtle truncate tabular-nums">
          {comparison}
        </span>
      </div>
    </div>
  );
}
