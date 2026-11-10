import { RiErrorWarningLine, RiMastercardLine } from '@remixicon/react';
import { Button, Card } from '@wideset/react';

import { billingDetails, card, today } from './data';
import { formatDate, formatExpiry } from './format';
import { KeyValue } from './key-value';

/** Months from today's month to the card's expiry month: 0 = expires this month. */
const monthsLeft = (yearMonth: string) => {
  const [year, month] = yearMonth.split('-').map(Number);
  const [nowYear, nowMonth] = today.split('-').map(Number);
  return (year - nowYear) * 12 + (month - nowMonth);
};

/**
 * How the workspace pays: the card (brand, last four, expiry) and where invoices go. Within two
 * months of expiring, a line says which charge the card will miss.
 */
export function PaymentMethod() {
  const left = monthsLeft(card.expires);

  return (
    <Card>
      <Card.Header>
        <div className="gap-ws-9 flex items-start justify-between">
          <h2 className="typography-subtitle-xs text-ws-static-strong">Payment method</h2>
          <Card.Action>
            <Button size="sm" variant="secondary" preset="border">
              Update card
            </Button>
          </Card.Action>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="gap-ws-12 flex flex-col">
          <div className="gap-ws-5 flex flex-col">
            <div className="gap-ws-5 flex items-center">
              {/* The brand as a Remix icon on a card-shaped chip; no logo artwork. */}
              <span className="border-ws-static-base rounded-ws-control-md h-ws-14 w-ws-18 flex shrink-0 items-center justify-center border">
                <RiMastercardLine aria-hidden="true" className="size-ws-11 text-ws-static-strong" />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="typography-label-strong-sm text-ws-static-strong">
                  {card.brand} ending {card.last4}
                </span>
                <span className="typography-caption-md text-ws-static-subtle tabular-nums">
                  Expires {formatExpiry(card.expires)}
                </span>
              </div>
            </div>
            {left <= 1 && (
              <p className="typography-caption-md text-ws-semantic-notice gap-ws-3 flex items-start">
                <RiErrorWarningLine aria-hidden="true" className="size-ws-8 shrink-0" />
                <span>
                  {left === 0 ? 'Expires this month.' : 'Expires next month.'} Update it before the
                  charge on {formatDate(card.firstChargeAfterExpiry)}.
                </span>
              </p>
            )}
          </div>
          <dl className="gap-ws-11 flex flex-col">
            <KeyValue label="Invoices go to">{billingDetails.email}</KeyValue>
            <KeyValue label="Billing address">
              {[billingDetails.company, ...billingDetails.address].map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </KeyValue>
          </dl>
        </div>
      </Card.Content>
    </Card>
  );
}
