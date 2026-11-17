// TODO(custom): transfer row (recipient, date and state, amount); ListItem is a clickable menu row and a Table is too much for four lines.
import { useId } from 'react';

import type { Transfer } from './data';
import { formatDayMonth, formatUsd } from './format';

/**
 * The last payments sent, beside the form as a quiet check: who was paid, when and how much. Text
 * only, no lines and no badges, so it never competes with the payment being made. A state is a
 * word here: every one of them is a lifecycle state.
 */
export function RecentTransfers({ transfers }: { transfers: Transfer[] }) {
  const titleId = useId();

  return (
    <aside aria-labelledby={titleId} className="gap-ws-9 flex flex-col">
      <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
        Recent transfers
      </h2>
      <ul className="gap-ws-9 flex flex-col">
        {transfers.map((transfer) => (
          <li key={transfer.id} className="gap-ws-9 flex items-baseline justify-between">
            <div className="flex min-w-0 flex-col">
              <span className="typography-body-md text-ws-static-base truncate">
                {transfer.recipient}
              </span>
              <span className="typography-caption-md text-ws-static-subtle tabular-nums">
                {formatDayMonth(transfer.date)}, {transfer.status.toLowerCase()}
              </span>
            </div>
            <span className="typography-body-md text-ws-static-base shrink-0 tabular-nums">
              {formatUsd(transfer.amount)}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
