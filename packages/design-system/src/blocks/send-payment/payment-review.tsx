import { Button, Card } from '@wideset/react';

import { formatUsd } from './format';
import type { PaymentSummary, PaymentValues } from './payment';
import { PaymentFacts } from './payment-facts';

type PaymentReviewProps = {
  values: PaymentValues;
  summary: PaymentSummary;
  /** While the payment is on its way out: both buttons wait. */
  sending: boolean;
  onBack: () => void;
  onSend: () => void;
};

/**
 * The step before anything moves: the payment read back, then the way back and the page's one
 * filled button, which names what it does and how much.
 */
export function PaymentReview({ values, summary, sending, onBack, onSend }: PaymentReviewProps) {
  const verb = summary.scheduled ? 'Schedule' : 'Send';

  return (
    <Card>
      {/* Card.Content keeps 10px free on its right for a scrollbar: the padding gives it back. */}
      <Card.Content contentClassName="pr-ws-6">
        <PaymentFacts values={values} summary={summary} />
      </Card.Content>
      <Card.Footer className="gap-ws-5 items-center justify-end">
        <Button size="sm" variant="secondary" preset="border" disabled={sending} onClick={onBack}>
          Back
        </Button>
        <Button size="sm" disabled={sending} onClick={onSend}>
          {sending ? 'Sending…' : `${verb} ${formatUsd(summary.amount)}`}
        </Button>
      </Card.Footer>
    </Card>
  );
}
