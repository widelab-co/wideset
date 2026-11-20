import { AppShell } from '@wideset/react';
import { useState } from 'react';

import { type Change, ChangePlanModal } from './change-plan-modal';
import {
  type Interval,
  type Plan,
  type PlanId,
  PLANS,
  RECOMMENDED,
  SUBSCRIPTION,
  WORKSPACE,
} from './data';
import { FeatureTable } from './feature-table';
import { formatCount } from './format';
import { type PlanAction, PlanSummary } from './plan-summary';
import { PlansIntro } from './plans-intro';
import { TopBar } from './top-bar';

const rank = (id: PlanId) => PLANS.findIndex((plan) => plan.id === id);

/**
 * Choosing a plan, a takeover in the Flat direction: a top bar to leave by, the three plans side by
 * side over the columns of the comparison, which scrolls on its own while the plans stay in view.
 * The period switch reprices every plan; the recommended one carries the page's only filled button.
 */
export default function Plans() {
  const [current, setCurrent] = useState({
    planId: SUBSCRIPTION.planId,
    interval: SUBSCRIPTION.interval,
  });
  const [interval, setInterval] = useState<Interval>(current.interval);
  // Kept after confirming so the modal does not empty while it closes.
  const [change, setChange] = useState<Change>();
  const [confirming, setConfirming] = useState(false);

  const currentPlan = PLANS.find((plan) => plan.id === current.planId)!;

  const actionFor = (plan: Plan): PlanAction => {
    if (plan.id === current.planId)
      return interval === current.interval
        ? { label: 'Current plan', disabled: true }
        : { label: `Switch to ${interval} billing` };
    if (plan.contacts < SUBSCRIPTION.contacts)
      return {
        label: `Switch to ${plan.name}`,
        disabled: true,
        note: `Holds ${formatCount(plan.contacts)} contacts; ${WORKSPACE.name} has ${formatCount(SUBSCRIPTION.contacts)}.`,
      };
    return rank(plan.id) > rank(current.planId)
      ? { label: `Upgrade to ${plan.name}`, primary: plan.id === RECOMMENDED }
      : { label: `Switch to ${plan.name}` };
  };

  const badgeFor = (plan: Plan) =>
    plan.id === current.planId
      ? 'Current'
      : plan.id === RECOMMENDED && rank(plan.id) > rank(current.planId)
        ? 'Recommended'
        : undefined;

  return (
    <AppShell direction="flat">
      {/* From lg the plans stay in view and the comparison scrolls under them; narrower, the plans
          stack and the whole page scrolls. */}
      <AppShell.Main className="relative lg:flex lg:flex-col lg:overflow-hidden">
        <TopBar />
        <div className="border-ws-static-subtle px-ws-12 shrink-0 border-b">
          {/* Four rows shared by every column (subgrid): titles, prices, limits, actions. */}
          <div className="pt-ws-16 pb-ws-14 gap-y-ws-16 lg:gap-y-ws-12 mx-auto grid w-full max-w-[80rem] grid-cols-1 lg:grid-cols-4 lg:grid-rows-[repeat(4,auto)]">
            <PlansIntro
              currentPlan={currentPlan}
              currentInterval={current.interval}
              interval={interval}
              onIntervalChange={setInterval}
            />
            {PLANS.map((plan) => {
              const action = actionFor(plan);
              return (
                <PlanSummary
                  key={plan.id}
                  plan={plan}
                  interval={interval}
                  seats={SUBSCRIPTION.seats}
                  badge={badgeFor(plan)}
                  action={action}
                  onAction={() => {
                    setChange({ plan, interval, title: action.label });
                    setConfirming(true);
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* `relative` keeps the comparison's screen-reader header inside its scroll area. */}
        <div className="px-ws-12 relative lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          <div className="pt-ws-9 pb-ws-16 mx-auto w-full max-w-[80rem]">
            <FeatureTable />
          </div>
        </div>
      </AppShell.Main>

      {change && (
        <ChangePlanModal
          change={change}
          seats={SUBSCRIPTION.seats}
          open={confirming}
          onOpenChange={setConfirming}
          onConfirm={() => {
            setCurrent({ planId: change.plan.id, interval: change.interval });
            setConfirming(false);
          }}
        />
      )}
    </AppShell>
  );
}
