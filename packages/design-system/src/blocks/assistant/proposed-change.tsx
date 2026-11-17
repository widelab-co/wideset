// TODO(custom): a proposed change as a small diff of fields (the old value struck through, the new one beside it); Wideset has no diff.
import { RiArrowRightLine, RiCheckLine, RiCloseLine } from '@remixicon/react';
import { Button, Card } from '@wideset/react';

import type { Change } from './data';

type ProposedChangeProps = {
  change: Change;
  onApply: () => void;
  onDiscard: () => void;
};

/**
 * A change the assistant proposes to the record, which nothing touches until Maya applies it:
 * each field with its old value struck through and the new one after it (a new entry has only
 * the new value). While it waits, Apply is the screen's one filled button and Discard sits
 * beside it; once decided, a quiet line says which, and the diff stays as the record of it.
 */
export function ProposedChange({ change, onApply, onDiscard }: ProposedChangeProps) {
  return (
    <Card>
      <Card.Content contentClassName="pr-ws-6">
        <dl className="gap-ws-7 flex flex-col">
          {change.fields.map(({ field, from, to }) => (
            <div key={field} className="gap-ws-2 flex flex-col">
              <dt className="typography-label-sm text-ws-static-subtle">{field}</dt>
              <dd className="typography-body-md gap-x-ws-5 flex flex-wrap items-center text-pretty">
                {from && (
                  <>
                    <del className="text-ws-static-subtle tabular-nums">{from}</del>
                    <RiArrowRightLine
                      aria-label="changes to"
                      role="img"
                      className="size-ws-8 text-ws-static-subtle shrink-0"
                    />
                  </>
                )}
                <ins className="text-ws-static-strong tabular-nums no-underline">{to}</ins>
              </dd>
            </div>
          ))}
        </dl>
      </Card.Content>
      <Card.Footer className="gap-ws-5 items-center justify-end">
        {change.status === 'pending' ? (
          <>
            <Button variant="secondary" preset="ghost" size="sm" onClick={onDiscard}>
              Discard
            </Button>
            <Button size="sm" onClick={onApply}>
              Apply
            </Button>
          </>
        ) : (
          <p
            role="status"
            className="typography-label-sm text-ws-static-subtle gap-ws-3 mr-auto flex items-center"
          >
            {change.status === 'applied' ? (
              <>
                <RiCheckLine aria-hidden className="size-ws-9" />
                Applied to the deal
              </>
            ) : (
              <>
                <RiCloseLine aria-hidden className="size-ws-9" />
                Discarded
              </>
            )}
          </p>
        )}
      </Card.Footer>
    </Card>
  );
}
