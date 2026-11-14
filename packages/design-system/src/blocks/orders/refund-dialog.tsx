import { Button, FormField, Modal, Select, TextInput } from '@wideset/react';
import { useEffect, useId, useRef, useState } from 'react';

import { formatAmount, formatUsd, parseAmount } from './format';

const REASONS = [
  { value: 'requested', label: 'Requested by the customer' },
  { value: 'duplicate', label: 'Duplicate order' },
  { value: 'faulty', label: 'Damaged or faulty item' },
  { value: 'not-delivered', label: 'Not delivered' },
  { value: 'mistake', label: 'Ordered by mistake' },
  { value: 'other', label: 'Other' },
];

/** What the dialog needs to know about the order it refunds. Money in cents. */
export type RefundTarget = {
  /** The order's number, as shown: "#6178". */
  number: string;
  customer: string;
  /** What the card was charged. */
  paid: number;
  /** What is left of the payment: what was paid less what went back already. */
  refundable: number;
  /** The card the money goes back to: "Visa ending 6411". */
  card: string;
};

type RefundFormProps = {
  id: string;
  order: RefundTarget;
  pending: boolean;
  onRefund: (amount: number, reason: string) => void;
};

/**
 * The dialog's content. It mounts with the dialog, so every opening starts from the full amount
 * and no reason. Errors wait for the first try at refunding, then follow what is typed.
 */
function RefundForm({ id, order, pending, onRefund }: RefundFormProps) {
  const [text, setText] = useState(formatAmount(order.refundable));
  const [reason, setReason] = useState('');
  const [tried, setTried] = useState(false);

  const amount = parseAmount(text);
  const max = formatUsd(order.refundable);
  const amountError = !(amount > 0)
    ? 'Enter an amount above $0.00.'
    : amount > order.refundable
      ? `Enter ${max} or less.`
      : undefined;
  const reasonError = reason ? undefined : 'Choose a reason.';
  const rest = order.refundable - amount;

  function refund() {
    setTried(true);
    if (amountError) document.getElementById(`${id}-amount`)?.focus();
    else if (reasonError) document.getElementById(`${id}-reason`)?.focus();
    else onRefund(amount, reason);
  }

  return (
    <>
      <Modal.Header>
        <Modal.Title>Refund order {order.number}</Modal.Title>
        <Modal.Description>
          {order.customer} paid {formatUsd(order.paid)} with {order.card}.
          {order.paid > order.refundable &&
            ` ${formatUsd(order.paid - order.refundable)} of it has gone back already.`}
        </Modal.Description>
      </Modal.Header>
      <Modal.Body className="gap-ws-11 flex flex-col">
        <div className="gap-ws-9 grid grid-cols-2 items-start">
          <FormField
            label="Amount"
            htmlFor={`${id}-amount`}
            helperText={`Up to ${max}.`}
            errorText={tried ? amountError : undefined}
          >
            <TextInput
              id={`${id}-amount`}
              name="amount"
              required
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              variant={tried && amountError ? 'danger' : 'primary'}
              value={text}
              onChange={(event) => setText(event.target.value.replace(/[^\d.,]/g, ''))}
              // Leaving the field settles what was typed into an amount: 1200 → 1,200.00.
              onBlur={() => amount > 0 && setText(formatAmount(amount))}
            >
              <TextInput.Prefix>$</TextInput.Prefix>
              <TextInput.Input className="tabular-nums" />
            </TextInput>
          </FormField>
          <FormField
            label="Reason"
            htmlFor={`${id}-reason`}
            errorText={tried ? reasonError : undefined}
          >
            <Select
              id={`${id}-reason`}
              name="reason"
              className="w-full"
              required
              options={REASONS}
              placeholder="Choose a reason"
              variant={tried && reasonError ? 'danger' : 'primary'}
              value={reason}
              onValueChange={setReason}
            />
          </FormField>
        </div>
        {/* What confirming does, in words, following the amount as it is typed. */}
        <p className="typography-body-md text-ws-static-subtle tabular-nums">
          {amountError
            ? `A refund goes back to the ${order.card} within 5 to 10 business days.`
            : `${formatUsd(amount)} goes back to the ${order.card} within 5 to 10 business days. The order is marked ${
                rest === 0 ? 'Refunded' : `Partially refunded and ${formatUsd(rest)} stays paid`
              }.`}{' '}
          {order.customer} gets a confirmation by email. A refund cannot be undone.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close asChild>
          <Button variant="secondary" preset="border" disabled={pending}>
            Cancel
          </Button>
        </Modal.Close>
        <Button onClick={refund} disabled={pending}>
          {pending ? 'Refunding…' : amountError ? 'Refund' : `Refund ${formatUsd(amount)}`}
        </Button>
      </Modal.Footer>
    </>
  );
}

type RefundDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: RefundTarget;
  /** Called once the refund went through, with the amount in cents and the reason's value. */
  onConfirm: (amount: number, reason: string) => void;
};

/**
 * Refunding an order: the amount, full unless changed and never above what is left of the
 * payment, the reason, and what confirming does. Money leaves on a click, never on Enter in a
 * field: the fields are not a form, and the button names the amount it sends back.
 */
export function RefundDialog({ open, onOpenChange, order, onConfirm }: RefundDialogProps) {
  const id = useId();
  const [pending, setPending] = useState(false);

  // Cleared on unmount, so the stand-in request never lands on a closed screen.
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  // A timeout stands in for the request; a real screen awaits it and shows an InlineAlert in the
  // body if it fails, keeping the dialog open.
  function refund(amount: number, reason: string) {
    setPending(true);
    timer.current = window.setTimeout(() => {
      setPending(false);
      onConfirm(amount, reason);
    }, 800);
  }

  return (
    <Modal open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <Modal.Content
        persistent={pending}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById(`${id}-amount`)?.focus();
        }}
      >
        <RefundForm id={id} order={order} pending={pending} onRefund={refund} />
      </Modal.Content>
    </Modal>
  );
}
