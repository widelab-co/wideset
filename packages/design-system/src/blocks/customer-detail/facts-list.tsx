// TODO(custom): key-value facts list; no DescriptionList in Wideset.
import { Avatar } from '@wideset/react';
import type { ReactNode } from 'react';

import { customer } from './data';
import { formatCount, formatDay, formatEuro } from './format';

const FACTS: { label: string; value: ReactNode }[] = [
  {
    label: 'Owner',
    value: (
      <span className="gap-ws-5 flex items-center">
        <Avatar size="xs" initials={customer.owner.initials} color={customer.owner.color} />
        {customer.owner.name}
      </span>
    ),
  },
  { label: 'Plan', value: customer.plan },
  { label: 'MRR', value: <span className="tabular-nums">{formatEuro(customer.mrr)}</span> },
  { label: 'Customer since', value: formatDay(customer.customerSince) },
  {
    label: 'Seats',
    value: (
      <span className="tabular-nums">
        {customer.seats.used} of {customer.seats.licensed} in use
      </span>
    ),
  },
  { label: 'Domain', value: customer.domain },
  { label: 'Industry', value: customer.industry },
  { label: 'Employees', value: formatCount(customer.employees) },
  { label: 'Location', value: customer.location },
];

/** The record's facts as label and value: the label names, the value is what is read. */
export function FactsList() {
  return (
    <dl className="gap-x-ws-9 gap-y-ws-7 grid grid-cols-[7rem_minmax(0,1fr)]">
      {FACTS.map(({ label, value }) => (
        <div key={label} className="col-span-2 grid grid-cols-subgrid items-center">
          <dt className="typography-label-sm text-ws-static-subtle">{label}</dt>
          <dd className="typography-body-md text-ws-static-base min-w-0 truncate">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
