// TODO(custom): facts in two columns (label above value); no DescriptionList in Wideset.
import type { Fact } from './data';

/**
 * A record's facts, two to a row as Figma draws them. A value keeps to one line, so a long
 * address is cut with an ellipsis and read in full on hover.
 */
export function OrderFacts({ facts }: { facts: Fact[] }) {
  return (
    <dl className="gap-x-ws-5 gap-y-ws-9 grid grid-cols-2">
      {facts.map((fact) => (
        <div key={fact.label} className="gap-ws-3 flex min-w-0 flex-col">
          <dt className="typography-body-sm text-ws-static-subtle">{fact.label}</dt>
          <dd className="typography-body-md text-ws-static-base truncate" title={fact.value}>
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
