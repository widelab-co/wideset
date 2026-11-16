// TODO(custom): what a session produced as rows that open it (a changed file with its diff stat, a document); FileItem is an upload row with a thumbnail and a remove action.
import { RiFileCodeLine, RiFileTextLine } from '@remixicon/react';

import { ChangeCounts } from './change-counts';
import type { ChangedFile } from './data';

const ROW =
  'gap-ws-5 -mx-ws-3 px-ws-3 min-h-ws-13 rounded-ws-control-md hover:bg-ws-static-alpha-subtle focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex items-center focus-visible:-outline-offset-2';

type ProducedListProps = {
  files: ChangedFile[];
  documents: { id: string; title: string }[];
};

/**
 * What the session made, each row one link across its width: the files it wrote or changed, by
 * name in monospace with the lines added and removed (the folder is in the link's title), then
 * the documents it wrote, named as they are titled. A file opens in Changes, a document in its
 * own pane.
 */
export function ProducedList({ files, documents }: ProducedListProps) {
  return (
    <ul className="flex flex-col">
      {files.map(({ path, added, removed }) => (
        <li key={path}>
          <a href={`#changes/${path}`} title={path} className={ROW}>
            <RiFileCodeLine
              aria-hidden="true"
              className="size-ws-9 text-ws-static-subtle shrink-0"
            />
            <span className="font-ws-mono typography-body-sm tracking-ws-normal text-ws-static-strong min-w-0 flex-1 truncate">
              {path.split('/').at(-1)}
            </span>
            <ChangeCounts added={added} removed={removed} />
          </a>
        </li>
      ))}
      {documents.map(({ id, title }) => (
        <li key={id}>
          <a href={`#document/${id}`} className={ROW}>
            <RiFileTextLine
              aria-hidden="true"
              className="size-ws-9 text-ws-static-subtle shrink-0"
            />
            <span className="typography-label-sm text-ws-static-strong min-w-0 flex-1 truncate">
              {title}
            </span>
            <span className="typography-label-sm text-ws-static-subtle shrink-0">Document</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
