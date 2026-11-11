import { Tile } from '@wideset/react';

import { addOns, type Interval, MAX_SEATS, plan, subscription } from './data';
import { formatUsd } from './format';
import { SeatStepper } from './seat-stepper';

type OrderItemsProps = {
  seats: number;
  onSeatsChange: (seats: number) => void;
  addOnIds: string[];
  onAddOnsChange: (addOnIds: string[]) => void;
  interval: Interval;
};

/**
 * What is being bought, the cart: the plan with its seats, then the add-ons to tick. Each is a
 * tile with its control on the right edge; an add-on's whole tile is the checkbox. Seats cannot
 * go under the ones in use, and the plan's line says how many those are.
 */
export function OrderItems({
  seats,
  onSeatsChange,
  addOnIds,
  onAddOnsChange,
  interval,
}: OrderItemsProps) {
  return (
    <div role="group" aria-label="Plan and add-ons" className="gap-ws-5 flex flex-col">
      <Tile
        title={`${plan.name} plan`}
        description={`${formatUsd(plan.seatPrice[interval])} a seat a month. ${subscription.seatsInUse} seats are in use.`}
      >
        <span className="typography-label-sm text-ws-static-subtle">Seats</span>
        <SeatStepper
          value={seats}
          min={subscription.seatsInUse}
          max={MAX_SEATS}
          onChange={onSeatsChange}
        />
      </Tile>
      {addOns.map((addOn) => (
        <Tile.Checkbox
          key={addOn.id}
          title={addOn.name}
          description={addOn.description}
          checked={addOnIds.includes(addOn.id)}
          onCheckedChange={(checked) =>
            onAddOnsChange(
              checked === true ? [...addOnIds, addOn.id] : addOnIds.filter((id) => id !== addOn.id),
            )
          }
        >
          <span className="typography-label-sm text-ws-static-base whitespace-nowrap tabular-nums">
            {formatUsd(addOn.monthlyPrice)} a month
          </span>
          <Tile.Indicator />
        </Tile.Checkbox>
      ))}
    </div>
  );
}
