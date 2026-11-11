// TODO(custom): e-mail message that folds to one line (sender, first line, time); Accordion draws a titled section with a chevron, not a message.
import { Avatar } from '@wideset/react';
import { useId } from 'react';

import { Attachment } from './attachment';
import type { Message as MessageData } from './data';
import { formatDateTime, formatMessageTime } from './format';

type MessageProps = {
  message: MessageData;
  /** Who it was written to, by name. */
  to: string;
  open: boolean;
  onToggle: () => void;
};

/**
 * One message of the conversation. Folded, it is a single line: who wrote and how it starts.
 * Open, the sender's name leads with their address beside it, and the text and any files hang
 * under it, so the avatars form one column down the thread.
 * Its head is the one target that folds and unfolds it.
 */
export function Message({ message, to, open, onToggle }: MessageProps) {
  const bodyId = useId();
  const { from, at, body, attachments } = message;
  return (
    <article className="py-ws-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? bodyId : undefined}
        onClick={onToggle}
        className="gap-ws-7 px-ws-5 py-ws-5 -mx-ws-5 rounded-ws-control-lg hover:bg-ws-static-alpha-subtle focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-[calc(100%+1rem)] items-center text-left focus-visible:-outline-offset-2"
      >
        <Avatar initials={from.initials} color={from.color} aria-hidden />
        {open ? (
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="gap-ws-3 flex min-w-0 items-baseline">
              <span className="typography-label-strong-sm text-ws-static-strong shrink-0">
                {from.name}
              </span>
              <span className="typography-caption-md text-ws-static-subtle truncate">
                {from.email}
              </span>
            </span>
            <span className="typography-caption-md text-ws-static-subtle truncate">to {to}</span>
          </span>
        ) : (
          <span className="gap-ws-5 flex min-w-0 flex-1 items-baseline">
            <span className="typography-label-strong-sm text-ws-static-strong shrink-0">
              {from.name}
            </span>
            <span className="typography-body-md text-ws-static-subtle truncate">{body[0]}</span>
          </span>
        )}
        <time
          dateTime={at}
          title={formatDateTime(at)}
          className="typography-caption-md text-ws-static-subtle shrink-0 tabular-nums"
        >
          {formatMessageTime(at)}
        </time>
      </button>
      {open && (
        <div
          id={bodyId}
          className="gap-ws-7 pt-ws-3 pb-ws-7 pl-ws-17 typography-body-md text-ws-static-base flex max-w-[44rem] flex-col"
        >
          {body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          {attachments && (
            <ul aria-label="Attachments" className="gap-ws-5 pt-ws-3 flex flex-wrap">
              {attachments.map((file) => (
                <li key={file.name}>
                  <Attachment file={file} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}
