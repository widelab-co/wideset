import { Button } from '@wideset/react';

import { ROUTES, subscription } from './data';
import { formatDate } from './format';

type ConfirmCancelProps = {
  /** While the cancellation is being saved: the button says so. */
  cancelling: boolean;
  /** While any choice is being saved: the button waits. */
  busy: boolean;
  onCancel: () => void;
};

/**
 * The last step: the date once more, then the two ways on. "Keep my plan" is the quiet way out,
 * a ghost link back to Billing; "Cancel plan" is the page's one filled button and its only red
 * thing. There is no dialog after it: the page was the confirmation, and the result can be undone.
 */
export function ConfirmCancel({ cancelling, busy, onCancel }: ConfirmCancelProps) {
  return (
    <div className="border-ws-static-subtle gap-ws-5 pt-ws-12 flex flex-wrap items-center justify-end border-t">
      <p className="typography-body-md text-ws-static-subtle mr-auto tabular-nums">
        {subscription.plan} ends on {formatDate(subscription.periodEnd)}.
      </p>
      <Button size="sm" variant="secondary" preset="ghost" asChild>
        <a href={ROUTES.billing}>Keep my plan</a>
      </Button>
      <Button size="sm" variant="danger" disabled={busy} onClick={onCancel}>
        {cancelling ? 'Cancelling…' : 'Cancel plan'}
      </Button>
    </div>
  );
}
