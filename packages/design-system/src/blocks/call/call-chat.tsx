// TODO(custom): messages written during a call (avatar, name, time, text); Wideset has no message component.
import { RiSendPlaneLine } from '@remixicon/react';
import { TextInput } from '@wideset/react';
import { type FormEvent, useEffect, useRef, useState } from 'react';

import type { ChatMessage, Participant } from './data';
import { formatTime } from './format';
import { PersonAvatar } from './person-avatar';

type CallChatProps = {
  messages: ChatMessage[];
  people: Participant[];
  onSend: (text: string) => void;
};

/**
 * The call's chat, which everyone on the call reads: the messages as rows, oldest first, resting
 * on the field at the foot of the panel. It follows the newest message. Enter sends; nothing is
 * sent while the field is empty.
 */
export function CallChat({ messages, people, onSend }: CallChatProps) {
  const [draft, setDraft] = useState('');
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages.length]);

  const send = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft('');
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
        <ol
          aria-label="Messages"
          className="gap-ws-9 px-ws-9 py-ws-9 flex min-h-full flex-col justify-end"
        >
          {messages.map((message) => {
            const author = people.find((person) => person.id === message.authorId)!;
            return (
              <li key={message.id} className="gap-ws-5 flex">
                <PersonAvatar
                  size="sm"
                  name={author.name}
                  initials={author.initials}
                  color={author.color}
                  aria-hidden
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="gap-ws-5 flex items-baseline">
                    <span className="typography-label-strong-sm text-ws-static-strong truncate">
                      {author.name}
                    </span>
                    <time
                      dateTime={message.at}
                      className="typography-caption-md text-ws-static-subtle shrink-0 tabular-nums"
                    >
                      {formatTime(message.at)}
                    </time>
                  </p>
                  <p className="typography-body-md text-ws-static-base">{message.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <form onSubmit={send} className="px-ws-9 pb-ws-9 shrink-0">
        <TextInput size="sm" value={draft} onChange={(event) => setDraft(event.target.value)}>
          <TextInput.Input placeholder="Message everyone" aria-label="Message everyone" />
          <TextInput.Suffix inner>
            <TextInput.IconButton
              type="submit"
              icon={RiSendPlaneLine}
              aria-label="Send message"
              disabled={!draft.trim()}
            />
          </TextInput.Suffix>
        </TextInput>
      </form>
    </div>
  );
}
