import { Table } from '@wideset/react';

import { lineAmount, order } from './data';
import { formatUsd } from './format';

/**
 * What was ordered: one row per item, quantity times unit price. The outer columns are flush, so
 * the names start on the section's edge and the amounts end on it, over the totals.
 */
export function ItemsTable() {
  return (
    <Table size="md" aria-label="Order items" className="w-full">
      <Table.Head>
        <Table.Row>
          <Table.Header flushMargin className="w-full">
            Product
          </Table.Header>
          <Table.Header align="right">Quantity</Table.Header>
          <Table.Header align="right" className="whitespace-nowrap">
            Unit price
          </Table.Header>
          <Table.Header align="right" flushMargin>
            Amount
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {order.lines.map((line) => (
          <Table.Row key={line.id}>
            <Table.Cell flushMargin>
              <span className="text-ws-static-strong">{line.name}</span>
              <Table.CellDescription>{line.detail}</Table.CellDescription>
            </Table.Cell>
            <Table.Cell align="right" className="tabular-nums">
              {line.quantity}
            </Table.Cell>
            <Table.Cell align="right" className="tabular-nums">
              {formatUsd(line.unitPrice)}
            </Table.Cell>
            <Table.Cell align="right" flushMargin className="tabular-nums">
              {formatUsd(lineAmount(line))}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
