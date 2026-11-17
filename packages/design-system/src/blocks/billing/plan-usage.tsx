import { type Plan, usage } from './data';
import { formatCompact, formatCount, formatGb, formatPeriod } from './format';
import { UsageMeter } from './usage-meter';

type PlanUsageProps = {
  plan: Plan;
  seats: number;
  periodStart: string;
  periodEnd: string;
};

/** This period's usage against the plan's limits: four meters in one row. */
export function PlanUsage({ plan, seats, periodStart, periodEnd }: PlanUsageProps) {
  const { contacts, apiCalls, storageGb } = plan.limits;
  const seatsLeft = seats - usage.seats;

  return (
    <section aria-labelledby="billing-usage-title" className="gap-ws-11 flex flex-col">
      <div className="gap-ws-5 flex items-baseline">
        <h3 id="billing-usage-title" className="typography-label-strong-md text-ws-static-strong">
          Usage
        </h3>
        <span className="typography-body-md text-ws-static-subtle">
          {formatPeriod(periodStart, periodEnd)}
        </span>
      </div>
      <div className="gap-x-ws-12 gap-y-ws-11 grid grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
        <UsageMeter
          label="Seats"
          used={usage.seats}
          limit={seats}
          usedText={formatCount(usage.seats)}
          limitText={formatCount(seats)}
          note={`${seatsLeft} ${seatsLeft === 1 ? 'seat' : 'seats'} left`}
        />
        <UsageMeter
          label="Contacts"
          used={usage.contacts}
          limit={contacts}
          usedText={formatCompact(usage.contacts)}
          limitText={formatCompact(contacts)}
          note={`${formatCount(contacts - usage.contacts)} left`}
        />
        <UsageMeter
          label="API calls"
          used={usage.apiCalls}
          limit={apiCalls}
          usedText={formatCompact(usage.apiCalls)}
          limitText={formatCompact(apiCalls)}
          note={`${formatCompact(apiCalls - usage.apiCalls)} left this month`}
        />
        <UsageMeter
          label="Storage"
          used={usage.storageGb}
          limit={storageGb}
          usedText={formatGb(usage.storageGb)}
          limitText={formatGb(storageGb)}
          note={`${formatGb(storageGb - usage.storageGb)} left`}
        />
      </div>
    </section>
  );
}
