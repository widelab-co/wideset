// TODO(custom): key figure card (label, figure, one line of context) in a Card; no KpiCard / stat component in Wideset.
import { Card } from '@wideset/react';

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
 * The customer in four figures, each in its own card: label, figure and one line of context. The
 * cards make the row a thing to read at a glance; no icons and no colour, so the record's name
 * stays the loudest thing on the page.
 */
export function KeyFigures() {
  return (
    <div className="gap-ws-9 grid grid-cols-2 md:grid-cols-4">
      {FIGURES.map(({ label, value, note }) => (
        <Card key={label}>
          {/* Card.Content keeps 10px free on the right for a scrollbar: the padding gives it back. */}
          <Card.Content contentClassName="pr-ws-6">
            <dl className="gap-ws-3 flex flex-col">
              <dt className="typography-label-sm text-ws-static-subtle">{label}</dt>
              <dd className="typography-number-strong-lg text-ws-static-strong tabular-nums">
                {value}
              </dd>
              <dd className="typography-caption-md text-ws-static-subtle truncate tabular-nums">
                {note}
              </dd>
            </dl>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
}
