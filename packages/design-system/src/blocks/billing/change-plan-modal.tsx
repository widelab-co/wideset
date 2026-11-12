import { Button, Modal, SegmentedControl, StatusBadge, Tile } from '@wideset/react';
import { useState } from 'react';

import { type Interval, periodPrice, type PlanId, plans, usage, workspace } from './data';
import { formatCompact, formatCount, formatGb, formatUsdWhole } from './format';

type Choice = { planId: PlanId; interval: Interval };

type ChangePlanModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current: Choice;
  seats: number;
  onConfirm: (choice: Choice) => void;
};

const INTERVALS: { value: Interval; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

/** The choice itself; it lives inside the modal so it starts from the current plan on every open. */
function ChangePlanForm({
  current,
  seats,
  onConfirm,
}: Omit<ChangePlanModalProps, 'open' | 'onOpenChange'>) {
  const [choice, setChoice] = useState(current);
  const unchanged = choice.planId === current.planId && choice.interval === current.interval;
  const chosen = plans.find((plan) => plan.id === choice.planId)!;
  const action = unchanged
    ? 'Change plan'
    : choice.planId === current.planId
      ? `Switch to ${choice.interval} billing`
      : choice.interval === current.interval
        ? `Switch to ${chosen.name}`
        : `Switch to ${chosen.name}, billed ${choice.interval}`;

  return (
    <>
      <Modal.Header>
        <Modal.Title>Change plan</Modal.Title>
        <Modal.Description>
          Prices for {workspace.name}’s {seats} seats. The change applies today; the rest of this
          period is prorated.
        </Modal.Description>
      </Modal.Header>
      <Modal.Body>
        <div className="gap-ws-11 flex flex-col">
          <div className="gap-ws-5 flex items-center">
            <SegmentedControl
              size="sm"
              aria-label="Billing"
              value={choice.interval}
              onValueChange={(interval) =>
                interval && setChoice({ ...choice, interval: interval as Interval })
              }
            >
              {INTERVALS.map(({ value, label }) => (
                <SegmentedControl.Item key={value} value={value}>
                  {label}
                </SegmentedControl.Item>
              ))}
            </SegmentedControl>
            <span className="typography-body-md text-ws-static-subtle">
              Yearly billing saves up to 18%.
            </span>
          </div>
          <Tile.RadioGroup
            aria-label="Plan"
            value={choice.planId}
            onValueChange={(planId) => setChoice({ ...choice, planId: planId as PlanId })}
          >
            {plans.map((plan) => {
              const tooSmall = usage.contacts > plan.limits.contacts;
              return (
                <Tile.Radio
                  key={plan.id}
                  value={plan.id}
                  disabled={tooSmall}
                  title={plan.name}
                  description={
                    tooSmall
                      ? `Up to ${formatCount(plan.limits.contacts)} contacts; you have ${formatCount(usage.contacts)}.`
                      : `${formatCompact(plan.limits.contacts)} contacts, ${formatCompact(plan.limits.apiCalls)} API calls a month, ${formatGb(plan.limits.storageGb)}`
                  }
                >
                  {plan.id === current.planId && <StatusBadge size="sm">Current</StatusBadge>}
                  <div className="flex shrink-0 flex-col items-end">
                    <span className="typography-label-strong-sm text-ws-static-strong tabular-nums">
                      {formatUsdWhole(periodPrice(plan, choice.interval, seats))}
                    </span>
                    <span className="typography-caption-md text-ws-static-subtle tabular-nums">
                      {choice.interval === 'yearly'
                        ? `a year, ${formatUsdWhole(plan.seatPrice.yearly)} a seat a month`
                        : `a month, ${formatUsdWhole(plan.seatPrice.monthly)} a seat`}
                    </span>
                  </div>
                </Tile.Radio>
              );
            })}
          </Tile.RadioGroup>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Close asChild>
          <Button size="sm" variant="secondary" preset="border">
            Cancel
          </Button>
        </Modal.Close>
        <Button size="sm" disabled={unchanged} onClick={() => onConfirm(choice)}>
          {action}
        </Button>
      </Modal.Footer>
    </>
  );
}

/** Picking another plan or billing interval: every plan priced for the workspace's seats. */
export function ChangePlanModal({ open, onOpenChange, ...props }: ChangePlanModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content>
        <ChangePlanForm {...props} />
      </Modal.Content>
    </Modal>
  );
}
