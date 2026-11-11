// TODO(custom): invoice totals (label and amount rows, ruled into groups); no DescriptionList in Wideset.
import { cn } from '@wideset/react';

import { amountDue, amountPaid, invoice, subtotal, total, vatAmount } from './data';
import { formatPercent, formatUsd } from './format';

type RowProps = { label: string; value: number; strong?: boolean };

/**
 * A label and its amount on one row; `strong` for the figures the reader is after, which also
 * open a group under a line. The line is the row's own border: a `dl` holds only its rows.
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
 * The sums under the lines: what they come to, the VAT on top, the total, what was paid and what
 * is left to pay. Every figure is worked out from the lines in `data.ts`.
 */
export function InvoiceTotals() {
  return (
    <dl className="gap-ws-7 flex flex-col">
      <Row label="Subtotal" value={subtotal} />
      <Row
        label={`VAT ${formatPercent(invoice.vat.rate)}, ${invoice.vat.label}`}
        value={vatAmount}
      />
      <Row label="Total" value={total} strong />
      <Row label="Amount paid" value={amountPaid} />
      <Row label="Amount due" value={amountDue} strong />
    </dl>
  );
}
