// TODO(custom): postal address (its lines one under another); no Address or DescriptionList in Wideset.

/** An address as it is written on a parcel: one line under another, the name first. */
export function Address({ lines }: { lines: string[] }) {
  return (
    <address className="typography-body-md text-ws-static-base not-italic">
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </address>
  );
}
