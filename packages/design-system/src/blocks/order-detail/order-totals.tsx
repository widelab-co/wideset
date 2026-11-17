// TODO(custom): order totals (label and amount rows, the total under a line); no DescriptionList in Wideset.
import { cn } from '@wideset/react';

import { order, subtotal, total, vatAmount } from './data';
import { formatPercent, formatUsd } from './format';

type RowProps = { label: string; value: number; strong?: boolean };

/**
 * A label and its amount on one row; `strong` for the figure the reader is after, which also
 * opens a group under a line. The line is the row's own border: a `dl` holds only its rows.
 */
function Row({ label, value, strong }: RowProps) {
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
      <dt className={strong ? type : 'typography-body-md text-ws-static-subtle'}>{label}</dt>
      <dd className={`${type} tabular-nums`}>{formatUsd(value)}</dd>
    </div>
  );
}

/**
 * What the order comes to, under the amounts it adds up: the goods, getting them there, the
 * VAT and the total, then what has gone back since. Every figure comes from `data.ts`, so the
 * rows always add up.
 */
export function OrderTotals({ refunded }: { refunded: number }) {
  return (
    <dl className="gap-ws-7 flex flex-col">
      <Row label="Subtotal" value={subtotal} />
      <Row label="Shipping" value={order.shipping.price} />
      <Row label={`VAT ${formatPercent(order.vatRate)}`} value={vatAmount} />
      <Row label="Total" value={total} strong />
      {refunded > 0 && <Row label="Refunded" value={-refunded} />}
    </dl>
  );
}
