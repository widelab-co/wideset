import { RiCloseLine } from '@remixicon/react';
import { Button, Modal } from '@wideset/react';
import { useState } from 'react';

import { freePlan, type Plan, usage, workspace } from './data';
import { formatCount, formatDate, formatGb } from './format';

type CancelPlanModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan;
  /** The last day of the paid period. */
  periodEnd: string;
  /** The day the workspace drops to Free. */
  renews: string;
  onConfirm: () => void;
};

/**
 * Cancelling the plan: what stays until when, then what the workspace loses on Free, measured
 * against what it uses today. The safe button keeps the plan; the red one names the action.
 */
export function CancelPlanModal({
  open,
  onOpenChange,
  plan,
  periodEnd,
  renews,
  onConfirm,
}: CancelPlanModalProps) {
  const [pending, setPending] = useState(false);

  const losses = [
    `${usage.seats - freePlan.seats} of ${usage.seats} people lose access. Free includes ${freePlan.seats} seats.`,
    `Contacts over ${formatCount(freePlan.contacts)} become read-only. You have ${formatCount(usage.contacts)}.`,
    `The API stops answering. It took ${formatCount(usage.apiCalls)} calls this month.`,
    `Files over ${formatGb(freePlan.storageGb)} become read-only. You store ${formatGb(usage.storageGb)}.`,
  ];

  // A timeout stands in for the request; a real screen awaits it and shows an InlineAlert in the
  // body if it fails, keeping the modal open.
  function confirm() {
    setPending(true);
    setTimeout(() => {
      setPending(false);
      onConfirm();
    }, 800);
  }

  return (
    <Modal open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <Modal.Content persistent={pending}>
        <Modal.Header>
          <Modal.Title>Cancel the {plan.name} plan?</Modal.Title>
          <Modal.Description>
            {plan.name} stays on until {formatDate(periodEnd)}. Then {workspace.name} moves to the
            Free plan and is not charged again.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <div className="gap-ws-5 flex flex-col">
            <h3 className="typography-label-strong-md text-ws-static-strong">
              On {formatDate(renews)}
            </h3>
            <ul className="gap-ws-5 flex flex-col">
              {losses.map((loss) => (
                <li
                  key={loss}
                  className="gap-ws-5 typography-body-md text-ws-static-base flex items-start"
                >
                  <RiCloseLine
                    aria-hidden="true"
                    className="size-ws-9 mt-ws-1 text-ws-static-subtle shrink-0"
                  />
                  {loss}
                </li>
              ))}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button size="sm" variant="secondary" preset="border" disabled={pending}>
              Keep {plan.name}
            </Button>
          </Modal.Close>
          <Button size="sm" variant="danger" onClick={confirm} disabled={pending}>
            {pending ? 'Cancelling…' : 'Cancel plan'}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
