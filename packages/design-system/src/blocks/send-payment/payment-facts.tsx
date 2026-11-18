import { recipientById, recipientLabel, today } from './data';
import { type Fact, FactsList } from './facts-list';
import { formatDate, formatUsd } from './format';
import type { PaymentQuote, PaymentValues } from './payment';

type PaymentFactsProps = {
  values: PaymentValues;
  quote: PaymentQuote;
  /** The transfer's number, once it is sent: the receipt leads with it. */
  transferId?: string;
};

/**
 * The payment read back: who gets it and when, then the money, ending in what leaves the balance.
 * The review and the receipt show the same list, so what was checked is what the receipt says.
 */
export function PaymentFacts({ values, quote, transferId }: PaymentFactsProps) {
  const recipient = recipientById(values.recipientId);
  const reference = values.reference.trim();

  const details: Fact[] = [
    ...(transferId ? [{ label: 'Transfer number', value: transferId }] : []),
    { label: 'To', value: recipient ? recipientLabel(recipient) : '' },
    // "Today" belongs to the review; the receipt is a record, so it gives the date alone.
    {
      label: transferId && !quote.scheduled ? 'Sent' : 'Sends',
      value:
        quote.scheduled || transferId ? formatDate(quote.sendDate) : `Today, ${formatDate(today)}`,
    },
    { label: 'Arrives', value: `By ${formatDate(quote.arrival)}` },
    ...(reference ? [{ label: 'Reference', value: reference }] : []),
  ];

  const money: Fact[] = [
    { label: 'Amount', value: formatUsd(quote.amount) },
    { label: 'Fee', value: formatUsd(quote.fee) },
    { label: 'Total debited', value: formatUsd(quote.total), strong: true },
  ];

  return <FactsList groups={[details, money]} />;
}
