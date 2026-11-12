// TODO(custom): key-value facts strip (label above value); no DescriptionList in Wideset.
import { StatusBadge } from '@wideset/react';

import type { Fact } from './data';

/**
 * A record's facts in one row, each label above its value, so they fit over the story instead of
 * trailing under it. A status reads as a badge in its colour; the row wraps when it runs out of
 * width.
 */
export function FactsList({ facts }: { facts: Fact[] }) {
  return (
    <dl className="gap-x-ws-14 gap-y-ws-9 flex flex-wrap">
      {facts.map(({ label, value, status }) => (
        <div key={label} className="gap-ws-3 flex min-w-0 flex-col">
          <dt className="typography-label-sm text-ws-static-subtle">{label}</dt>
          <dd className="typography-body-md text-ws-static-base tabular-nums">
            {status ? (
              <StatusBadge size="sm" color={status}>
                {value}
              </StatusBadge>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
