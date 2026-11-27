// TODO(custom): facts read as rows (a term on the left, a sentence beside it, a line above each row); no DescriptionList in Wideset.
import type { Fact } from './data';

/**
 * Facts as rows: what each is about in a fixed column, then one plain sentence. Every row opens
 * under a line and the list closes with one, so it reads like a table without a header and no
 * row is boxed. Sentences start on one edge, which is why the term's column has a fixed width.
 */
export function FactsList({ facts }: { facts: Fact[] }) {
  return (
    <dl className="border-ws-static-subtle flex flex-col border-b">
      {facts.map(({ term, text }) => (
        <div
          key={term}
          className="border-ws-static-subtle gap-ws-9 py-ws-7 typography-body-md flex items-baseline border-t tabular-nums"
        >
          <dt className="text-ws-static-subtle w-[10rem] shrink-0">{term}</dt>
          <dd className="text-ws-static-base min-w-0 flex-1">{text}</dd>
        </div>
      ))}
    </dl>
  );
}
