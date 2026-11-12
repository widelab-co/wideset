// TODO(custom): a folder tree (rows that expand and collapse, one chosen, the current folder marked, an inline field naming a new folder); Wideset has no Tree or TreeView.
import { RiArrowRightSLine, RiCheckLine, RiFolder3Line } from '@remixicon/react';
import { cn, TextInput } from '@wideset/react';
import { type KeyboardEvent, type RefObject, useId, useRef, useState } from 'react';

import { type Folder, ROOT } from './data';

/** Where a row starts, by depth: 20px a level, the chevron and its gap, so names line up. */
const INDENT = ['pl-ws-3', 'pl-ws-12', 'pl-ws-17', 'pl-ws-20', 'pl-ws-22'];
const ROW =
  'h-ws-14 gap-ws-3 pr-ws-5 rounded-ws-control-lg typography-label-sm flex items-center outline-ws-dynamic-primary-strong-default focus-visible:wds-focus-visible focus-visible:-outline-offset-2';

export type TreeRow = {
  folder: Folder;
  depth: number;
  hasChildren: boolean;
  /** Its place among its siblings on screen, for screen readers. */
  position: number;
  siblings: number;
};

const childrenOf = (folders: Folder[], id: string) =>
  folders
    .filter((folder) => folder.parent === id)
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));

/**
 * The rows on screen, top to bottom: All files, then every folder whose parent is open. While
 * searching, only the folders that match and the folders that lead to them, all open, so a match
 * deep in the tree shows with its path.
 */
export function treeRows(folders: Folder[], expanded: string[], query: string): TreeRow[] {
  const words = query.trim().toLowerCase();
  const leadsToMatch = (folder: Folder): boolean =>
    folder.name.toLowerCase().includes(words) || childrenOf(folders, folder.id).some(leadsToMatch);
  const rows: TreeRow[] = [];
  const walk = (parent: Folder, depth: number) => {
    const kids = childrenOf(folders, parent.id).filter((kid) => !words || leadsToMatch(kid));
    kids.forEach((folder, index) => {
      const hasChildren = childrenOf(folders, folder.id).length > 0;
      rows.push({ folder, depth, hasChildren, position: index + 1, siblings: kids.length });
      if (words || expanded.includes(folder.id)) walk(folder, depth + 1);
    });
  };
  const root = folders.find((folder) => folder.id === ROOT)!;
  rows.push({ folder: root, depth: 0, hasChildren: true, position: 1, siblings: 1 });
  if (words || expanded.includes(ROOT)) walk(root, 1);
  return rows;
}

type FolderTreeProps = {
  rows: TreeRow[];
  /** While searching every row is open and the chevrons rest. */
  searching: boolean;
  expanded: string[];
  onExpandedChange: (expanded: string[]) => void;
  /** The folder the files are in: marked, and not a place to move them to. */
  current: string;
  chosen?: string;
  onChoose: (id: string) => void;
  /** The folder a new one is being named in: the field shows as its first child. */
  naming?: string;
  /** Tries the name: the new folder's id, or why it cannot be used. */
  onName: (name: string) => { id: string } | { error: string };
  onNamingEnd: () => void;
  treeRef: RefObject<HTMLUListElement | null>;
};

/**
 * Naming a new folder, in the tree where it will be: a field at the folder's depth that takes the
 * focus. Enter makes it, Esc drops it, and leaving the field keeps a good name and drops an empty
 * one. A name already used beside it, or no name, is said under the field.
 */
function NewFolderField({
  depth,
  onName,
  onDone,
}: {
  depth: number;
  onName: FolderTreeProps['onName'];
  /** The new folder's id, or nothing when it was dropped. */
  onDone: (made?: string) => void;
}) {
  const id = useId();
  const [name, setName] = useState('');
  const [error, setError] = useState<string>();
  const done = useRef(false);

  const finish = (commit: boolean) => {
    if (done.current) return;
    const result = commit ? onName(name) : undefined;
    if (result && 'error' in result) {
      setError(result.error);
      return;
    }
    done.current = true;
    onDone(result?.id);
  };

  return (
    <li role="treeitem" aria-level={depth + 1} aria-selected={false} className="py-ws-2">
      <div className={cn('gap-ws-3 flex items-start', INDENT[depth])}>
        <span className="size-ws-9 shrink-0" />
        <div className="gap-ws-3 flex min-w-0 flex-1 flex-col">
          <TextInput
            variant={error ? 'danger' : undefined}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError(undefined);
            }}
          >
            <TextInput.Prefix inner>
              <TextInput.Icon icon={RiFolder3Line} />
            </TextInput.Prefix>
            <TextInput.Input
              // A field that appears because it was asked for takes the focus.
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              placeholder="Folder name"
              aria-label="New folder name"
              // Scrolled into view with the field's border and its error, not the text alone.
              className="scroll-my-ws-12"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  finish(true);
                }
                // The dialog leaves Esc to the field while it is open (see MoveDialog).
                if (event.key === 'Escape') finish(false);
              }}
              onBlur={() => finish(name.trim() !== '' && !error)}
            />
          </TextInput>
          {error && (
            <p id={`${id}-error`} className="typography-body-sm text-ws-semantic-negative">
              {error}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

/**
 * Where the files can go, as the folders nest: a single-select tree, one tab stop. The arrows
 * move up and down, Right opens a folder (or steps into it), Left closes it (or steps out), Enter
 * or a click chooses; the chevron opens and closes without choosing. The chosen folder takes the
 * brand tint and a tick, the selected treatment; the current folder stays in its place, quiet,
 * named as such, so the tree keeps its shape and the reader knows where they are.
 */
export function FolderTree({
  rows,
  searching,
  expanded,
  onExpandedChange,
  current,
  chosen,
  onChoose,
  naming,
  onName,
  onNamingEnd,
  treeRef,
}: FolderTreeProps) {
  const [focused, setFocused] = useState<string>();
  // A folder just made takes the focus once its row is on screen.
  const [focusNext, setFocusNext] = useState<string>();

  const ids = rows.map((row) => row.folder.id);
  const tabStop = [focused, chosen].find((item) => item && ids.includes(item)) ?? ids[0];
  const toggle = (folder: string, open: boolean) =>
    onExpandedChange(open ? [...expanded, folder] : expanded.filter((item) => item !== folder));

  const keyDown = (event: KeyboardEvent<HTMLLIElement>, index: number) => {
    const { folder, depth, hasChildren } = rows[index];
    const open = hasChildren && (searching || expanded.includes(folder.id));
    const focusRow = (at: number) =>
      treeRef.current
        ?.querySelector<HTMLElement>(`[data-folder="${rows[at]?.folder.id}"]`)
        ?.focus();
    const keys: Record<string, () => void> = {
      ArrowDown: () => focusRow(Math.min(index + 1, rows.length - 1)),
      ArrowUp: () => focusRow(Math.max(index - 1, 0)),
      Home: () => focusRow(0),
      End: () => focusRow(rows.length - 1),
      ArrowRight: () => {
        if (!hasChildren) return;
        if (!open) toggle(folder.id, true);
        else focusRow(index + 1);
      },
      ArrowLeft: () => {
        if (open && !searching) toggle(folder.id, false);
        else focusRow(rows.findLastIndex((row, at) => at < index && row.depth === depth - 1));
      },
      Enter: () => folder.id !== current && onChoose(folder.id),
      ' ': () => folder.id !== current && onChoose(folder.id),
    };
    if (!keys[event.key]) return;
    event.preventDefault();
    keys[event.key]();
  };

  return (
    <ul ref={treeRef} role="tree" aria-label="Folders" className="flex flex-col">
      {rows.map(({ folder, depth, hasChildren, position, siblings }, index) => {
        const open = hasChildren && (searching || expanded.includes(folder.id));
        const isCurrent = folder.id === current;
        const isChosen = folder.id === chosen;
        return [
          <li
            key={folder.id}
            ref={folder.id === focusNext ? (element) => element?.focus() : undefined}
            data-folder={folder.id}
            role="treeitem"
            aria-level={depth + 1}
            aria-posinset={position}
            aria-setsize={siblings}
            aria-expanded={hasChildren ? open : undefined}
            aria-selected={isChosen}
            aria-disabled={isCurrent || undefined}
            tabIndex={folder.id === tabStop ? 0 : -1}
            onFocus={(event) => {
              if (event.target !== event.currentTarget) return;
              setFocused(folder.id);
              setFocusNext(undefined);
            }}
            onClick={() => !isCurrent && onChoose(folder.id)}
            onKeyDown={(event) => keyDown(event, index)}
            className={cn(
              ROW,
              INDENT[depth],
              isCurrent
                ? 'text-ws-static-subtle cursor-default'
                : 'text-ws-static-strong hover:bg-ws-dynamic-tertiary-alpha-strong-default cursor-pointer',
              isChosen &&
                'bg-ws-dynamic-primary-alpha-strong-default hover:bg-ws-dynamic-primary-alpha-strong-hover',
            )}
          >
            {/* The keyboard opens and closes with Right and Left; the chevron is for the pointer. */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <span
              aria-hidden="true"
              onClick={(event) => {
                event.stopPropagation();
                if (hasChildren && !searching) toggle(folder.id, !open);
              }}
              className="size-ws-9 text-ws-static-subtle flex shrink-0 items-center justify-center"
            >
              {hasChildren && (
                <RiArrowRightSLine
                  className={cn('size-ws-9 transition-transform', open && 'rotate-90')}
                />
              )}
            </span>
            <RiFolder3Line
              aria-hidden="true"
              className="size-ws-9 text-ws-static-subtle shrink-0"
            />
            <span className="ml-ws-3 min-w-0 flex-1 truncate">{folder.name}</span>
            {isCurrent && (
              <span className="typography-caption-md text-ws-static-subtle shrink-0">
                Current folder
              </span>
            )}
            {isChosen && (
              <RiCheckLine
                aria-hidden="true"
                className="size-ws-9 text-ws-dynamic-primary-default shrink-0"
              />
            )}
          </li>,
          naming === folder.id && (
            <NewFolderField
              key="new-folder"
              depth={depth + 1}
              onName={onName}
              onDone={(made) => {
                if (made) setFocusNext(made);
                onNamingEnd();
              }}
            />
          ),
        ];
      })}
    </ul>
  );
}
