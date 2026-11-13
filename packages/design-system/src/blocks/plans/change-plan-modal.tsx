import { Button, Modal } from '@wideset/react';

import { type Interval, periodPrice, type Plan, WORKSPACE } from './data';
import { formatUsd } from './format';

export type Change = { plan: Plan; interval: Interval; title: string };

type ChangePlanModalProps = {
  /** The plan and billing period to move to; kept while the modal closes so it does not empty. */
  change: Change;
  seats: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

/** Confirming the move: the new price for the workspace's seats, and when it applies. */
export function ChangePlanModal({
  change,
  seats,
  open,
  onOpenChange,
  onConfirm,
}: ChangePlanModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{change.title}</Modal.Title>
          <Modal.Description>
            {WORKSPACE.name} moves to {change.plan.name}, billed {change.interval}, today. The rest
            of this period is prorated on the next invoice.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <p className="gap-ws-5 flex items-baseline">
            <span className="typography-title-sm text-ws-static-strong tabular-nums">
              {formatUsd(periodPrice(change.plan, change.interval, seats))}
            </span>
            <span className="typography-body-md text-ws-static-base">
              {change.interval === 'yearly' ? 'a year' : 'a month'} for {seats} seats
            </span>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button size="sm" variant="secondary" preset="border">
              Cancel
            </Button>
          </Modal.Close>
          <Button size="sm" onClick={onConfirm}>
            {change.title}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
