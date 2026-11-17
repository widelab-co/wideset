import { StatusBadge, Table } from '@wideset/react';

import type { Sort, SortKey } from './conditions';
import { type Deal, OWNERS } from './data';
import { formatDate, formatUsd } from './format';
import { PersonAvatar } from './person-avatar';

const initialsOf = (name: string) =>
  name
    .split(' ')
    .map((word) => word[0])
    .join('');

/**
 * The deals the filter keeps: what each one is and for whom, its stage, owner, close date and
 * amount. A header sorts by its column (again to turn it round), in step with the Sort popover.
 * Stages are lifecycle states, so the badges stay neutral. With nothing left, one row says so.
 */
export function DealsTable({
  rows,
  sort,
  onSort,
}: {
  rows: Deal[];
  sort: Sort;
  onSort: (key: SortKey) => void;
}) {
  const sortable = (key: SortKey) => ({
    sortable: true,
    sortDirection: sort.key === key ? sort.direction : null,
    onSort: () => onSort(key),
  });

  return (
    <div className="overflow-x-auto">
      <Table size="md" className="min-w-[56rem] table-fixed">
        <Table.Head>
          <Table.Row>
            <Table.Header {...sortable('name')}>Deal</Table.Header>
            <Table.Header className="w-[11rem]" {...sortable('customer')}>
              Customer
            </Table.Header>
            <Table.Header className="w-[9rem]" {...sortable('stage')}>
              Stage
            </Table.Header>
            <Table.Header className="w-[11rem]">Owner</Table.Header>
            <Table.Header className="w-[9.5rem]" {...sortable('closeDate')}>
              Close date
            </Table.Header>
            <Table.Header align="right" className="w-[8.5rem]" {...sortable('amount')}>
              Amount
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={6}>
                <span className="text-ws-static-subtle">No deals match these filters.</span>
              </Table.Cell>
            </Table.Row>
          ) : (
            rows.map((deal) => (
              <Table.Row key={deal.id}>
                <Table.Cell>
                  <span className="text-ws-static-strong block truncate">{deal.name}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className="block truncate">{deal.customer}</span>
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge size="sm">{deal.stage}</StatusBadge>
                </Table.Cell>
                <Table.Cell>
                  <div className="gap-ws-5 flex items-center">
                    <PersonAvatar
                      size="sm"
                      name={OWNERS[deal.owner]}
                      initials={initialsOf(OWNERS[deal.owner])}
                    />
                    <span className="truncate">{OWNERS[deal.owner]}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <time dateTime={deal.closeDate} className="tabular-nums">
                    {formatDate(deal.closeDate)}
                  </time>
                </Table.Cell>
                <Table.Cell align="right">
                  <span className="text-ws-static-strong tabular-nums">
                    {formatUsd(deal.amount)}
                  </span>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </div>
  );
}
