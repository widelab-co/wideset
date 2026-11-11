import { useId } from 'react';

import { ConversationRow } from './conversation-row';
import type { Conversation } from './data';

const GROUPS = [
  { kind: 'channel', label: 'Channels' },
  { kind: 'direct', label: 'Direct messages' },
] as const;

type ConversationListProps = {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/** A titled group of conversations, labelled the way the sidebar labels a group of pages. */
function Group({
  label,
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps & { label: string }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="gap-ws-2 flex flex-col">
      <h2 id={id} className="px-ws-5 py-ws-3 typography-caption-strong-md text-ws-static-subtle">
        {label}
      </h2>
      <ul className="flex flex-col">
        {conversations.map((conversation) => (
          <li key={conversation.id}>
            <ConversationRow
              conversation={conversation}
              selected={conversation.id === selectedId}
              onSelect={() => onSelect(conversation.id)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The narrow column of conversations: channels, then direct messages with each person's
 * presence. It keeps its width and scrolls on its own beside the open conversation.
 */
export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  return (
    <nav
      aria-label="Conversations"
      className="border-ws-static-subtle gap-ws-9 px-ws-5 py-ws-7 flex w-[15rem] shrink-0 flex-col overflow-y-auto border-r"
    >
      {GROUPS.map(({ kind, label }) => (
        <Group
          key={kind}
          label={label}
          conversations={conversations.filter((conversation) => conversation.kind === kind)}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </nav>
  );
}
