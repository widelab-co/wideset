// TODO(custom): key-value facts list; no DescriptionList in Wideset.

/** The deal's key facts as label and value: the label names, the value is what is read. */
export function FactsList({ facts }: { facts: { label: string; value: string }[] }) {
  return (
    <dl className="gap-x-ws-9 gap-y-ws-7 grid grid-cols-[8rem_minmax(0,1fr)]">
      {facts.map(({ label, value }) => (
        <div key={label} className="col-span-2 grid grid-cols-subgrid items-baseline">
          <dt className="typography-label-sm text-ws-static-subtle">{label}</dt>
          <dd className="typography-body-md text-ws-static-base min-w-0">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
