// TODO(custom): one file's unified diff (hunk headers, old and new line numbers, added and removed lines, comments on lines); Wideset has no diff or code component.
import { RiAddLine } from '@remixicon/react';
import { cn } from '@wideset/react';
import { Fragment, type KeyboardEvent, useRef, useState } from 'react';

import { CommentComposer } from './changes-comment-composer';
import { CommentThread } from './changes-comment-thread';
import { type ChangedFile, splitPath, type Thread } from './changes-data';
import { type Anchor, anchorOf, type DiffLine, type LineKind, sameAnchor } from './changes-diff';
import { TOKEN_COLOUR, tokenize } from './highlight';

/**
 * The whole line is tinted, edge to edge, and its sign says the same for anyone who cannot tell
 * the tints apart.
 */
const LINE: Record<LineKind, { row: string; sign: string; signColour: string; spoken: string }> = {
  added: {
    row: 'bg-ws-semantic-positive',
    sign: '+',
    signColour: 'text-ws-semantic-positive',
    spoken: 'Added',
  },
  removed: {
    row: 'bg-ws-semantic-negative',
    sign: '−',
    signColour: 'text-ws-semantic-negative',
    spoken: 'Removed',
  },
  context: { row: '', sign: '', signColour: '', spoken: 'Unchanged' },
};

const NUMBER = 'w-ws-13 text-ws-static-subtle shrink-0 text-right tabular-nums select-none';

type DiffRowProps = {
  line: DiffLine;
  /** The one line button the Tab key stops on; the arrows reach the rest. */
  tabStop: boolean;
  onFocus: () => void;
  /** Up and Down move to the next line's button. */
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onComment: (opener: HTMLElement) => void;
};

/**
 * A line of the diff: its number in the old file and in the new one, its sign, the code in the
 * tokenizer's colours. A long line wraps instead of scrolling sideways, so the pane holds at any
 * width. The "+" in the left margin opens a comment on the line: it shows when the line is
 * hovered or the button has the focus, and never takes room from the code.
 */
function DiffRow({ line, tabStop, onFocus, onKeyDown, onComment }: DiffRowProps) {
  const { row, sign, signColour, spoken } = LINE[line.kind];
  const { line: number } = anchorOf(line);
  const where = line.kind === 'removed' ? `removed line ${number}` : `line ${number}`;

  return (
    <div data-new-line={line.new} className={cn('group/line px-ws-11 py-ws-2 relative flex', row)}>
      <button
        type="button"
        data-line=""
        tabIndex={tabStop ? 0 : -1}
        aria-label={`Comment on ${where}`}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onClick={(event) => onComment(event.currentTarget)}
        className="left-ws-2 top-ws-2 size-ws-9 rounded-ws-control-sm border-ws-dynamic-secondary-default bg-ws-static-foreground text-ws-dynamic-secondary-default hover:border-ws-dynamic-secondary-hover hover:text-ws-dynamic-secondary-hover focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default absolute grid cursor-pointer place-items-center border opacity-0 transition-opacity duration-(--ws-motion-duration-micro) ease-(--ws-motion-ease-out) group-hover/line:opacity-100 focus-visible:opacity-100"
      >
        <RiAddLine aria-hidden="true" className="size-ws-7" />
      </button>
      <span aria-hidden="true" className={NUMBER}>
        {line.old}
      </span>
      <span aria-hidden="true" className={NUMBER}>
        {line.new}
      </span>
      <span
        aria-hidden="true"
        className={cn('w-ws-11 shrink-0 text-center select-none', signColour)}
      >
        {sign}
      </span>
      <span className="sr-only">
        {spoken}, {where}:
      </span>
      <code className="font-ws-mono min-h-[1lh] min-w-0 flex-1 wrap-anywhere whitespace-pre-wrap">
        {tokenize(line.text).map((token) => (
          <span key={token.start} className={TOKEN_COLOUR[token.kind]}>
            {token.text}
          </span>
        ))}
      </code>
    </div>
  );
}

type FileDiffProps = {
  file: ChangedFile;
  /** The threads on this file's lines. */
  threads: Thread[];
  onComment: (anchor: Anchor, text: string) => void;
  onReply: (threadId: string, text: string) => void;
  onResolve: (threadId: string, resolved: boolean) => void;
  onSend: (threadId: string) => void;
};

/**
 * A file's changes as a unified diff, in monospace on the pane's own surface so it follows the
 * theme: each hunk under its `@@` header, removed lines tinted negative and added ones positive.
 * Review threads sit under the lines they are about, and a new comment is written in the same
 * place. One line button is a tab stop; Up and Down move between the lines, so a long diff is
 * not a hundred stops.
 */
export function FileDiff({ file, threads, onComment, onReply, onResolve, onSend }: FileDiffProps) {
  const [draft, setDraft] = useState<Anchor | null>(null);
  const [tabStop, setTabStop] = useState(0);
  const opener = useRef<HTMLElement | null>(null);

  const close = () => {
    setDraft(null);
    opener.current?.focus();
  };

  const move = (event: KeyboardEvent<HTMLButtonElement>) => {
    const { key, currentTarget } = event;
    if (key !== 'ArrowDown' && key !== 'ArrowUp') return;
    const buttons = [
      ...(currentTarget.closest('[data-diff]')?.querySelectorAll<HTMLElement>('[data-line]') ?? []),
    ];
    const next = buttons[buttons.indexOf(currentTarget) + (key === 'ArrowDown' ? 1 : -1)];
    if (!next) return;
    event.preventDefault();
    next.focus();
  };

  // Where each hunk's lines start in the file's run of lines, for the roving tab stop.
  const starts = file.hunks.map((_, at) =>
    file.hunks.slice(0, at).reduce((sum, hunk) => sum + hunk.lines.length, 0),
  );

  return (
    <div
      role="group"
      aria-label={`Changes in ${splitPath(file.path).name}`}
      data-diff=""
      className="font-ws-mono typography-body-sm tracking-ws-normal"
    >
      {file.hunks.map((hunk, at) => (
        <Fragment key={hunk.header}>
          <p className="bg-ws-static-alpha-subtle text-ws-static-subtle px-ws-11 py-ws-3 truncate">
            {hunk.header}
          </p>
          {hunk.lines.map((line, index) => {
            const anchor = anchorOf(line);
            return (
              <Fragment key={`${anchor.side}${anchor.line}`}>
                <DiffRow
                  line={line}
                  tabStop={tabStop === starts[at] + index}
                  onFocus={() => setTabStop(starts[at] + index)}
                  onKeyDown={move}
                  onComment={(button) => {
                    opener.current = button;
                    setDraft(anchor);
                  }}
                />
                {threads
                  .filter((thread) => sameAnchor(thread.anchor, anchor))
                  .map((thread) => (
                    <div key={thread.id} className="font-ws-body px-ws-11 py-ws-5">
                      <CommentThread
                        thread={thread}
                        onReply={(text) => onReply(thread.id, text)}
                        onResolve={(resolved) => onResolve(thread.id, resolved)}
                        onSend={() => onSend(thread.id)}
                      />
                    </div>
                  ))}
                {draft && sameAnchor(draft, anchor) && (
                  <div className="font-ws-body px-ws-11 py-ws-5">
                    <CommentComposer
                      label={`Comment on line ${anchor.line}`}
                      action="Comment"
                      onSubmit={(text) => {
                        onComment(anchor, text);
                        close();
                      }}
                      onCancel={close}
                    />
                  </div>
                )}
              </Fragment>
            );
          })}
        </Fragment>
      ))}
    </div>
  );
}
