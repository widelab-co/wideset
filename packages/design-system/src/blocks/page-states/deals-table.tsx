import { StatusBadge, type StatusBadgeProps, Table } from '@wideset/react';

import type { Deal } from './data';
import { formatDate, formatUsd } from './format';

/** A stage in the colour of what it says about the deal, the same in every block. */
const STAGE_COLOR: Record<Deal['stage'], StatusBadgeProps['color']> = {
  Discovery: 'neutral',
  Qualified: 'neutral',
  Proposal: 'info',
  Negotiation: 'notice',
};

/**
 * The loaded state: the module's real content, a short table. A stage takes the colour of what
 * it says about the deal; the value is a number, so it sits right in tabular figures.
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
          <Table.Header align="right" className="w-[6.5rem]">
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
              <StatusBadge size="sm" color={STAGE_COLOR[deal.stage]}>
                {deal.stage}
              </StatusBadge>
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
