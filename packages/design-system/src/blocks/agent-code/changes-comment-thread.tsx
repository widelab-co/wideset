// TODO(custom): a review thread on a line of a diff (the comment, its replies, what to do with it); Wideset has no Comment component.
import { RiCheckLine } from '@remixicon/react';
import { Avatar, Button, cn } from '@wideset/react';
import { useEffect, useRef, useState } from 'react';

import { CommentComposer } from './changes-comment-composer';
import type { Thread } from './changes-data';
import { formatWhen } from './changes-format';

type CommentThreadProps = {
  thread: Thread;
  onReply: (text: string) => void;
  onResolve: (resolved: boolean) => void;
  /** Puts the comment in the session's composer, for Tandem to fix what it asks. */
  onSend: () => void;
};

/**
 * A review thread under the line it is about, in a box drawn rather than filled, so it reads as
 * apart from the tinted lines around it: who wrote, how long ago, the text, then the replies.
 * Three ways on: Reply (the composer opens in place of the actions), Resolve (the thread folds to
 * one quiet line that can be reopened) and Ask Tandem to fix, which puts the comment in the
 * session's composer and then says so instead of offering it twice. The agent's action is the bordered one;
 * none is filled.
 */
export function CommentThread({ thread, onReply, onResolve, onSend }: CommentThreadProps) {
  const [replying, setReplying] = useState(false);
  const root = useRef<HTMLElement>(null);
  const [first] = thread.comments;

  // An action that takes away the control in use (the composer closing, Resolve, Reopen, the
  // hand-over) leaves the focus in the thread, on its first action, not at the top of the page.
  const state = `${replying} ${thread.resolved} ${thread.sent}`;
  const lastState = useRef(state);
  useEffect(() => {
    if (lastState.current !== state && !replying) root.current?.querySelector('button')?.focus();
    lastState.current = state;
  }, [state, replying]);

  return (
    <article
      ref={root}
      aria-label={`Comment by ${first.author.name}`}
      className={cn(
        'border-ws-static-base rounded-ws-container-sm bg-ws-static-foreground p-ws-7 flex border',
        thread.resolved ? 'gap-ws-5 items-center' : 'gap-ws-7 flex-col',
      )}
    >
      {thread.resolved ? (
        <>
          <RiCheckLine
            aria-hidden="true"
            className="size-ws-9 text-ws-semantic-positive shrink-0"
          />
          <p className="typography-label-sm text-ws-static-subtle min-w-0 flex-1 truncate">
            <span className="text-ws-static-base">Resolved</span> · {first.author.name}:{' '}
            {first.text}
          </p>
          <Button variant="secondary" preset="ghost" size="xs" onClick={() => onResolve(false)}>
            Reopen
          </Button>
        </>
      ) : (
        <>
          <ol className="gap-ws-7 flex flex-col">
            {thread.comments.map((comment) => (
              <li key={comment.id} className="gap-ws-5 flex">
                <Avatar
                  size="xs"
                  initials={comment.author.initials}
                  color={comment.author.color}
                  aria-hidden
                />
                <div className="gap-ws-2 flex min-w-0 flex-1 flex-col">
                  <p className="typography-label-sm gap-x-ws-5 flex flex-wrap items-baseline">
                    <span className="typography-label-strong-sm text-ws-static-strong">
                      {comment.author.name}
                    </span>
                    <time dateTime={comment.postedAt} className="text-ws-static-subtle">
                      {formatWhen(comment.postedAt)}
                    </time>
                  </p>
                  <p className="typography-body-md text-ws-static-base text-pretty">
                    {comment.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {replying ? (
            <CommentComposer
              label={`Reply to ${first.author.name}`}
              action="Reply"
              onSubmit={(text) => {
                onReply(text);
                setReplying(false);
              }}
              onCancel={() => setReplying(false)}
            />
          ) : (
            <div className="gap-ws-3 flex flex-wrap items-center justify-end">
              <Button
                variant="secondary"
                preset="ghost"
                size="xs"
                onClick={() => setReplying(true)}
              >
                Reply
              </Button>
              <Button variant="secondary" preset="ghost" size="xs" onClick={() => onResolve(true)}>
                Resolve
              </Button>
              {thread.sent ? (
                <p
                  role="status"
                  className="typography-caption-strong-md text-ws-static-subtle gap-ws-2 h-ws-forms-xs px-ws-4 flex items-center"
                >
                  <RiCheckLine aria-hidden="true" className="size-ws-8" />
                  Added to your message
                </p>
              ) : (
                <Button variant="secondary" preset="border" size="xs" onClick={onSend}>
                  Ask Tandem to fix
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </article>
  );
}
