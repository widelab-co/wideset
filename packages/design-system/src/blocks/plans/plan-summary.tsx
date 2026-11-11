// TODO(custom): plan summary card (name, badge, audience, price per seat, total, limits, action); no PricingPlan in Wideset, and Card cannot carry a subgrid.
import { Button, StatusBadge } from '@wideset/react';

import { type Interval, periodPrice, type Plan } from './data';
import { formatUsd } from './format';

export type PlanAction = {
  label: string;
  /** The one filled button on the page goes to the recommended upgrade. */
  primary?: boolean;
  disabled?: boolean;
  /** Why the action is unavailable, under it. */
  note?: string;
};

type PlanSummaryProps = {
  plan: Plan;
  interval: Interval;
  seats: number;
  badge?: 'Current' | 'Recommended';
  action: PlanAction;
  onAction: () => void;
};

/**
 * One plan at a glance: who it is for, what a seat costs and what the workspace would pay, the
 * limits that set it apart, and the way to move to it. Each plan is its own container, drawn as
 * the library's bordered Card (border, fill, radius, 20px inset), so the three read as three
 * choices and not one block of text; it is drawn by hand because `Card.Content` is a scroll area
 * and would cut the subgrid. Its four parts sit on the four rows of the parent grid
 * (`grid-rows-subgrid`), so names, prices, limits and buttons line up across plans. From lg a
 * 16px margin on its left is the gap between the plans: the columns stay equal quarters, the
 * comparison's columns under them.
 */
export function PlanSummary({ plan, interval, seats, badge, action, onAction }: PlanSummaryProps) {
  const yearly = interval === 'yearly';

  return (
    <section
      aria-label={plan.name}
      className="gap-y-ws-9 lg:gap-y-ws-12 border-ws-static-base bg-ws-static-container rounded-ws-container-lg p-ws-11 lg:ml-ws-9 grid border lg:row-span-4 lg:grid-rows-subgrid"
    >
      <div className="gap-ws-3 flex flex-col">
        <div className="gap-ws-5 flex items-center">
          <h2 className="typography-subtitle-xs text-ws-static-strong">{plan.name}</h2>
          {badge && (
            <StatusBadge size="sm" color={badge === 'Recommended' ? 'info' : 'neutral'}>
              {badge}
            </StatusBadge>
          )}
        </div>
        <p className="typography-body-md text-ws-static-base">{plan.audience}</p>
      </div>

      <div className="gap-ws-3 flex flex-col">
        <p className="gap-ws-5 flex items-baseline">
          <span className="typography-subtitle-lg text-ws-static-strong tabular-nums">
            {formatUsd(plan.seatPrice[interval])}
          </span>
          <span className="typography-body-md text-ws-static-subtle">per seat a month</span>
        </p>
        <p className="typography-body-md text-ws-static-base tabular-nums">
          {/* The period goes on this line: beside the price it would wrap in the card. */}
          {formatUsd(periodPrice(plan, interval, seats))} {yearly ? 'billed yearly' : 'a month'} for{' '}
          {seats} seats
        </p>
      </div>

      <ul className="gap-ws-3 typography-body-md text-ws-static-base flex flex-col">
        {plan.limits.map((limit) => (
          <li key={limit}>{limit}</li>
        ))}
      </ul>

      <div className="gap-ws-5 flex flex-col">
        <Button
          size="sm"
          className="w-full"
          variant={action.primary ? 'primary' : 'secondary'}
          preset={action.primary ? 'filled' : 'border'}
          disabled={action.disabled}
          onClick={onAction}
        >
          {action.label}
        </Button>
        {action.note && (
          <p className="typography-caption-md text-ws-static-subtle">{action.note}</p>
        )}
      </div>
    </section>
  );
}
