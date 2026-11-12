import { RiFileChartLine, RiFolder3Line } from '@remixicon/react';
import { Table } from '@wideset/react';

import { type Entry, PEOPLE } from './data';
import { formatDay, formatLongDay, formatReports } from './format';
import { PersonAvatar } from './person-avatar';
import { RowMenu } from './row-menu';

type ReportsTableProps = {
  entries: Entry[];
  today: string;
  onDelete: (entry: Entry) => void;
};

/**
 * The folders, then the reports, one row each: what it is (a folder counts its reports, a report
 * says when it is sent out), whose it is, who else sees it, when it last changed, and its menu.
 * The kind is a quiet line icon, the same grey for both: it tells them apart, it is not a
 * judgement.
 */
export function ReportsTable({ entries, today, onDelete }: ReportsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table size="md" aria-label="Reports and folders" className="min-w-[44rem] table-fixed">
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header className="w-[11rem]">Owner</Table.Header>
            <Table.Header className="w-[9rem]">Shared with</Table.Header>
            <Table.Header className="w-[8rem]">Updated</Table.Header>
            <Table.Header className="w-[3.5rem]">
              <span className="sr-only">Actions</span>
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {entries.map((entry) => {
            const owner = PEOPLE[entry.owner];
            const Icon = entry.kind === 'folder' ? RiFolder3Line : RiFileChartLine;
            return (
              <Table.Row key={entry.id}>
                <Table.Cell>
                  <div className="gap-ws-7 flex items-center">
                    <Icon aria-hidden="true" className="size-ws-9 text-ws-static-subtle shrink-0" />
                    <div className="flex min-w-0 flex-col">
                      <span className="text-ws-static-strong truncate">{entry.name}</span>
                      <Table.CellDescription>
                        {entry.kind === 'folder'
                          ? formatReports(entry.reports ?? 0)
                          : entry.schedule}
                      </Table.CellDescription>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="gap-ws-5 flex items-center">
                    <PersonAvatar
                      size="sm"
                      name={owner.name}
                      initials={owner.initials}
                      color={owner.color}
                      aria-hidden
                    />
                    <span className="truncate">{owner.name}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>{entry.sharedWith}</Table.Cell>
                <Table.Cell>
                  <time
                    dateTime={entry.updated}
                    title={formatLongDay(entry.updated)}
                    className="text-ws-static-subtle"
                  >
                    {formatDay(entry.updated, today)}
                  </time>
                </Table.Cell>
                <Table.Cell align="right">
                  <RowMenu entry={entry} onDelete={() => onDelete(entry)} />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
