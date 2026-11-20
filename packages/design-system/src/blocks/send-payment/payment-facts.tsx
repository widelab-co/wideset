import { recipientById, recipientLabel, today } from './data';
import { type Fact, FactsList } from './facts-list';
import { formatDate, formatUsd } from './format';
import type { PaymentSummary, PaymentValues } from './payment';

type PaymentFactsProps = {
  values: PaymentValues;
  summary: PaymentSummary;
  /** The transfer's number, once it is sent: the receipt leads with it. */
  transferId?: string;
};

/**
 * The payment read back: who gets it and when, then the money, ending in what leaves the balance.
 * The review and the receipt show the same list, so what was checked is what the receipt says.
 */
export function PaymentFacts({ values, summary, transferId }: PaymentFactsProps) {
  const recipient = recipientById(values.recipientId);
  const reference = values.reference.trim();

  const details: Fact[] = [
    ...(transferId ? [{ label: 'Transfer number', value: transferId }] : []),
    { label: 'To', value: recipient ? recipientLabel(recipient) : '' },
    // "Today" belongs to the review; the receipt is a record, so it gives the date alone.
    {
      label: transferId && !summary.scheduled ? 'Sent' : 'Sends',
      value:
        summary.scheduled || transferId
          ? formatDate(summary.sendDate)
          : `Today, ${formatDate(today)}`,
    },
    ...(summary.arrival ? [{ label: 'Arrives', value: `By ${formatDate(summary.arrival)}` }] : []),
    ...(reference ? [{ label: 'Reference', value: reference }] : []),
  ];

  const money: Fact[] = [
    { label: 'Amount', value: formatUsd(summary.amount) },
    { label: 'Fee', value: formatUsd(summary.fee) },
    { label: 'Total debited', value: formatUsd(summary.total), strong: true },
  ];

  return <FactsList groups={[details, money]} />;
}
