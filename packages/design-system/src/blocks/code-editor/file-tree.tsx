// TODO(custom): the step's files as a tree with a search over it (folders that fold, the open file selected, unsaved marked); Wideset has no tree view.
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiFolderLine,
  RiFolderOpenLine,
  RiJavascriptLine,
  RiMarkdownLine,
  RiSearchLine,
} from '@remixicon/react';
import { cn, TextInput } from '@wideset/react';
import { type ReactNode, useState } from 'react';

import { type FileId, FILES, type ScriptFile } from './data';

const ROOT = 'lead-scoring';
const ROW =
  'gap-ws-3 px-ws-5 h-ws-14 rounded-ws-control-lg typography-label-sm flex w-full items-center text-left focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default';
/** A level in: the guide line sits under the chevron above, the rows start under its icon. */
const NESTED = 'ml-ws-9 pl-ws-3 border-ws-static-subtle border-l';
const ICON = 'size-ws-9 text-ws-static-subtle shrink-0';

/** Folders first, then files, each by name, as an editor's explorer lists them. */
const byName = (a: string, b: string) => a.localeCompare(b, 'en-US', { sensitivity: 'base' });

type FileTreeProps = {
  /** The file in the editor. */
  active: FileId;
  /** Files whose text differs from the saved version. */
  unsaved: FileId[];
  onOpen: (id: FileId) => void;
};

/**
 * The step's files, in their own pane of the editor box: a search on top, on the line of the
 * editor's tabs, and the tree under it. Folders fold with a chevron; a file is a button that opens
 * it in the editor, with its kind as a quiet icon. The open file takes the selected treatment (the
 * brand tint); a file with unsaved changes carries a dot, as its tab does. Typing narrows the tree
 * to the files whose path matches, with their folders open.
 */
export function FileTree({ active, unsaved, onOpen }: FileTreeProps) {
  const [query, setQuery] = useState('');
  const [closed, setClosed] = useState<string[]>([]);

  const needle = query.trim().toLowerCase();
  const shown = FILES.filter((file) =>
    [file.folder, file.name].join('/').toLowerCase().includes(needle),
  );
  const folders = [...new Set(shown.flatMap((file) => file.folder ?? []))].sort(byName);
  const rootFiles = shown.filter((file) => !file.folder).sort((a, b) => byName(a.name, b.name));
  // A search opens every folder it found something in.
  const isOpen = (path: string) => needle !== '' || !closed.includes(path);
  const toggle = (path: string) =>
    setClosed(closed.includes(path) ? closed.filter((p) => p !== path) : [...closed, path]);

  const fileRow = (file: ScriptFile) => {
    const Icon = file.language === 'js' ? RiJavascriptLine : RiMarkdownLine;
    return (
      <li key={file.id}>
        <button
          type="button"
          aria-current={file.id === active ? 'true' : undefined}
          onClick={() => onOpen(file.id)}
          className={cn(
            ROW,
            'text-ws-static-strong hover:bg-ws-dynamic-tertiary-alpha-strong-default aria-[current=true]:bg-ws-dynamic-primary-alpha-strong-default',
          )}
        >
          {/* No chevron on a file: the space keeps its icon in line with a folder's. */}
          <span aria-hidden="true" className="size-ws-9 shrink-0" />
          <Icon aria-hidden="true" className={ICON} />
          <span className="ml-ws-2 min-w-0 flex-1 truncate">{file.name}</span>
          {unsaved.includes(file.id) && (
            <span className="bg-ws-static-inverse-background size-ws-4 rounded-ws-control-full shrink-0">
              <span className="sr-only">Unsaved changes</span>
            </span>
          )}
        </button>
      </li>
    );
  };

  const folderRow = (name: string, path: string, children: ReactNode) => {
    const open = isOpen(path);
    const Chevron = open ? RiArrowDownSLine : RiArrowRightSLine;
    const Icon = open ? RiFolderOpenLine : RiFolderLine;
    return (
      <li key={path}>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => toggle(path)}
          className={cn(
            ROW,
            'text-ws-static-base hover:bg-ws-dynamic-tertiary-alpha-strong-default',
          )}
        >
          <Chevron aria-hidden="true" className={ICON} />
          <Icon aria-hidden="true" className={ICON} />
          <span className="ml-ws-2 min-w-0 flex-1 truncate">{name}</span>
        </button>
        {open && <ul className={NESTED}>{children}</ul>}
      </li>
    );
  };

  return (
    <nav
      aria-label="Files"
      className="border-ws-static-base flex min-h-0 flex-col border-b md:border-r md:border-b-0"
    >
      {/* As tall as the tab row beside it, so the two lines under them meet. */}
      <div className="h-ws-16 px-ws-5 border-ws-static-subtle flex shrink-0 items-center border-b">
        <TextInput
          size="sm"
          className="w-full"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        >
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input type="search" placeholder="Search files" aria-label="Search files" />
          <TextInput.Suffix inner>
            <TextInput.ClearButton aria-label="Clear search" />
          </TextInput.Suffix>
        </TextInput>
      </div>

      <div className="p-ws-5 min-h-0 flex-1 overflow-y-auto">
        {shown.length > 0 ? (
          <ul>
            {folderRow(ROOT, ROOT, [
              ...folders.map((folder) =>
                folderRow(
                  folder,
                  `${ROOT}/${folder}`,
                  shown
                    .filter((file) => file.folder === folder)
                    .sort((a, b) => byName(a.name, b.name))
                    .map(fileRow),
                ),
              ),
              ...rootFiles.map(fileRow),
            ])}
          </ul>
        ) : (
          <p role="status" className="typography-body-sm text-ws-static-subtle px-ws-5 py-ws-4">
            No files match “{query.trim()}”
          </p>
        )}
      </div>
    </nav>
  );
}
