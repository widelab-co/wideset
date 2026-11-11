// TODO(custom): whole-row link done with a stretched <a>; Table has no row link.
import { StatusBadge, Table } from '@wideset/react';

import type { Deal } from './data';
import { formatDay, formatUsd } from './format';

/**
 * What the person is working on: one row per open deal, opened from anywhere on the row. Stages
 * are lifecycle states, so every badge stays neutral and the word carries it.
 */
export function DealsTable({ deals }: { deals: Deal[] }) {
  return (
    // Auto layout: the short columns keep to one line and their width, the customer takes the rest.
    <Table size="md" interactive aria-label="Open deals" className="w-full">
      <Table.Head>
        <Table.Row>
          <Table.Header className="w-full">Customer</Table.Header>
          <Table.Header>Stage</Table.Header>
          <Table.Header align="right">Amount</Table.Header>
          <Table.Header align="right" className="whitespace-nowrap">
            Close date
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {deals.map((deal) => (
          // The customer's link stretches over the whole row: one target, the hover on every cell.
          <Table.Row key={deal.id} className="relative">
            <Table.Cell>
              <a
                href={`#deal-${deal.id}`}
                className="text-ws-static-strong focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default after:inset-ws-0 after:absolute"
              >
                {deal.customer}
              </a>
              <Table.CellDescription>{deal.name}</Table.CellDescription>
            </Table.Cell>
            <Table.Cell>
              <StatusBadge size="sm">{deal.stage}</StatusBadge>
            </Table.Cell>
            <Table.Cell align="right">
              <span className="typography-number-sm text-ws-static-strong tabular-nums">
                {formatUsd(deal.amount)}
              </span>
            </Table.Cell>
            <Table.Cell align="right" className="whitespace-nowrap tabular-nums">
              {formatDay(deal.closeDate)}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
