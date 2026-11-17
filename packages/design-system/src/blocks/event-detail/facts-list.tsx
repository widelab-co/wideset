// TODO(custom): key-value facts list; no DescriptionList in Wideset.
import type { ReactNode } from 'react';

/**
 * Facts as label and value, the profile's list with a wider label column: here the values are
 * sentences, so they wrap instead of truncating.
 */
export function FactsList({ facts }: { facts: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="gap-x-ws-9 gap-y-ws-7 grid grid-cols-[8rem_minmax(0,1fr)]">
      {facts.map(({ label, value }) => (
        <div key={label} className="col-span-2 grid grid-cols-subgrid items-baseline">
          <dt className="typography-label-sm text-ws-static-subtle">{label}</dt>
          <dd className="typography-body-md text-ws-static-base max-w-[40rem] min-w-0">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
