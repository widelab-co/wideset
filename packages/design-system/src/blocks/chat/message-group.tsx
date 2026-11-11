// TODO(custom): chat messages from one person (avatar, name, time, then each message with its quote, file and reactions); Wideset has no message or comment component.
import { RiThumbUpFill, RiThumbUpLine } from '@remixicon/react';
import { Avatar, IconButton } from '@wideset/react';

import type { Message, ReactionKind } from './data';
import { formatDateTime, formatTime } from './format';
import { MessageQuote } from './message-quote';
import { Reactions } from './reactions';
import { SharedFile } from './shared-file';

type MessageGroupProps = {
  /** Consecutive messages from one person, oldest first. */
  messages: Message[];
  onReact: (messageId: string, kind: ReactionKind) => void;
};

/**
 * What one person wrote in a row: the avatar, the name and the time once, then the messages
 * under them. Everyone's messages are rows on the page, the signed-in user's too: in a work tool
 * the name and the avatar tell them apart, not a coloured bubble. Each message can be liked from
 * a quiet button that shows on hover and on focus.
 */
export function MessageGroup({ messages, onReact }: MessageGroupProps) {
  const [{ author, at }] = messages;
  return (
    <div className="gap-ws-7 flex">
      <Avatar initials={author.initials} color={author.color} aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="gap-ws-5 flex items-baseline">
          <span className="typography-label-strong-sm text-ws-static-strong">{author.name}</span>
          <time
            dateTime={at}
            title={formatDateTime(at)}
            className="typography-caption-md text-ws-static-subtle tabular-nums"
          >
            {formatTime(at)}
          </time>
        </p>
        <div className="gap-ws-3 flex flex-col">
          {messages.map((message) => {
            const liked = message.reactions?.some(({ kind, mine }) => kind === 'like' && mine);
            return (
              // As wide as what it holds, plus room on the right for the like button beside it.
              <div
                key={message.id}
                className="group pr-ws-15 relative flex w-fit max-w-full flex-col"
              >
                {message.quote && <MessageQuote quote={message.quote} />}
                <p className="typography-body-md text-ws-static-base max-w-[44rem] whitespace-pre-line">
                  {message.text}
                </p>
                {message.file && <SharedFile file={message.file} />}
                {message.reactions && message.reactions.length > 0 && (
                  <Reactions
                    reactions={message.reactions}
                    onToggle={(kind) => onReact(message.id, kind)}
                  />
                )}
                <IconButton
                  icon={liked ? RiThumbUpFill : RiThumbUpLine}
                  variant="secondary"
                  preset="ghost"
                  size="xs"
                  aria-label="Like"
                  aria-pressed={Boolean(liked)}
                  onClick={() => onReact(message.id, 'like')}
                  className="right-ws-0 -top-ws-2 absolute opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
