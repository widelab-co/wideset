// TODO(custom): order totals (label and amount rows, the total under a line); no DescriptionList in Wideset.
import { cn } from '@wideset/react';
import type { ReactNode } from 'react';

import { daysInPeriod, daysLeft, order, seatDifference, subtotal, total, vatAmount } from './data';
import { formatDays, formatPercent, formatUsd } from './format';

type RowProps = {
  label: string;
  /** How the amount comes about, under the label. */
  detail?: ReactNode;
  value: number;
  /** The figure the reader is after: it opens its own group under a line. */
  strong?: boolean;
};

/** A label and its amount on one row. The line is the row's own border: a `dl` holds only rows. */
function Row({ label, detail, value, strong }: RowProps) {
  const type = strong
    ? 'typography-label-strong-md text-ws-static-strong'
    : 'typography-body-md text-ws-static-base';
  return (
    <div
      className={cn(
        'gap-ws-9 flex items-baseline justify-between',
        strong && 'border-ws-static-base pt-ws-7 border-t',
      )}
    >
      <dt className={cn('gap-ws-2 flex min-w-0 flex-col', type)}>
        {label}
        {detail && (
          <span className="typography-caption-md text-ws-static-subtle tabular-nums">{detail}</span>
        )}
      </dt>
      <dd className={cn(type, 'tabular-nums')}>{formatUsd(value)}</dd>
    </div>
  );
}

/**
 * What was charged: the upgrade for the days left in the period, with how it is worked out, the
 * VAT, and the total. Every figure comes from `data.ts`, so the rows always add up.
 */
export function OrderTotals() {
  return (
    <dl className="gap-ws-7 flex flex-col">
      <Row
        label={`Upgrade to ${order.plan.name}, ${formatDays(order.placed, order.period.to)}`}
        detail={`${order.seats} seats × ${formatUsd(seatDifference)} more than ${order.previous.name}, ${daysLeft} of ${daysInPeriod} days`}
        value={subtotal}
      />
      <Row label={`VAT ${formatPercent(order.vat.rate)}, ${order.vat.label}`} value={vatAmount} />
      <Row label="Total paid" value={total} strong />
    </dl>
  );
}
