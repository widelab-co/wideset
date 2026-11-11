// TODO(custom): key-value facts list; no DescriptionList in Wideset.
import type { ReactNode } from 'react';

/** Facts as label and value, the customer record's list: the label names, the value is read. */
export function FactsList({ facts }: { facts: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="gap-x-ws-9 gap-y-ws-7 grid grid-cols-[5rem_minmax(0,1fr)]">
      {facts.map(({ label, value }) => (
        <div key={label} className="col-span-2 grid grid-cols-subgrid items-center">
          <dt className="typography-label-sm text-ws-static-subtle">{label}</dt>
          <dd className="typography-body-md text-ws-static-base min-w-0 truncate">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
