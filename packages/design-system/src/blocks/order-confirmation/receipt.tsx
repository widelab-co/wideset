import { RiDownload2Line } from '@remixicon/react';
import { Button, Card } from '@wideset/react';
import { useId } from 'react';

import { order } from './data';
import { formatDate, formatUsd } from './format';
import { KeyValue } from './key-value';
import { OrderTotals } from './order-totals';

/**
 * The receipt: the proof of the purchase, in one bordered card. The facts that identify the order
 * come first, the money under a line, and the two things to do with a receipt sit in the header as
 * secondary actions, so the page keeps its one filled button for the way on.
 */
export function Receipt() {
  const titleId = useId();

  return (
    <Card role="region" aria-labelledby={titleId}>
      <Card.Header>
        <div className="gap-ws-9 flex flex-wrap items-center justify-between">
          <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
            Receipt
          </h2>
          <Card.Action className="gap-ws-5">
            <Button size="sm" variant="secondary" preset="ghost">
              View invoice
            </Button>
            <Button size="sm" variant="secondary" preset="border">
              <Button.Icon icon={RiDownload2Line} />
              Download receipt
            </Button>
          </Card.Action>
        </div>
      </Card.Header>
      {/* Card.Content keeps 10px free on its right for a scrollbar: the padding gives it back. */}
      <Card.Content contentClassName="pr-ws-6">
        <div className="gap-ws-11 flex flex-col">
          <dl className="gap-ws-11 grid grid-cols-2 sm:grid-cols-3">
            <KeyValue label="Order number">{order.number}</KeyValue>
            <KeyValue label="Date">{formatDate(order.placed)}</KeyValue>
            <KeyValue label="Payment method">
              {order.card.brand} ending {order.card.last4}
            </KeyValue>
            <KeyValue label="Plan">
              {order.plan.name}, {order.interval.toLowerCase()}
            </KeyValue>
            <KeyValue label="Seats">{order.seats}</KeyValue>
            <KeyValue label="Price">{formatUsd(order.plan.seatPrice)} a seat a month</KeyValue>
          </dl>
          <div className="border-ws-static-base pt-ws-11 border-t">
            <OrderTotals />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
