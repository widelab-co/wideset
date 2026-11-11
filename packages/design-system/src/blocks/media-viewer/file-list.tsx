import { Avatar, Table } from '@wideset/react';

import { type FileItem, PEOPLE } from './data';
import { FileIcon } from './file-icon';
import { formatDateTime, formatModified, formatSize } from './format';

/** The id of a file's name button, so the viewer can give the focus back to it on close. */
export const fileButtonId = (id: string) => `file-${id}`;

/**
 * The folder's files as a list. A row is one target: clicking anywhere on it opens the file in
 * the viewer. The name is a button, so the keyboard reaches each file and the viewer has a
 * control to return the focus to; its click reaches the row like any other.
 */
export function FileList({ files, onOpen }: { files: FileItem[]; onOpen: (id: string) => void }) {
  return (
    <div className="overflow-x-auto">
      <Table size="md" interactive className="min-w-[40rem] table-fixed">
        <Table.Head>
          <Table.Row>
            <Table.Header>Name</Table.Header>
            <Table.Header className="w-[11rem]">Owner</Table.Header>
            <Table.Header className="w-[9.5rem]">Modified</Table.Header>
            <Table.Header align="right" className="w-[6rem]">
              Size
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {files.map((file) => {
            const owner = PEOPLE[file.owner];
            return (
              <Table.Row key={file.id} onClick={() => onOpen(file.id)}>
                <Table.Cell>
                  <div className="gap-ws-7 flex items-center">
                    <FileIcon kind={file.kind} />
                    <button
                      type="button"
                      id={fileButtonId(file.id)}
                      className="text-ws-static-strong focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default rounded-ws-control-sm min-w-0 truncate text-left"
                    >
                      {file.name}
                    </button>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="gap-ws-5 flex items-center">
                    <Avatar size="sm" initials={owner.initials} color={owner.color} />
                    <span className="truncate">{owner.name}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <time
                    dateTime={file.modified}
                    title={formatDateTime(file.modified)}
                    className="text-ws-static-subtle"
                  >
                    {formatModified(file.modified)}
                  </time>
                </Table.Cell>
                <Table.Cell align="right" className="tabular-nums">
                  {formatSize(file.size)}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
