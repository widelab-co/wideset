import { RiArrowDownLine, RiArrowDownSLine, RiArrowUpLine } from '@remixicon/react';
import { Button, cn, DropdownMenu, ListItem } from '@wideset/react';
import { useState } from 'react';

import { TRANSACTIONS } from './data';
import { formatCoin, formatTime } from './format';

const FILTERS = [
  { value: 'all', label: 'All transactions' },
  { value: 'sent', label: 'Sent' },
  { value: 'received', label: 'Received' },
] as const;

/** Today's transfers, newest first, with a filter by direction. */
export function Transactions({ className }: { className?: string }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>(FILTERS[0]);
  const rows = TRANSACTIONS.filter((tx) => filter.value === 'all' || tx.direction === filter.value);

  return (
    <section aria-labelledby="transactions-title" className={cn('flex flex-col', className)}>
      <h2 id="transactions-title" className="typography-subtitle-xs text-ws-static-base">
        Today’s transactions
      </h2>

      {rows.length > 0 ? (
        <ul className="mt-ws-14 gap-ws-13 flex flex-col">
          {rows.map((tx) => {
            const Icon = tx.direction === 'sent' ? RiArrowUpLine : RiArrowDownLine;
            return (
              <li key={tx.id} className="gap-ws-12 flex items-center">
                <span className="bg-ws-static-highlight-base text-ws-dynamic-secondary-default size-ws-16 rounded-ws-control-full flex shrink-0 items-center justify-center">
                  <Icon aria-hidden className="size-ws-11" />
                </span>
                <div className="gap-ws-3 flex min-w-0 flex-1 flex-col">
                  <span className="typography-number-sm text-ws-static-strong">
                    {formatCoin(tx.amount, tx.coin)}
                  </span>
                  <span className="typography-body-md text-ws-static-subtle">
                    {tx.direction === 'sent' ? 'Sent to' : 'Received from'} •••• {tx.address}
                  </span>
                </div>
                <time dateTime={tx.at} className="typography-number-sm text-ws-static-subtle">
                  {formatTime(tx.at)}
                </time>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-ws-14 typography-body-md text-ws-static-subtle">
          No {filter.label.toLowerCase()} transactions today.
        </p>
      )}

      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary" preset="border" size="sm" className="mt-auto self-start">
            {filter.label}
            <Button.Icon icon={RiArrowDownSLine} />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start">
          {FILTERS.map((item) => (
            <DropdownMenu.Item key={item.value} onSelect={() => setFilter(item)}>
              <ListItem.Content>
                <ListItem.Label>{item.label}</ListItem.Label>
              </ListItem.Content>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu>
    </section>
  );
}
