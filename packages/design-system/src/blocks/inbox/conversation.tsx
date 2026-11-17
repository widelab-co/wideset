import { RiContactsBook3Line, RiHandCoinLine } from '@remixicon/react';
import { LinkButton } from '@wideset/react';
import { useId, useState } from 'react';

import { ConversationToolbar } from './conversation-toolbar';
import { account, type Conversation as ConversationData } from './data';
import { Message } from './message';
import { ReplyComposer } from './reply-composer';

type ConversationProps = {
  conversation: ConversationData;
  onArchive: () => void;
  onToggleStar: () => void;
  onToggleRead: () => void;
  onReply: (text: string) => void;
};

/**
 * The open conversation: its subject, the customer and the deal it is filed under, and what to do
 * with it; the messages in order, the earlier ones folded to a line and the last one open; the
 * reply under them. Only the messages scroll: the subject and the reply stay where they are.
 */
export function Conversation({
  conversation,
  onArchive,
  onToggleStar,
  onToggleRead,
  onReply,
}: ConversationProps) {
  const titleId = useId();
  const { subject, customer, deal, contact, messages, starred, unread } = conversation;
  const lastId = messages[messages.length - 1].id;
  // The last message starts open and the earlier ones folded; a click on a head overrides that.
  const [choices, setChoices] = useState<Record<string, boolean>>({});
  const isOpen = (id: string) => choices[id] ?? id === lastId;

  return (
    <section aria-labelledby={titleId} className="flex min-w-0 flex-1 flex-col">
      {/* 96px, as the search and the filter beside it: the line meets the top of the list. */}
      <header className="h-ws-24 border-ws-static-subtle shrink-0 border-b">
        <div className="gap-ws-2 px-ws-12 pt-ws-9 mx-auto flex w-full max-w-[48rem] flex-col">
          <div className="gap-ws-9 flex items-center justify-between">
            <h1 id={titleId} className="typography-subtitle-xs text-ws-static-strong truncate">
              {subject}
            </h1>
            <ConversationToolbar
              starred={starred}
              unread={unread}
              onArchive={onArchive}
              onToggleStar={onToggleStar}
              onToggleRead={onToggleRead}
            />
          </div>
          {/* Pulled left by the links' own padding, so their text starts under the subject. */}
          <div className="-ml-ws-6 flex min-w-0 items-center">
            <LinkButton variant="secondary" href="#customers" className="gap-ws-3">
              <RiContactsBook3Line aria-hidden className="size-ws-9" />
              {customer}
            </LinkButton>
            <LinkButton variant="secondary" href="#deals" className="gap-ws-3">
              <RiHandCoinLine aria-hidden className="size-ws-9" />
              {deal}
            </LinkButton>
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <ol
          aria-label="Messages"
          className="px-ws-12 pb-ws-9 mx-auto flex w-full max-w-[48rem] flex-col"
        >
          {messages.map((message) => (
            <li key={message.id} className="border-ws-static-subtle border-b last:border-b-0">
              <Message
                message={message}
                to={message.from === account ? contact.name : account.name}
                open={isOpen(message.id)}
                onToggle={() => setChoices({ ...choices, [message.id]: !isOpen(message.id) })}
              />
            </li>
          ))}
        </ol>
      </div>

      <div className="px-ws-12 pb-ws-11 mx-auto w-full max-w-[48rem] shrink-0">
        <ReplyComposer to={contact} onSend={onReply} />
      </div>
    </section>
  );
}
