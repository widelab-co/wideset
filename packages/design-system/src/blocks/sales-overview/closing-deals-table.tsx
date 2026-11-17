import { cn, type SortDirection, StatusBadge, type StatusBadgeProps, Table } from '@wideset/react';
import { type ReactNode, useId, useState } from 'react';

import { CLOSING, type Deal } from './data';
import { formatCount, formatDay, formatUsd } from './format';
import { PersonAvatar } from './person-avatar';

const STAGE_ORDER: Record<Deal['stage'], number> = { Proposal: 0, Negotiation: 1, Commit: 2 };

/**
 * A stage's colour says how the deal stands: a proposal is out and in progress, a negotiation
 * still needs a look before it can close, a commit is as good as won.
 */
const STAGE_COLOR: Record<Deal['stage'], NonNullable<StatusBadgeProps['color']>> = {
  Proposal: 'info',
  Negotiation: 'notice',
  Commit: 'positive',
};

type Column = {
  key: string;
  label: string;
  /** What the column sorts by. */
  value: (deal: Deal) => string | number;
  cell: (deal: Deal) => ReactNode;
  numeric?: boolean;
  className?: string;
};

const COLUMNS: Column[] = [
  {
    key: 'deal',
    label: 'Deal',
    value: (deal) => deal.name,
    cell: (deal) => <span className="text-ws-static-strong">{deal.name}</span>,
    className: 'w-[22%]',
  },
  {
    key: 'account',
    label: 'Account',
    value: (deal) => deal.account,
    cell: (deal) => deal.account,
    className: 'w-[17%]',
  },
  {
    key: 'owner',
    label: 'Owner',
    value: (deal) => deal.owner.name,
    cell: (deal) => (
      <span className="gap-ws-5 flex items-center">
        <PersonAvatar
          size="sm"
          name={deal.owner.name}
          initials={deal.owner.initials}
          color={deal.owner.color}
          aria-hidden
        />
        <span className="truncate">{deal.owner.name}</span>
      </span>
    ),
    className: 'w-[17%]',
  },
  {
    key: 'stage',
    label: 'Stage',
    value: (deal) => STAGE_ORDER[deal.stage],
    cell: (deal) => <StatusBadge color={STAGE_COLOR[deal.stage]}>{deal.stage}</StatusBadge>,
    className: 'w-[14%]',
  },
  {
    key: 'close',
    label: 'Close date',
    value: (deal) => deal.close,
    cell: (deal) => <span className="tabular-nums">{formatDay(deal.close)}</span>,
    className: 'w-[15%]',
  },
  {
    key: 'amount',
    label: 'Amount',
    value: (deal) => deal.amount,
    cell: (deal) => (
      <span className="text-ws-static-strong tabular-nums">{formatUsd(deal.amount)}</span>
    ),
    numeric: true,
  },
];

// The first and last columns sit on the card's padding, in line with its title.
const flush = (index: number) => index === 0 || index === COLUMNS.length - 1;

/** Open deals expected to close this month, soonest first; every column sorts. */
export function ClosingDealsTable({ className }: { className?: string }) {
  const titleId = useId();
  const [sort, setSort] = useState<{ key: string; direction: SortDirection }>({
    key: 'close',
    direction: 'asc',
  });
  const column = COLUMNS.find((entry) => entry.key === sort.key)!;
  const rows = sort.direction
    ? [...CLOSING].sort((a, b) => {
        const order =
          column.value(a) < column.value(b) ? -1 : column.value(a) > column.value(b) ? 1 : 0;
        return sort.direction === 'asc' ? order : -order;
      })
    : CLOSING;
  const total = CLOSING.reduce((sum, deal) => sum + deal.amount, 0);

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'bg-ws-static-foreground rounded-ws-container-md shadow-ws-low p-ws-11 gap-ws-9 flex flex-col',
        className,
      )}
    >
      <div className="gap-ws-9 flex items-baseline justify-between">
        <h2 id={titleId} className="typography-subtitle-xs text-ws-static-strong">
          Closing this month
        </h2>
        <p className="typography-body-md text-ws-static-subtle tabular-nums">
          {formatUsd(total)} in {formatCount(CLOSING.length)} open deals
        </p>
      </div>
      <Table aria-labelledby={titleId} className="w-full table-fixed">
        <Table.Head>
          <Table.Row>
            {COLUMNS.map((entry, index) => (
              <Table.Header
                key={entry.key}
                align={entry.numeric ? 'right' : 'left'}
                flushMargin={flush(index)}
                className={entry.className}
                sortable
                sortDirection={sort.key === entry.key ? sort.direction : null}
                onSort={() =>
                  setSort((current) => ({
                    key: entry.key,
                    direction:
                      current.key === entry.key && current.direction === 'asc' ? 'desc' : 'asc',
                  }))
                }
              >
                {entry.label}
              </Table.Header>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map((deal) => (
            <Table.Row key={deal.id}>
              {COLUMNS.map((entry, index) => (
                <Table.Cell
                  key={entry.key}
                  align={entry.numeric ? 'right' : 'left'}
                  flushMargin={flush(index)}
                  truncate={index < 2}
                >
                  {entry.cell(deal)}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </section>
  );
}
