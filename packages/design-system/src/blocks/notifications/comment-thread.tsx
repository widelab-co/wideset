// TODO(custom): comment thread (author, time, text with mentions); no Comment component in Wideset.
import { Avatar } from '@wideset/react';

import { account, type Message } from './data';
import { formatDateTime, formatWhen } from './format';

const MENTION = `@${account.name}`;

/** The text, with a mention of the signed-in user carrying weight: it is why they were told. */
function Text({ text }: { text: string }) {
  return text.split(MENTION).map((part, index) => (
    <span key={index}>
      {index > 0 && <span className="text-ws-static-strong font-ws-medium">{MENTION}</span>}
      {part}
    </span>
  ));
}

/** A conversation, oldest first: who wrote, when, and what they said. */
export function CommentThread({ messages }: { messages: Message[] }) {
  return (
    <ol aria-label="Comments" className="gap-ws-11 flex flex-col">
      {messages.map((message) => (
        <li key={message.at} className="gap-ws-7 flex">
          <Avatar initials={message.author.initials} aria-hidden />
          <div className="gap-ws-2 flex min-w-0 flex-1 flex-col">
            <p className="gap-ws-5 flex items-baseline">
              <span className="typography-label-strong-sm text-ws-static-strong">
                {message.author.name}
              </span>
              <time
                dateTime={message.at}
                title={formatDateTime(message.at)}
                className="typography-label-sm text-ws-static-subtle"
              >
                {formatWhen(message.at)}
              </time>
            </p>
            <p className="typography-body-md text-ws-static-base">
              <Text text={message.text} />
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
