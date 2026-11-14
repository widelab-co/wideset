import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, cn, IconButton } from '@wideset/react';
import { useId, useState } from 'react';

import { COLUMN } from './column';
import { Composer } from './composer';
import { ConversationHeader } from './conversation-header';
import { ConversationList } from './conversation-list';
import {
  type Conversation,
  conversations as initialConversations,
  me,
  NOW,
  type Reaction,
  type ReactionKind,
} from './data';
import { ChatSidebar } from './sidebar';
import { Thread } from './thread';

/** Adds the signed-in user's reaction, or takes it back; a reaction nobody gives goes away. */
const toggleReaction = (reactions: Reaction[] = [], kind: ReactionKind) =>
  reactions.some((reaction) => reaction.kind === kind)
    ? reactions
        .map((reaction) =>
          reaction.kind === kind
            ? { kind, mine: !reaction.mine, count: reaction.count + (reaction.mine ? -1 : 1) }
            : reaction,
        )
        .filter((reaction) => reaction.count > 0)
    : [...reactions, { kind, count: 1, mine: true }];

/**
 * Chat (Inset direction): the team's conversations on the raised page beside the workspace
 * sidebar. A narrow column of channels and people, then the open conversation: its head, the
 * thread and the composer. Only the thread scrolls; the card and the window never do.
 */
export default function Chat() {
  const sidebarId = useId();
  const titleId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(initialConversations[0].id);
  const selected = items.find((item) => item.id === selectedId)!;

  const update = (id: string, change: (conversation: Conversation) => Partial<Conversation>) =>
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...change(item) } : item)),
    );

  /** Opening a conversation reads it; its "New messages" line stays until something is sent. */
  const select = (id: string) => {
    setSelectedId(id);
    update(id, () => ({ unread: false }));
  };

  const send = (text: string) =>
    update(selectedId, ({ messages }) => ({
      messages: [...messages, { id: `sent-${messages.length}`, author: me, at: NOW, text }],
      newFrom: undefined,
    }));

  const react = (messageId: string, kind: ReactionKind) =>
    update(selectedId, ({ messages }) => ({
      messages: messages.map((message) =>
        message.id === messageId
          ? { ...message, reactions: toggleReaction(message.reactions, kind) }
          : message,
      ),
    }));

  return (
    <AppShell direction="inset">
      <ChatSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <AppShell.Main>
        <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
          {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
              left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
          <div className="gap-ws-5 px-ws-11 flex w-full items-center">
            <IconButton
              icon={RiSideBarLine}
              variant="secondary"
              preset="ghost"
              size="sm"
              iconClassName="text-ws-static-subtle size-ws-9"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              aria-controls={sidebarId}
              onClick={() => setCollapsed(!collapsed)}
              className="-ml-ws-5"
            />
            <Breadcrumbs separator="arrow">
              <Breadcrumbs.Item>Chat</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The two columns fill the card under the bar. */}
        <div className="flex min-h-0 flex-1">
          <ConversationList conversations={items} selectedId={selectedId} onSelect={select} />
          <section aria-labelledby={titleId} className="flex min-w-0 flex-1 flex-col">
            <ConversationHeader
              conversation={selected}
              titleId={titleId}
              onToggleMute={() => update(selectedId, ({ muted }) => ({ muted: !muted }))}
            />
            <Thread
              key={selectedId}
              messages={selected.messages}
              newFrom={selected.newFrom}
              onReact={react}
            />
            <div className={cn(COLUMN, 'pb-ws-11 shrink-0')}>
              <Composer
                key={selectedId}
                to={selected.kind === 'channel' ? `#${selected.name}` : selected.name}
                onSend={send}
              />
            </div>
          </section>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
