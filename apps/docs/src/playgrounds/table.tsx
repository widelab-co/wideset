import { Table } from '@wideset/react';

import { playground } from '../lib/playground-kit';

/**
 * Stage and code come from `examples/table/default.tsx`. Size and the separated, striped and
 * interactive looks come from `TableProps`. Hidden: the per-cell layout props the root
 * passes down (`align`, `placement`, `flushMargin`, `truncate`), which the stage's columns
 * set themselves; `selected`, which belongs on `Table.Row`; the sticky options, which need a
 * scrolling container; `hasBackground`, which only matters under sticky parts; and
 * `selectionMode`, which needs selectable rows and otherwise only turns on the same hover as
 * `interactive`.
 */
export default playground({
  from: 'TableProps',
  hide: [
    'align',
    'placement',
    'flushMargin',
    'truncate',
    'selected',
    'stickyHeader',
    'stickyColumn',
    'hasBackground',
    'selectionMode',
  ],
  labels: { interactive: 'Hoverable rows' },
  group: { interactive: 'State' },
  // The stage's invoice table cut to two columns and two rows, so it draws 1:1 beside its names.
  anatomy: () => (
    <div className="w-[20rem] max-w-full">
      <Table size="md">
        <Table.Head>
          <Table.Row>
            <Table.Header>Customer</Table.Header>
            <Table.Header align="right">Amount</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              Acme Corp
              <Table.CellDescription>Annual plan</Table.CellDescription>
            </Table.Cell>
            <Table.Cell align="right">$1,200.00</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Globex</Table.Cell>
            <Table.Cell align="right">$860.50</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Foot>
          <Table.Row>
            <Table.Cell>Total</Table.Cell>
            <Table.Cell align="right">$2,060.50</Table.Cell>
          </Table.Row>
        </Table.Foot>
      </Table>
    </div>
  ),
});
