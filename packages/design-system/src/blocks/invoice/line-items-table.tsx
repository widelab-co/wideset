import { Table } from '@wideset/react';

import { invoice, lineAmount } from './data';
import { formatUsd } from './format';

/**
 * What the invoice charges for: one row per line, quantity times unit price. The outer columns
 * are flush, so the descriptions start on the document's edge and the amounts end on it.
 */
export function LineItemsTable() {
  return (
    <Table size="md" aria-label="Invoice lines" className="w-full">
      <Table.Head>
        <Table.Row>
          <Table.Header flushMargin className="w-full">
            Description
          </Table.Header>
          <Table.Header align="right">Qty</Table.Header>
          <Table.Header align="right" className="whitespace-nowrap">
            Unit price
          </Table.Header>
          <Table.Header align="right" flushMargin>
            Amount
          </Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {invoice.lines.map((line) => (
          <Table.Row key={line.id}>
            <Table.Cell flushMargin>
              <span className="text-ws-static-strong">{line.description}</span>
              <Table.CellDescription>{line.detail}</Table.CellDescription>
            </Table.Cell>
            <Table.Cell align="right" className="whitespace-nowrap tabular-nums">
              {line.quantity} {line.unit}
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
