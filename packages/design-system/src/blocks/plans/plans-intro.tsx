// TODO(custom): the plan grid's first column (where the workspace stands, the period switch, a line to sales); no PageHeader in Wideset.
import { LinkButton, SegmentedControl } from '@wideset/react';

import { type Interval, type Plan, SUBSCRIPTION, WORKSPACE, yearlySaving } from './data';
import { formatCount, formatPercent } from './format';

const INTERVALS: { value: Interval; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

type PlansIntroProps = {
  currentPlan: Plan;
  currentInterval: Interval;
  interval: Interval;
  onIntervalChange: (interval: Interval) => void;
};

/**
 * Where the workspace stands and why the next plan is suggested, the billing period that reprices
 * every plan, and the way to sales past the largest one. Its three parts sit on the plan rows they
 * belong beside: the titles, the prices and the actions.
 */
export function PlansIntro({
  currentPlan,
  currentInterval,
  interval,
  onIntervalChange,
}: PlansIntroProps) {
  const { seats, contacts } = SUBSCRIPTION;

  return (
    // From lg it takes the plan cards' inset and border at the top and bottom (the border
    // transparent), so its parts stand on the same lines as theirs.
    <div className="gap-y-ws-9 lg:gap-y-ws-12 lg:py-ws-11 grid border-transparent lg:row-span-4 lg:grid-rows-subgrid lg:border-y">
      <div className="gap-ws-3 flex flex-col">
        <h2 className="typography-label-strong-md text-ws-static-strong">
          {WORKSPACE.name}, {seats} seats
        </h2>
        <p className="typography-body-md text-ws-static-base">
          On {currentPlan.name}, billed {currentInterval}, using{' '}
          {formatPercent(contacts / currentPlan.contacts)} of its{' '}
          {formatCount(currentPlan.contacts)} contacts.
        </p>
      </div>
      <div className="gap-ws-5 flex flex-col items-start">
        <SegmentedControl
          size="sm"
          aria-label="Billing period"
          value={interval}
          onValueChange={(value) => onIntervalChange(value as Interval)}
        >
          {INTERVALS.map(({ value, label }) => (
            <SegmentedControl.Item key={value} value={value}>
              {label}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl>
        <p className="typography-body-md text-ws-static-subtle">
          Yearly billing saves up to {formatPercent(yearlySaving)}.
        </p>
      </div>
      {/* On the actions' row, one button high, so it reads in line with them. */}
      <p className="typography-body-md text-ws-static-base min-h-ws-forms-sm gap-ws-3 flex items-center self-start lg:row-start-4">
        Over 250,000 contacts? <LinkButton href="#contact-sales">Contact sales</LinkButton>
      </p>
    </div>
  );
}
