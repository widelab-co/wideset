import { RiCheckLine } from '@remixicon/react';
import { StatusBadge } from '@wideset/react';

import { nextChargeAmount, order, workspace } from './data';
import { formatDate, formatUsd } from './format';

/**
 * The confirmation itself: a small mark in the positive colour (a judgement: it worked), a title
 * that says what happened, and one line with what happens next. The mark is an icon-only
 * `StatusBadge`, not a drawing: a confirmation is a quiet page.
 */
export function ConfirmationHeader() {
  return (
    <header className="gap-ws-9 flex flex-col items-start">
      <StatusBadge
        color="positive"
        emphasis="high"
        size="lg"
        shape="rounded"
        role="img"
        aria-label="Confirmed"
      >
        <StatusBadge.Icon icon={RiCheckLine} />
      </StatusBadge>
      <div className="gap-ws-2 flex flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">
          {workspace.name} is now on {order.plan.name}
        </h1>
        <p className="typography-body-md text-ws-static-subtle tabular-nums">
          All {order.seats} seats moved from {order.previous.name} today. Your next charge is{' '}
          {formatUsd(nextChargeAmount)} on {formatDate(order.nextCharge)}.
        </p>
      </div>
    </header>
  );
}
