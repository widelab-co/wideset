// TODO(custom): quiet key figure row; no KpiCard / stat component in Wideset.
import { customer, openDeals } from './data';
import { formatCount, formatEuro, formatPercent } from './format';

const pipeline = openDeals.reduce((total, deal) => total + deal.value, 0);
const { seats, health } = customer;

const FIGURES = [
  {
    label: 'MRR',
    value: formatEuro(customer.mrr),
    note: `${formatEuro(customer.mrr * 12)} ARR`,
  },
  {
    label: 'Open pipeline',
    value: formatEuro(pipeline),
    note: `${openDeals.length} deals`,
  },
  {
    label: 'Health',
    value: formatCount(health.score),
    note: `${health.label}, up from ${health.previous}`,
  },
  {
    label: 'Seats used',
    value: formatCount(seats.used),
    note: `${formatPercent(seats.used / seats.licensed)} of ${seats.licensed} licensed`,
  },
];

/**
 * The customer in four figures: a quiet row of label, figure and one line of context. No cards,
 * no icons: the record's name stays the loudest thing on the page.
 */
export function KeyFigures() {
  return (
    <dl className="gap-ws-12 grid grid-cols-2 md:grid-cols-4">
      {FIGURES.map(({ label, value, note }) => (
        <div key={label} className="gap-ws-3 flex flex-col">
          <dt className="typography-label-sm text-ws-static-subtle">{label}</dt>
          <dd className="typography-number-strong-lg text-ws-static-strong tabular-nums">
            {value}
          </dd>
          <dd className="typography-caption-md text-ws-static-subtle tabular-nums">{note}</dd>
        </div>
      ))}
    </dl>
  );
}
