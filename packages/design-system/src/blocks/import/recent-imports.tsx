import { Table } from '@wideset/react';

import type { PastImport } from './data';
import { formatCount, formatDate } from './format';
import { Section } from './section';

/**
 * The imports run before, newest first: which file, when, by whom and what each did, the figures
 * right-aligned so they compare down the column. The outer columns are flush with the section.
 */
export function RecentImports({ imports }: { imports: PastImport[] }) {
  return (
    <Section title="Recent imports" description="What earlier files added to Orbit.">
      <Table size="sm" aria-label="Recent imports" className="w-full">
        <Table.Head>
          <Table.Row>
            <Table.Header flushMargin className="w-full">
              File
            </Table.Header>
            <Table.Header>Date</Table.Header>
            <Table.Header>By</Table.Header>
            <Table.Header align="right">Added</Table.Header>
            <Table.Header align="right">Updated</Table.Header>
            <Table.Header align="right" flushMargin>
              Skipped
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {imports.map((entry) => (
            <Table.Row key={entry.id}>
              <Table.Cell flushMargin className="text-ws-static-strong">
                {entry.file}
              </Table.Cell>
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
              <Table.Cell align="right" flushMargin className="tabular-nums">
                {formatCount(entry.skipped)}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Section>
  );
}
