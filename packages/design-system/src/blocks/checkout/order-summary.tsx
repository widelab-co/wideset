import { RiCloseLine } from '@remixicon/react';
import { Button, Card, Chip, InlineAlert } from '@wideset/react';
import { useEffect, useId, useRef } from 'react';

import {
  type Interval,
  type OrderTotals,
  plan,
  product,
  type Promo,
  receiptEmail,
  ROUTES,
  subscription,
  today,
  workspace,
} from './data';
import { formatDate, formatPercent, formatPeriod, formatUsd } from './format';
import { PromoCode } from './promo-code';
import { SummaryRow } from './summary-row';
import { TextLink } from './text-link';

/** Rows of one group, 12px apart. */
const ROWS = 'gap-ws-7 flex flex-col';
/** A group that opens under a line. */
const RULED = 'border-ws-static-base pt-ws-11 border-t';

export type PaymentState = 'idle' | 'paying' | 'paid';

type OrderSummaryProps = {
  totals: OrderTotals;
  interval: Interval;
  promo: Promo | null;
  onPromoChange: (promo: Promo | null) => void;
  payment: PaymentState;
  onPay: () => void;
};

/**
 * What the order comes to, beside the order and always in view: every line with its amount, the
 * promo code, what the unused time on the old plan takes off, the VAT, the total due today and
 * the next charge. It ends in the page's one filled button, which carries the amount. Paying
 * keeps the button in place, busy, then swaps it for the confirmation and the way to the receipt.
 */
export function OrderSummary({
  totals,
  interval,
  promo,
  onPromoChange,
  payment,
  onPay,
}: OrderSummaryProps) {
  const titleId = useId();
  const receiptLink = useRef<HTMLAnchorElement>(null);
  const period = interval === 'yearly' ? 'year' : 'month';
  const total = formatUsd(totals.total);

  // The button a keyboard user pressed is gone once the payment is in: hand focus to what follows.
  useEffect(() => {
    if (payment === 'paid') receiptLink.current?.focus();
  }, [payment]);

  return (
    <Card role="region" aria-labelledby={titleId}>
      <Card.Header>
        <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
          Summary
        </h2>
      </Card.Header>
      {/* Card.Content keeps 10px free on the right for a scrollbar; the padding gives it back, so
          the amounts end on the button's edge. */}
      <Card.Content contentClassName="pr-ws-6">
        <div className="gap-ws-11 flex flex-col">
          <dl className={ROWS}>
            {totals.lines.map((line) => (
              <SummaryRow
                key={line.id}
                label={line.label}
                detail={
                  line.id === 'plan'
                    ? `${line.detail} × ${formatUsd(totals.seatPrice)}${totals.months > 1 ? ` × ${totals.months} months` : ''}`
                    : totals.months > 1
                      ? `${totals.months} months`
                      : undefined
                }
                amount={formatUsd(line.amount)}
              />
            ))}
          </dl>

          <div className={`${RULED} ${ROWS}`}>
            <dl className={ROWS}>
              <SummaryRow label="Subtotal" amount={formatUsd(totals.subtotal)} />
            </dl>
            {/* The field and the line it turns into share one place, so applying a code changes
                nothing around it. */}
            {!promo && payment !== 'paid' && <PromoCode onApply={onPromoChange} />}
            <dl className={ROWS}>
              {promo && (
                <SummaryRow
                  label={
                    <>
                      Promo code
                      <Chip
                        size="sm"
                        variant="secondary"
                        style="border"
                        aria-label={`Remove promo code ${promo.code}`}
                        disabled={payment !== 'idle'}
                        onClick={() => onPromoChange(null)}
                      >
                        {promo.code}
                        <Chip.Icon icon={RiCloseLine} />
                      </Chip>
                    </>
                  }
                  detail={`${formatPercent(promo.rate)} off the first ${period}`}
                  amount={formatUsd(-totals.discount)}
                />
              )}
              <SummaryRow
                label={`Unused time on ${subscription.plan}`}
                detail={formatPeriod(today, subscription.periodEnd)}
                amount={formatUsd(-totals.credit)}
              />
              <SummaryRow
                label={`VAT ${formatPercent(totals.vatRate)}${totals.vatRate ? '' : ', reverse charge'}`}
                amount={formatUsd(totals.vat)}
              />
            </dl>
          </div>

          <div className={`${RULED} gap-ws-3 flex flex-col`}>
            <dl>
              <SummaryRow
                strong
                label={payment === 'paid' ? 'Paid today' : 'Total due today'}
                amount={total}
              />
            </dl>
            <p className="typography-caption-md text-ws-static-subtle tabular-nums">
              Then {formatUsd(totals.nextCharge.amount)} a {period} from{' '}
              {formatDate(totals.nextCharge.date)}.
            </p>
          </div>
        </div>
      </Card.Content>
      <Card.Footer>
        {payment === 'paid' ? (
          <InlineAlert
            status="success"
            orientation="vertical"
            persistent
            title="Payment received"
            message={`${workspace.name} is on ${plan.name} now. The receipt is on its way to ${receiptEmail}.`}
          >
            <InlineAlert.Action asChild>
              <a ref={receiptLink} href={ROUTES.receipt}>
                View receipt
              </a>
            </InlineAlert.Action>
          </InlineAlert>
        ) : (
          <div className="gap-ws-7 flex w-full flex-col">
            <Button size="sm" className="w-full" disabled={payment === 'paying'} onClick={onPay}>
              {payment === 'paying' ? 'Paying…' : `Pay ${total}`}
            </Button>
            <p className="typography-caption-md text-ws-static-subtle text-center">
              Cancel any time. By paying you agree to {product.name}’s{' '}
              <TextLink href={ROUTES.terms}>terms</TextLink>.
            </p>
          </div>
        )}
      </Card.Footer>
    </Card>
  );
}
