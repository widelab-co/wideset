import { cn, Divider } from '@wideset/react';
import { useEffect, useRef } from 'react';

import { COLUMN } from './column';
import type { Message, ReactionKind } from './data';
import { dayOf, formatDay } from './format';
import { MessageGroup } from './message-group';

type Item =
  | { type: 'day'; key: string; at: string }
  | { type: 'new'; key: string }
  | { type: 'group'; key: string; messages: Message[] };

/**
 * The thread as it is drawn: a line for each new day, a line where the unread messages start,
 * and between the lines the messages, grouped while the same person keeps writing.
 */
function toItems(messages: Message[], newFrom?: string) {
  const items: Item[] = [];
  messages.forEach((message, index) => {
    const previous = messages[index - 1];
    const newDay = !previous || dayOf(previous.at) !== dayOf(message.at);
    const firstNew = message.id === newFrom;
    if (newDay) items.push({ type: 'day', key: dayOf(message.at), at: message.at });
    if (firstNew) items.push({ type: 'new', key: 'new' });
    const last = items[items.length - 1];
    if (last.type === 'group' && previous.author === message.author) last.messages.push(message);
    else items.push({ type: 'group', key: message.id, messages: [message] });
  });
  return items;
}

type ThreadProps = {
  messages: Message[];
  /** The first message that arrived since the last visit. */
  newFrom?: string;
  onReact: (messageId: string, kind: ReactionKind) => void;
};

/**
 * The messages of the open conversation, oldest first, resting on the composer: a short thread
 * leaves the space above it. It scrolls on its own and follows the newest message, on opening
 * and after sending.
 */
export function Thread({ messages, newFrom, onReact }: ThreadProps) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages.length]);

  return (
    <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
      <ol
        aria-label="Messages"
        className={cn(COLUMN, 'gap-ws-9 py-ws-9 flex min-h-full flex-col justify-end')}
      >
        {toItems(messages, newFrom).map((item) => (
          <li key={item.key}>
            {item.type === 'day' && (
              <Divider weight="thin" emphasis="subtle" text={formatDay(item.at)} />
            )}
            {item.type === 'new' && <Divider weight="thin" text="New messages" textAlign="left" />}
            {item.type === 'group' && <MessageGroup messages={item.messages} onReact={onReact} />}
          </li>
        ))}
      </ol>
    </div>
  );
}
