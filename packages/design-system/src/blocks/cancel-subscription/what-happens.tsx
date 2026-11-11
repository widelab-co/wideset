import { freePlan, losses, subscription, workspace } from './data';
import { FactsList } from './facts-list';
import { formatDate } from './format';
import { Section } from './section';

/**
 * The first step: what cancelling does, before anything is asked. One sentence for when the plan
 * ends and what follows it, then what is lost on that day as plain rows, each measured against
 * what the workspace uses today. No warning colour and no icons: these are facts, not a threat.
 */
export function WhatHappens() {
  return (
    <Section title="What happens">
      <p className="typography-body-md text-ws-static-base tabular-nums">
        {subscription.plan} stays on until {formatDate(subscription.periodEnd)}, the end of the
        period you have paid for. On {formatDate(subscription.renews)} {workspace.name} moves to the{' '}
        {freePlan.name} plan and is not charged again. Your data stays where it is.
      </p>
      <FactsList facts={losses} />
    </Section>
  );
}
