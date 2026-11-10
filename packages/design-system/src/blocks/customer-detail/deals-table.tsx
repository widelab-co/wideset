import { StatusBadge, Table } from '@wideset/react';

import type { Deal } from './data';
import { formatDay, formatEuro } from './format';

/**
 * Deals with this customer: one row per deal, opened from anywhere on the row. Stages are
 * lifecycle states, so every badge stays neutral and the word carries it.
 */
export function DealsTable({ deals, label }: { deals: Deal[]; label: string }) {
  return (
    // Auto layout: the short columns keep to one line and their width, the deal takes the rest.
    <Table size="md" interactive aria-label={label} className="w-full">
      <Table.Head>
        <Table.Row>
          <Table.Header className="w-full">Deal</Table.Header>
          <Table.Header>Stage</Table.Header>
          <Table.Header className="whitespace-nowrap">Close date</Table.Header>
          <Table.Header align="right">ARR</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {deals.map((deal) => (
          // The name's link stretches over the whole row: one target, the hover on every cell.
          <Table.Row key={deal.id} className="relative">
            <Table.Cell>
              <a
                href={`#deal-${deal.id}`}
                className="text-ws-static-strong focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default after:inset-ws-0 after:absolute"
              >
                {deal.name}
              </a>
              <Table.CellDescription>
                {deal.kind} · {deal.owner.name}
              </Table.CellDescription>
            </Table.Cell>
            <Table.Cell>
              <StatusBadge size="sm">{deal.stage}</StatusBadge>
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap tabular-nums">
              {formatDay(deal.closeDate)}
            </Table.Cell>
            <Table.Cell align="right">
              <span className="typography-number-sm text-ws-static-strong tabular-nums">
                {formatEuro(deal.value)}
              </span>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
