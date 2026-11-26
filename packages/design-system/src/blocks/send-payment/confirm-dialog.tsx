import { Button, StatusModal } from '@wideset/react';

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
 * A confirmation step for the example payment. Cancel and Esc return to the review.
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
          Check the amount and recipient before confirming this sample payment.
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
