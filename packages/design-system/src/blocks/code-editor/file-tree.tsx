// TODO(custom): the step's files as a small tree (folders, files, the open one selected, unsaved marked); Wideset has no tree view.
import { RiFileCodeLine, RiFileTextLine, RiFolderOpenLine } from '@remixicon/react';
import { cn } from '@wideset/react';
import { type ReactNode, useId } from 'react';

import { fileById, type FileId, type ScriptFile } from './data';

const ROW =
  'gap-ws-5 px-ws-5 py-ws-4 rounded-ws-control-lg typography-label-sm flex w-full items-center';

type FileTreeProps = {
  /** The file in the editor. */
  active: FileId;
  /** Files whose text differs from the saved version. */
  unsaved: FileId[];
  onOpen: (id: FileId) => void;
};

/**
 * The step's files beside the editor: its folder and the files in it, `lib/` one level in.
 * Folders only group, so they are plain text; a file is a button that opens it in the editor.
 * The open file takes the selected treatment (the brand tint, as in the course outline); a file
 * with unsaved changes carries a dot, as its tab does.
 */
export function FileTree({ active, unsaved, onOpen }: FileTreeProps) {
  const titleId = useId();

  const fileRow = (file: ScriptFile) => {
    const Icon = file.language === 'js' ? RiFileCodeLine : RiFileTextLine;
    const changed = unsaved.includes(file.id);
    return (
      <li key={file.id}>
        <button
          type="button"
          aria-current={file.id === active ? 'true' : undefined}
          onClick={() => onOpen(file.id)}
          className={cn(
            ROW,
            'text-ws-static-strong hover:bg-ws-dynamic-tertiary-alpha-strong-default aria-[current=true]:bg-ws-dynamic-primary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default text-left',
          )}
        >
          <Icon aria-hidden="true" className="size-ws-9 text-ws-static-subtle shrink-0" />
          <span className="min-w-0 flex-1 truncate">{file.name}</span>
          {changed && (
            <span className="bg-ws-static-inverse-background size-ws-4 rounded-ws-control-full shrink-0">
              <span className="sr-only">Unsaved changes</span>
            </span>
          )}
        </button>
      </li>
    );
  };

  const folder = (name: string, children: ReactNode) => (
    <li key={name}>
      <div className={cn(ROW, 'text-ws-static-base')}>
        <RiFolderOpenLine aria-hidden="true" className="size-ws-9 text-ws-static-subtle shrink-0" />
        <span className="truncate">{name}</span>
      </div>
      <ul className="pl-ws-9">{children}</ul>
    </li>
  );

  return (
    <nav aria-labelledby={titleId} className="gap-ws-5 flex flex-col">
      <h2 id={titleId} className="typography-caption-strong-md text-ws-static-subtle px-ws-5">
        Files
      </h2>
      <ul>
        {folder('lead-scoring', [
          fileRow(fileById('score-lead')),
          folder('lib', fileRow(fileById('helpers'))),
          fileRow(fileById('readme')),
        ])}
      </ul>
    </nav>
  );
}
