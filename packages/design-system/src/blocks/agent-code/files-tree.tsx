// TODO(custom): the repository as a tree with a filter over it (folders that fold, the open file selected, changed files marked and their folders with them); Wideset has no tree view.
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiBracesLine,
  RiCodeSSlashLine,
  RiFolderLine,
  RiFolderOpenLine,
  RiMarkdownLine,
  RiSearchLine,
} from '@remixicon/react';
import { cn, TextInput } from '@wideset/react';
import { type ReactNode, useEffect, useId, useState } from 'react';

import { type Change, FOLDED_ON_LOAD, type RepoFile, REPOSITORY } from './files-data';

const ROW =
  'gap-ws-3 px-ws-5 h-ws-13 rounded-ws-control-lg typography-label-sm hover:bg-ws-dynamic-tertiary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full cursor-pointer items-center text-left';
/** A level in: the guide line sits under the chevron above, the rows start under its icon. */
const NESTED = 'ml-ws-9 pl-ws-3 border-ws-static-subtle border-l';
const ICON = 'size-ws-9 text-ws-static-subtle shrink-0';
/** The column at the end of a row that a change's mark sits in, so letters and dots line up. */
const MARK = 'w-ws-9 flex shrink-0 items-center justify-center';

/** How a change is marked on a file: git's letter, in the colour of its meaning. */
const LETTER: Record<Change, { letter: string; label: string; className: string }> = {
  added: { letter: 'A', label: 'added', className: 'text-ws-semantic-positive' },
  modified: { letter: 'M', label: 'modified', className: 'text-ws-semantic-info' },
};

/** A quiet glyph for the kind of file: prose, data or code. */
const iconOf = (name: string) =>
  name.endsWith('.md') ? RiMarkdownLine : name.endsWith('.json') ? RiBracesLine : RiCodeSSlashLine;

/** Folders first, then files, each by name, as an editor's explorer lists them. */
const byName = (a: string, b: string) => a.localeCompare(b, 'en-US', { sensitivity: 'base' });

/** A folder to show in the tree; `key` asks again for the same one. */
export type Reveal = { path: string; key: number };

type FilesTreeProps = {
  files: RepoFile[];
  /** The path of the file open under the tree. */
  active: string;
  onOpen: (path: string) => void;
  reveal?: Reveal;
};

/**
 * The repository, the pane's main thing: a filter in the pane's toolbar row and the tree under it.
 * Folders fold with a chevron; a file is a button that opens it under the tree and takes the
 * selected fill, the neutral one the sidebar's current row has. What the session changed carries
 * git's letter at the end of its row, green for a new file and blue for a changed one, and every
 * folder above it a dot, so a change shows however much of the tree is folded. Typing narrows the
 * tree to the files whose path matches, with their folders open.
 */
export function FilesTree({ files, active, onOpen, reveal }: FilesTreeProps) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [folded, setFolded] = useState(FOLDED_ON_LOAD);

  const needle = query.trim().toLowerCase();
  const shown = files.filter((file) => file.path.toLowerCase().includes(needle));
  // A filter opens every folder it found something in.
  const isOpen = (path: string) => needle !== '' || !folded.includes(path);
  const toggle = (path: string) =>
    setFolded(folded.includes(path) ? folded.filter((p) => p !== path) : [...folded, path]);

  // The file open on load is in view however short the pane is; one opened later was clicked
  // in the tree, so it is in view already.
  const [openOnLoad] = useState(active);
  useEffect(() => {
    document.getElementById(`${id}-${openOnLoad}`)?.scrollIntoView?.({ block: 'nearest' });
  }, [id, openOnLoad]);

  // A folder picked in the open file's path: the filter goes, the folders above it open and its
  // row takes the focus, which also brings it into view.
  useEffect(() => {
    if (!reveal) return;
    setQuery('');
    setFolded((paths) => paths.filter((path) => !`${reveal.path}/`.startsWith(`${path}/`)));
    const frame = requestAnimationFrame(() =>
      document.getElementById(`${id}-${reveal.path}`)?.focus(),
    );
    return () => cancelAnimationFrame(frame);
  }, [reveal, id]);

  const fileRow = (file: RepoFile) => {
    const name = file.path.slice(file.path.lastIndexOf('/') + 1);
    const Icon = iconOf(name);
    const mark = file.change && LETTER[file.change];
    return (
      <li key={file.path}>
        <button
          type="button"
          id={`${id}-${file.path}`}
          aria-current={file.path === active ? 'true' : undefined}
          onClick={() => onOpen(file.path)}
          className={cn(
            ROW,
            'text-ws-static-strong aria-[current=true]:bg-ws-dynamic-tertiary-alpha-strong-default',
          )}
        >
          {/* No chevron on a file: the space keeps its icon in line with a folder's. */}
          <span aria-hidden="true" className="size-ws-9 shrink-0" />
          <Icon aria-hidden="true" className={ICON} />
          <span className="ml-ws-2 min-w-0 flex-1 truncate">{name}</span>
          {mark && (
            <span className={cn(MARK, 'typography-caption-strong-md', mark.className)}>
              <span aria-hidden="true">{mark.letter}</span>
              <span className="sr-only">, {mark.label}</span>
            </span>
          )}
        </button>
      </li>
    );
  };

  /** The rows under a folder (`prefix` ends with its slash; the root's is empty). */
  const rows = (prefix: string): ReactNode[] => {
    const inside = shown.filter((file) => file.path.startsWith(prefix));
    const isFile = (file: RepoFile) => !file.path.slice(prefix.length).includes('/');
    const folders = new Set(
      inside
        .filter((file) => !isFile(file))
        .map((file) => file.path.slice(prefix.length).split('/')[0]),
    );
    return [
      ...[...folders].sort(byName).map((name) => folderRow(name, prefix + name)),
      ...inside
        .filter(isFile)
        .sort((a, b) => byName(a.path, b.path))
        .map(fileRow),
    ];
  };

  const folderRow = (name: string, path: string) => {
    const open = isOpen(path);
    const Chevron = open ? RiArrowDownSLine : RiArrowRightSLine;
    const Icon = open ? RiFolderOpenLine : RiFolderLine;
    const changed = files.some((file) => file.change && file.path.startsWith(`${path}/`));
    return (
      <li key={path}>
        <button
          type="button"
          id={`${id}-${path}`}
          aria-expanded={open}
          onClick={() => toggle(path)}
          className={cn(ROW, 'text-ws-static-base')}
        >
          <Chevron aria-hidden="true" className={ICON} />
          <Icon aria-hidden="true" className={ICON} />
          <span className="ml-ws-2 min-w-0 flex-1 truncate">{name}</span>
          {changed && (
            <span className={MARK}>
              <span className="bg-ws-semantic-inverse-info size-ws-4 rounded-ws-control-full" />
              <span className="sr-only">, has changes</span>
            </span>
          )}
        </button>
        {open && <ul className={NESTED}>{rows(`${path}/`)}</ul>}
      </li>
    );
  };

  return (
    // ponytail: every row is a tab stop; arrow keys over one stop (a `tree` role) once the tree
    // is a library component.
    <nav
      aria-label={`Files in ${REPOSITORY}`}
      className="border-ws-static-base flex max-h-[50%] shrink-0 flex-col border-b"
    >
      <div className="h-ws-16 px-ws-7 border-ws-static-subtle flex shrink-0 items-center border-b">
        <TextInput
          size="sm"
          className="w-full"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        >
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input type="search" placeholder="Filter files" aria-label="Filter files" />
          <TextInput.Suffix inner>
            <TextInput.ClearButton aria-label="Clear filter" />
          </TextInput.Suffix>
        </TextInput>
      </div>

      <div className="px-ws-7 py-ws-5 min-h-0 flex-1 overflow-y-auto">
        {shown.length > 0 ? (
          <ul>{rows('')}</ul>
        ) : (
          <p role="status" className="typography-body-sm text-ws-static-subtle px-ws-5 py-ws-4">
            No files match “{query.trim()}”
          </p>
        )}
      </div>
    </nav>
  );
}
