import { Button, Card } from '@wideset/react';

import { CONFIRM_ABOVE } from './data';
import { formatUsd } from './format';
import type { PaymentQuote, PaymentValues } from './payment';
import { PaymentFacts } from './payment-facts';

type PaymentReviewProps = {
  values: PaymentValues;
  quote: PaymentQuote;
  /** While the payment is on its way out: both buttons wait. */
  sending: boolean;
  onBack: () => void;
  onSend: () => void;
};

/**
 * The step before anything moves: the payment read back, then the way back and the page's one
 * filled button, which names what it does and how much. A payment over the limit says so beside
 * the buttons, since it will be asked about once more.
 */
export function PaymentReview({ values, quote, sending, onBack, onSend }: PaymentReviewProps) {
  const verb = quote.scheduled ? 'Schedule' : 'Send';

  return (
    <Card>
      {/* Card.Content keeps 10px free on its right for a scrollbar: the padding gives it back. */}
      <Card.Content contentClassName="pr-ws-6">
        <PaymentFacts values={values} quote={quote} />
      </Card.Content>
      <Card.Footer className="gap-ws-5 items-center justify-end">
        {quote.amount > CONFIRM_ABOVE && (
          <p className="typography-caption-md text-ws-static-subtle mr-auto">
            Over {formatUsd(CONFIRM_ABOVE)}, so we ask once more.
          </p>
        )}
        <Button size="sm" variant="secondary" preset="border" disabled={sending} onClick={onBack}>
          Back
        </Button>
        <Button size="sm" disabled={sending} onClick={onSend}>
          {sending ? 'Sending…' : `${verb} ${formatUsd(quote.amount)}`}
        </Button>
      </Card.Footer>
    </Card>
  );
}
