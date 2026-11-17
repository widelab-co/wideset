import { Button, Card } from '@wideset/react';

import { ROUTES } from './data';
import type { PaymentQuote, PaymentValues } from './payment';
import { PaymentFacts } from './payment-facts';

type PaymentReceiptProps = {
  values: PaymentValues;
  quote: PaymentQuote;
  transferId: string;
  onSendAnother: () => void;
};

/**
 * The receipt the page becomes once the payment is out: the list that was reviewed, now led by
 * the transfer's number, and the two ways on. Its status sits beside the page's title.
 */
export function PaymentReceipt({ values, quote, transferId, onSendAnother }: PaymentReceiptProps) {
  return (
    <Card>
      {/* Card.Content keeps 10px free on its right for a scrollbar: the padding gives it back. */}
      <Card.Content contentClassName="pr-ws-6">
        <PaymentFacts values={values} quote={quote} transferId={transferId} />
      </Card.Content>
      <Card.Footer className="gap-ws-5 justify-end">
        <Button size="sm" variant="secondary" preset="border" onClick={onSendAnother}>
          Send another
        </Button>
        <Button asChild size="sm">
          <a href={ROUTES.transfers}>View transfers</a>
        </Button>
      </Card.Footer>
    </Card>
  );
}
