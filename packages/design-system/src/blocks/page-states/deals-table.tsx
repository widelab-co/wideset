import { StatusBadge, Table } from '@wideset/react';

import type { Deal } from './data';
import { formatDate, formatUsd } from './format';

/**
 * The loaded state: the module's real content, a short table. A stage is a lifecycle state, so
 * every badge stays neutral; the value is a number, so it sits right in tabular figures.
 */
export function DealsTable({ deals }: { deals: Deal[] }) {
  return (
    // Fixed layout: the short columns keep their width, the name takes the rest and truncates.
    <Table aria-label="Open deals" className="w-full table-fixed whitespace-nowrap">
      <Table.Head>
        <Table.Row>
          <Table.Header>Deal</Table.Header>
          <Table.Header className="w-[7rem]">Stage</Table.Header>
          <Table.Header className="w-[7.75rem]">Close date</Table.Header>
          <Table.Header align="right" className="w-[6.25rem]">
            Value
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {deals.map((deal) => (
          <Table.Row key={deal.id}>
            <Table.Cell truncate className="text-ws-static-strong">
              {deal.name}
            </Table.Cell>
            <Table.Cell>
              <StatusBadge size="sm">{deal.stage}</StatusBadge>
            </Table.Cell>
            <Table.Cell className="tabular-nums">{formatDate(deal.closes)}</Table.Cell>
            <Table.Cell align="right" className="tabular-nums">
              {formatUsd(deal.value)}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
