import { InlineAlert } from '@wideset/react';

import { card, workspace } from './data';
import { formatDayMonth, formatUsd } from './format';

type FailedPaymentAlertProps = {
  amount: number;
  failedOn: string;
  /** The day the workspace pauses if the charge stays unpaid. */
  pausesOn: string;
  retrying: boolean;
  onRetry: () => void;
};

/**
 * A charge the bank declined: what failed, what happens if nothing is done, and the two ways to
 * fix it. Persistent: it goes away only when the payment goes through.
 */
export function FailedPaymentAlert({
  amount,
  failedOn,
  pausesOn,
  retrying,
  onRetry,
}: FailedPaymentAlertProps) {
  return (
    <InlineAlert
      status="error"
      persistent
      title={`Payment of ${formatUsd(amount)} failed`}
      message={`Your bank declined ${card.brand} ending ${card.last4} on ${formatDayMonth(failedOn)}. Pay by ${formatDayMonth(pausesOn)} to keep ${workspace.name} active.`}
    >
      <InlineAlert.Action>Update card</InlineAlert.Action>
      <InlineAlert.Action onClick={onRetry} disabled={retrying}>
        {retrying ? 'Retrying…' : 'Retry payment'}
      </InlineAlert.Action>
    </InlineAlert>
  );
}
