// TODO(custom): own h2 instead of Card.Title (20px on this branch).
import { Button, Card } from '@wideset/react';

import { type Interval, periodPrice, type Plan } from './data';
import { formatDate, formatUsd } from './format';
import { PlanUsage } from './plan-usage';

type PlanCardProps = {
  plan: Plan;
  interval: Interval;
  seats: number;
  periodStart: string;
  periodEnd: string;
  renews: string;
  /** Set once the plan is cancelled: it then ends at the close of this period. */
  cancelled: boolean;
  onChangePlan: () => void;
  onCancel: () => void;
  onResume: () => void;
};

/**
 * The plan: its name and what to do with it in the header; what it costs per billing period, how
 * it is billed and when it renews under the price, and this period's usage against its limits.
 * The price is the page's key figure.
 */
export function PlanCard({
  plan,
  interval,
  seats,
  periodStart,
  periodEnd,
  renews,
  cancelled,
  onChangePlan,
  onCancel,
  onResume,
}: PlanCardProps) {
  const yearly = interval === 'yearly';

  return (
    <Card>
      <Card.Header>
        <div className="gap-ws-9 flex flex-wrap items-center justify-between">
          <h2 className="typography-subtitle-xs text-ws-static-strong min-w-0 flex-1">
            {plan.name} plan
          </h2>
          <Card.Action className="gap-ws-5">
            {cancelled ? (
              <Button size="sm" variant="secondary" preset="border" onClick={onResume}>
                Resume plan
              </Button>
            ) : (
              <Button size="sm" variant="secondary" preset="ghost" onClick={onCancel}>
                Cancel plan
              </Button>
            )}
            <Button size="sm" onClick={onChangePlan}>
              Change plan
            </Button>
          </Card.Action>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="gap-ws-16 flex flex-col">
          <div className="gap-ws-3 flex flex-col">
            <p className="gap-ws-5 flex items-baseline">
              <span className="typography-title-md text-ws-static-strong tabular-nums">
                {formatUsd(periodPrice(plan, interval, seats))}
              </span>
              <span className="typography-body-md text-ws-static-subtle">
                {yearly ? 'per year' : 'per month'}
              </span>
            </p>
            {/* How it is billed reads with what it costs, not as the card's subtitle. */}
            <p className="typography-body-md text-ws-static-base tabular-nums">
              {seats} seats × {formatUsd(plan.seatPrice[interval])}
              {yearly ? ' a month, billed yearly' : ', billed monthly'},{' '}
              {cancelled ? `ends on ${formatDate(periodEnd)}` : `renews on ${formatDate(renews)}`}
            </p>
          </div>
          <PlanUsage plan={plan} seats={seats} periodStart={periodStart} periodEnd={periodEnd} />
        </div>
      </Card.Content>
    </Card>
  );
}
