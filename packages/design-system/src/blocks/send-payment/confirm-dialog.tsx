import { Button, StatusModal } from '@wideset/react';

import { CONFIRM_ABOVE } from './data';
import { formatUsd } from './format';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The payment's amount, in cents. */
  amount: number;
  recipient: string;
  /** Scheduling a payment for later, not sending it now. */
  scheduled: boolean;
  onConfirm: () => void;
};

/**
 * The second look a large payment gets. It opens only above the limit, which it states: asked
 * about every payment, the question would be clicked through. Cancel and Esc go back to the
 * review with nothing sent.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  amount,
  recipient,
  scheduled,
  onConfirm,
}: ConfirmDialogProps) {
  const action = `${scheduled ? 'Schedule' : 'Send'} ${formatUsd(amount)}`;

  return (
    <StatusModal status="notice" open={open} onOpenChange={onOpenChange}>
      <StatusModal.Content>
        <StatusModal.Title>
          {action} to {recipient}?
        </StatusModal.Title>
        <StatusModal.Body>
          Payments over {formatUsd(CONFIRM_ABOVE)} are confirmed once more. A payment cannot be
          recalled once it has left the balance.
        </StatusModal.Body>
        <StatusModal.Footer>
          <StatusModal.Close asChild>
            <Button variant="secondary" preset="border">
              Cancel
            </Button>
          </StatusModal.Close>
          <Button onClick={onConfirm}>{action}</Button>
        </StatusModal.Footer>
      </StatusModal.Content>
    </StatusModal>
  );
}
