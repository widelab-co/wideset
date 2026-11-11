import { RiChatCheckLine, RiChatNewLine } from '@remixicon/react';
import { Breadcrumbs, IconButton, Tooltip } from '@wideset/react';

import { FilesCode } from './files-code';
import { FilesCopyPath } from './files-copy-path';
import { type Change, type RepoFile, splitPath } from './files-data';

/** What the session did to the file, for those who cannot see the gutter. */
function summaryOf(file: RepoFile) {
  const count = (change: Change) => file.lines.filter((line) => line.change === change).length;
  if (file.change === 'added') return `New file, ${file.lines.length} lines added`;
  if (file.change === 'modified')
    return `${count('added')} lines added, ${count('modified')} changed`;
  return 'Not changed in this session';
}

type FilesOpenFileProps = {
  file: RepoFile;
  /** Whether the file is attached to the session's next message. */
  inConversation: boolean;
  onConversationChange: (inConversation: boolean) => void;
  /** A folder of the path was picked: the tree shows it. */
  onReveal: (folder: string) => void;
};

/**
 * The file open under the tree: a row with its path as breadcrumbs (a folder picked there is
 * shown in the tree) and, at the end, the two things done with a file here, then its text. Both
 * actions are quiet icon buttons with a tooltip, since the row must hold the whole path in a pane
 * 28rem wide; if a path still runs out of room it is its start that is cut, never the file's
 * name. Adding the file to the conversation is a state, so its button shows it and takes the
 * file out again.
 */
export function FilesOpenFile({
  file,
  inConversation,
  onConversationChange,
  onReveal,
}: FilesOpenFileProps) {
  const { folders, name } = splitPath(file.path);
  const conversationLabel = inConversation
    ? 'Remove from the conversation'
    : 'Add to the conversation';

  return (
    <section aria-label={name} className="flex min-h-0 flex-1 flex-col">
      <div className="h-ws-16 gap-ws-5 pl-ws-7 pr-ws-9 border-ws-static-subtle flex shrink-0 items-center border-b">
        <div className="flex min-w-0 flex-1">
          {/* Only as wide as the path; when the row is narrower, the path's end stays in view. */}
          <div className="flex max-w-full justify-end overflow-hidden">
            <Breadcrumbs separator="slash" aria-label="Path" className="shrink-0">
              {folders.map((folder, index) => (
                <Breadcrumbs.Item
                  key={folder}
                  onClick={() => onReveal(folders.slice(0, index + 1).join('/'))}
                >
                  {folder}
                </Breadcrumbs.Item>
              ))}
              <Breadcrumbs.Item>{name}</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>
        <p className="sr-only">{summaryOf(file)}</p>
        <div className="gap-ws-2 flex shrink-0 items-center">
          <FilesCopyPath key={file.path} path={file.path} />
          <Tooltip size="sm">
            <Tooltip.Trigger asChild>
              <IconButton
                icon={inConversation ? RiChatCheckLine : RiChatNewLine}
                variant="secondary"
                preset="ghost"
                size="xs"
                aria-label={conversationLabel}
                onClick={() => onConversationChange(!inConversation)}
              />
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom">
              <Tooltip.Label>{conversationLabel}</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip>
          <span role="status" className="sr-only">
            {inConversation ? `${name} is in the conversation` : ''}
          </span>
        </div>
      </div>
      <FilesCode key={file.path} file={file} />
    </section>
  );
}
