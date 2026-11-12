import { Checkbox, Table } from '@wideset/react';

import { type FileEntry, type Folder, PEOPLE } from './data';
import { FileIcon } from './file-icon';
import { formatDateTime, formatModified, formatSize } from './format';
import { PersonAvatar } from './person-avatar';

type FilesTableProps = {
  folders: Folder[];
  files: FileEntry[];
  selected: string[];
  onSelectedChange: (ids: string[]) => void;
  onOpenFolder: (id: string) => void;
};

/**
 * One folder's content as a list: its folders first, which open in place, then its files, which
 * a click selects (the checkbox is the same control for the keyboard). Folders take no checkbox
 * here: what is moved, archived or downloaded from this page is files.
 */
export function FilesTable({
  folders,
  files,
  selected,
  onSelectedChange,
  onOpenFolder,
}: FilesTableProps) {
  const ids = files.map((file) => file.id);
  const picked = ids.filter((id) => selected.includes(id)).length;
  const toggle = (id: string) =>
    onSelectedChange(
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
    );

  const name = (kind: FileEntry['kind'] | 'folder', text: string) => (
    <div className="gap-ws-7 flex items-center">
      <FileIcon kind={kind} />
      <span className="text-ws-static-strong min-w-0 truncate" title={text}>
        {text}
      </span>
    </div>
  );
  const owner = (id: FileEntry['owner']) => (
    <div className="gap-ws-5 flex items-center">
      <PersonAvatar
        size="sm"
        name={PEOPLE[id].name}
        initials={PEOPLE[id].initials}
        color={PEOPLE[id].color}
      />
      <span className="truncate">{PEOPLE[id].name}</span>
    </div>
  );
  const modified = (iso: string) => (
    <time dateTime={iso} title={formatDateTime(iso)} className="text-ws-static-subtle">
      {formatModified(iso)}
    </time>
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
            <Table.Header className="w-[11rem]">Owner</Table.Header>
            <Table.Header className="w-[9.5rem]">Modified</Table.Header>
            <Table.Header align="right" className="w-[6rem]">
              Size
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {folders.map((folder) => (
            <Table.Row key={folder.id} onClick={() => onOpenFolder(folder.id)}>
              <Table.Cell />
              <Table.Cell>{name('folder', folder.name)}</Table.Cell>
              <Table.Cell>{owner(folder.owner)}</Table.Cell>
              <Table.Cell>{modified(folder.modified)}</Table.Cell>
              <Table.Cell align="right">
                <span className="text-ws-static-subtle">—</span>
              </Table.Cell>
            </Table.Row>
          ))}
          {files.map((file) => {
            const isSelected = selected.includes(file.id);
            return (
              <Table.Row key={file.id} selected={isSelected} onClick={() => toggle(file.id)}>
                <Table.Cell onClick={(event) => event.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggle(file.id)}
                    aria-label={`Select ${file.name}`}
                  />
                </Table.Cell>
                <Table.Cell>{name(file.kind, file.name)}</Table.Cell>
                <Table.Cell>{owner(file.owner)}</Table.Cell>
                <Table.Cell>{modified(file.modified)}</Table.Cell>
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
