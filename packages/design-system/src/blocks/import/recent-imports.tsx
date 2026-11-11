import { Card, Table } from '@wideset/react';
import { useId } from 'react';

import type { PastImport } from './data';
import { formatCount, formatDate } from './format';

/**
 * The imports run before, newest first, in a card of their own under the step: which file, when,
 * by whom and what each did, the figures right-aligned so they compare down the column. The table
 * sits straight in the card, so its lines run edge to edge; the outer columns take the card's
 * 20px inset, so the first lines up with the title, and the card's border closes the last row.
 */
export function RecentImports({ imports }: { imports: PastImport[] }) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId}>
      <Card>
        <Card.Header>
          <div className="gap-ws-2 flex flex-col">
            <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
              Recent imports
            </h2>
            <p className="typography-body-md text-ws-static-subtle">
              What earlier files added to Orbit.
            </p>
          </div>
        </Card.Header>
        <Table size="sm" aria-labelledby={titleId} className="w-full">
          <Table.Head>
            <Table.Row>
              <Table.Header className="pl-ws-11 w-full">File</Table.Header>
              <Table.Header>Date</Table.Header>
              <Table.Header>By</Table.Header>
              <Table.Header align="right">Added</Table.Header>
              <Table.Header align="right">Updated</Table.Header>
              <Table.Header align="right" className="pr-ws-11">
                Skipped
              </Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body className="[&>tr:last-child>td]:border-b-0">
            {imports.map((entry) => (
              <Table.Row key={entry.id}>
                <Table.Cell className="text-ws-static-strong pl-ws-11">{entry.file}</Table.Cell>
                <Table.Cell className="whitespace-nowrap tabular-nums">
                  {formatDate(entry.date)}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">{entry.by}</Table.Cell>
                <Table.Cell align="right" className="tabular-nums">
                  {formatCount(entry.added)}
                </Table.Cell>
                <Table.Cell align="right" className="tabular-nums">
                  {formatCount(entry.updated)}
                </Table.Cell>
                <Table.Cell align="right" className="pr-ws-11 tabular-nums">
                  {formatCount(entry.skipped)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </section>
  );
}
