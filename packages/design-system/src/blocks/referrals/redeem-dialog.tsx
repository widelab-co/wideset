import { Button, StatusModal } from '@wideset/react';

import { formatDate, formatUsd } from './format';

type RedeemDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The credit that will be redeemed. */
  amount: number;
  /** The invoice it goes against: what it is for, when it is issued and what it comes to. */
  invoice: { description: string; date: string; amount: number };
  onConfirm: () => void;
  /** Runs as the dialog hands focus back; prevent it to send focus somewhere else. */
  onCloseAutoFocus?: (event: Event) => void;
};

/**
 * The one question before credit is spent: how much, against which invoice, and what is left to
 * pay. It is asked because applied credit cannot be taken back. A neutral status modal: nothing
 * is at risk, so no warning colour; Cancel and Esc leave the credit where it is.
 */
export function RedeemDialog({
  open,
  onOpenChange,
  amount,
  invoice,
  onConfirm,
  onCloseAutoFocus,
}: RedeemDialogProps) {
  return (
    <StatusModal open={open} onOpenChange={onOpenChange}>
      <StatusModal.Content onCloseAutoFocus={onCloseAutoFocus}>
        <StatusModal.Title>Redeem {formatUsd(amount)} of credit?</StatusModal.Title>
        <StatusModal.Body>
          It goes against your next invoice: {invoice.description}, issued on{' '}
          {formatDate(invoice.date)}. You pay {formatUsd(invoice.amount - amount)} instead of{' '}
          {formatUsd(invoice.amount)}. Credit cannot be moved back once it is applied.
        </StatusModal.Body>
        <StatusModal.Footer>
          <StatusModal.Close asChild>
            <Button variant="secondary" preset="border">
              Cancel
            </Button>
          </StatusModal.Close>
          <Button onClick={onConfirm}>{`Redeem ${formatUsd(amount)}`}</Button>
        </StatusModal.Footer>
      </StatusModal.Content>
    </StatusModal>
  );
}
