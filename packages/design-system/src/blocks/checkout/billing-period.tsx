import { Tile } from '@wideset/react';

import { type Interval, plan } from './data';
import { formatUsd } from './format';

type BillingPeriodProps = {
  interval: Interval;
  seats: number;
  onChange: (interval: Interval) => void;
};

/**
 * How often the plan is billed. Each choice states the price of a seat; yearly also says what it
 * saves over a year for the seats in the order, which is the reason to pick it.
 */
export function BillingPeriod({ interval, seats, onChange }: BillingPeriodProps) {
  const { monthly, yearly } = plan.seatPrice;
  const saving = (monthly - yearly) * seats * 12;

  return (
    <Tile.RadioGroup
      aria-label="Billing period"
      orientation="horizontal"
      value={interval}
      onValueChange={(value) => onChange(value as Interval)}
    >
      <Tile.Radio
        value="monthly"
        title="Monthly"
        description={`${formatUsd(monthly)} a seat a month`}
      />
      <Tile.Radio
        value="yearly"
        title="Yearly"
        description={`${formatUsd(yearly)} a seat a month, ${formatUsd(saving)} less a year`}
      />
    </Tile.RadioGroup>
  );
}
