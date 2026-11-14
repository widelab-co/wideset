import { RiArrowGoBackLine } from '@remixicon/react';
import { Button, Table } from '@wideset/react';

import { type Item, PEOPLE, TRASH_DAYS } from './data';
import { FileIcon } from './file-icon';
import { formatDateTime, formatDaysLeft, formatModified, formatSize } from './format';
import { PersonAvatar } from './person-avatar';

/**
 * What has been put away, with the one way back on each row. In the trash it also says when
 * each file goes for good, counted from the day it was deleted; archived files stay until
 * someone restores or deletes them.
 */
export function RestoreTable({
  rows,
  trash,
  onRestore,
}: {
  rows: Item[];
  /** The trash, rather than the archive. */
  trash: boolean;
  onRestore: (item: Item) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table size="md" className="min-w-[44rem] table-fixed">
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header className="w-[10rem]">Owner</Table.Header>
            <Table.Header className="w-[9rem]">{trash ? 'Deleted' : 'Archived'}</Table.Header>
            {trash ? (
              <Table.Header className="w-[9.5rem]">Deleted for good</Table.Header>
            ) : (
              <Table.Header align="right" className="w-[6rem]">
                Size
              </Table.Header>
            )}
            <Table.Header className="w-[7.5rem]">
              <span className="sr-only">Restore</span>
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map((item) => {
            const owner = PEOPLE[item.owner];
            const putAway = item.putAway ?? item.modified;
            return (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <div className="gap-ws-7 flex items-center">
                    <FileIcon kind={item.kind} name={item.name} />
                    <span className="text-ws-static-strong min-w-0 truncate" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="gap-ws-5 flex items-center">
                    <PersonAvatar
                      size="sm"
                      name={owner.name}
                      initials={owner.initials}
                      color={owner.color}
                    />
                    <span className="truncate">{owner.name}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <time dateTime={putAway} title={formatDateTime(putAway)}>
                    {formatModified(putAway)}
                  </time>
                </Table.Cell>
                {trash ? (
                  <Table.Cell className="text-ws-static-subtle">
                    {formatDaysLeft(putAway, TRASH_DAYS)}
                  </Table.Cell>
                ) : (
                  <Table.Cell align="right" className="tabular-nums">
                    {item.size === undefined ? '—' : formatSize(item.size)}
                  </Table.Cell>
                )}
                <Table.Cell align="right">
                  <Button
                    size="sm"
                    variant="secondary"
                    preset="ghost"
                    onClick={() => onRestore(item)}
                    aria-label={`Restore ${item.name}`}
                  >
                    <Button.Icon icon={RiArrowGoBackLine} />
                    Restore
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
