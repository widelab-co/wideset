// TODO(custom): page header for a confirmation (a large status mark, the title, one line); no PageHeader in Wideset, and an icon-only StatusBadge stops at 28px.
import { RiCheckLine } from '@remixicon/react';

import { nextChargeAmount, order, workspace } from './data';
import { formatDate, formatUsd } from './format';

/**
 * The confirmation itself, centred over the receipt: a check in the positive colour (a judgement:
 * it worked), a title that says what happened, and one line with what happens next. The mark is
 * StatusBadge's positive fill at 48px, large enough to be the first thing read, still a plain
 * icon rather than a drawing: a confirmation is a quiet page.
 */
export function ConfirmationHeader() {
  return (
    <header className="gap-ws-9 flex flex-col items-center text-center">
      <span
        role="img"
        aria-label="Confirmed"
        className="size-ws-18 rounded-ws-control-full bg-ws-semantic-inverse-positive text-ws-semantic-on-inverse-positive flex items-center justify-center"
      >
        <RiCheckLine aria-hidden="true" className="size-ws-12" />
      </span>
      <div className="gap-ws-2 flex flex-col">
        <h1 className="typography-title-md text-ws-static-strong">
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
