import { RiPushpinFill, RiPushpinLine } from '@remixicon/react';
import { Avatar, Checkbox, cn, IconButton, ProgressBar, Table } from '@wideset/react';

import { type Item, PEOPLE } from './data';
import { FileIcon } from './file-icon';
import { formatDateTime, formatModified, formatSize } from './format';
import { type RowAction, RowMenu } from './row-menu';

type FilesTableProps = {
  rows: Item[];
  selected: string[];
  onSelectedChange: (ids: string[]) => void;
  /** A folder opens in place; a file would open in its own viewer. */
  onOpen: (item: Item) => void;
  onAction: (item: Item, action: RowAction) => void;
};

/**
 * The files as a list. A folder row opens the folder; a file row selects the file, and its
 * checkbox is the same control for the keyboard. The pin mark shows on pinned files and, on
 * hover, on the others, where it pins with one click. A file still uploading shows its progress
 * where its date will be, and cannot be selected yet.
 */
export function FilesTable({
  rows,
  selected,
  onSelectedChange,
  onOpen,
  onAction,
}: FilesTableProps) {
  const ids = rows.filter((row) => row.progress === undefined).map((row) => row.id);
  const picked = ids.filter((id) => selected.includes(id)).length;
  const toggle = (id: string) =>
    onSelectedChange(
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
    );

  return (
    <div className="overflow-x-auto">
      <Table size="md" selectionMode="multiple" className="min-w-[44rem] table-fixed">
        <Table.Head>
          <Table.Row>
            <Table.Header className="w-[3.25rem]">
              <Checkbox
                aria-label="Select all files"
                disabled={ids.length === 0}
                checked={picked === 0 ? false : picked === ids.length ? true : 'indeterminate'}
                onCheckedChange={(checked) =>
                  onSelectedChange(
                    checked === true
                      ? [...new Set([...selected, ...ids])]
                      : selected.filter((id) => !ids.includes(id)),
                  )
                }
              />
            </Table.Header>
            <Table.Header>Name</Table.Header>
            <Table.Header className="w-[10rem]">Owner</Table.Header>
            <Table.Header className="w-[9.5rem]">Modified</Table.Header>
            <Table.Header align="right" className="w-[5.5rem]">
              Size
            </Table.Header>
            <Table.Header className="w-[5rem]">
              <span className="sr-only">Pinned and actions</span>
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map((item) => {
            const owner = PEOPLE[item.owner];
            const uploading = item.progress !== undefined;
            const isSelected = selected.includes(item.id);
            const folder = item.kind === 'folder';
            return (
              <Table.Row
                key={item.id}
                selected={isSelected}
                onClick={uploading ? undefined : () => (folder ? onOpen(item) : toggle(item.id))}
                className="group/row"
              >
                <Table.Cell onClick={(event) => event.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    disabled={uploading}
                    onCheckedChange={() => toggle(item.id)}
                    aria-label={`Select ${item.name}`}
                  />
                </Table.Cell>
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
                    <Avatar size="sm" initials={owner.initials} color={owner.color} />
                    <span className="truncate">{owner.name}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  {uploading ? (
                    <ProgressBar
                      value={Math.round((item.progress ?? 0) * 100)}
                      aria-label={`Uploading ${item.name}`}
                    />
                  ) : (
                    <time
                      dateTime={item.modified}
                      title={formatDateTime(item.modified)}
                      className="text-ws-static-subtle"
                    >
                      {formatModified(item.modified)}
                    </time>
                  )}
                </Table.Cell>
                <Table.Cell align="right" className="tabular-nums">
                  {item.size === undefined ? (
                    <span className="text-ws-static-subtle">—</span>
                  ) : (
                    formatSize(item.size)
                  )}
                </Table.Cell>
                {/* Its own targets: their clicks must not open or select the row. */}
                <Table.Cell align="right" onClick={(event) => event.stopPropagation()}>
                  {!uploading && (
                    <div className="gap-ws-2 flex items-center justify-end">
                      <IconButton
                        icon={item.pinned ? RiPushpinFill : RiPushpinLine}
                        size="xs"
                        variant="secondary"
                        preset="ghost"
                        aria-label={`Pin ${item.name}`}
                        aria-pressed={Boolean(item.pinned)}
                        onClick={() => onAction(item, 'pin')}
                        className={cn(
                          !item.pinned &&
                            'opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100',
                        )}
                      />
                      <RowMenu item={item} onAction={(action) => onAction(item, action)} />
                    </div>
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
