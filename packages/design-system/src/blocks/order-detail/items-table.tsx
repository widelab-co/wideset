import { Table } from '@wideset/react';

import { lineAmount, order } from './data';
import { formatUsd } from './format';

/**
 * What was ordered: one row per item, quantity times unit price. It sits straight in its card, so
 * the row lines run from edge to edge; the outer columns take the card's 20px inset, so the names
 * start on the card title's line and the amounts end over the totals.
 */
export function ItemsTable() {
  return (
    <Table size="md" aria-label="Order items" className="w-full">
      <Table.Head>
        <Table.Row>
          <Table.Header className="pl-ws-11 w-full">Product</Table.Header>
          <Table.Header align="right">Quantity</Table.Header>
          <Table.Header align="right" className="whitespace-nowrap">
            Unit price
          </Table.Header>
          <Table.Header align="right" className="pr-ws-11">
            Amount
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {order.lines.map((line) => (
          <Table.Row key={line.id}>
            <Table.Cell className="pl-ws-11">
              <span className="text-ws-static-strong">{line.name}</span>
              <Table.CellDescription>{line.detail}</Table.CellDescription>
            </Table.Cell>
            <Table.Cell align="right" className="tabular-nums">
              {line.quantity}
            </Table.Cell>
            <Table.Cell align="right" className="tabular-nums">
              {formatUsd(line.unitPrice)}
            </Table.Cell>
            <Table.Cell align="right" className="pr-ws-11 tabular-nums">
              {formatUsd(lineAmount(line))}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
