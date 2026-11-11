import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, IconButton, Toast, ToastProvider, useToast } from '@wideset/react';
import { useEffect, useId, useRef, useState } from 'react';

import { Conversation } from './conversation';
import { ConversationList, type Filter } from './conversation-list';
import {
  account,
  type Conversation as ConversationData,
  conversations as initialConversations,
  NOW,
} from './data';
import { InboxSidebar } from './sidebar';

const PASSES: Record<Filter, (conversation: ConversationData) => boolean> = {
  all: () => true,
  unread: (conversation) => conversation.unread,
  starred: (conversation) => conversation.starred,
};

/** Whether the search is in the sender, the customer, the subject or the text. */
const matches = (conversation: ConversationData, query: string) => {
  const { contact, customer, subject, messages } = conversation;
  const text = [contact.name, customer, subject, ...messages.flatMap((message) => message.body)];
  return text.join(' ').toLowerCase().includes(query.trim().toLowerCase());
};

type PageProps = { sidebarId: string; collapsed: boolean; onToggleSidebar: () => void };

/** The page inside the card: the bar, then the list beside the open conversation. */
function Page({ sidebarId, collapsed, onToggleSidebar }: PageProps) {
  const { showToast, dismissToast } = useToast();
  const [items, setItems] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(initialConversations[0].id);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const list = useRef<HTMLDivElement>(null);
  const rows = useRef(new Map<string, HTMLButtonElement>());

  // The open conversation stays listed whatever the filter: reading an unread one does not take it
  // out from under the reader, and a filter never opens (and so reads) something on its own.
  const shown = items.filter(
    (item) => matches(item, query) && (PASSES[filter](item) || item.id === selectedId),
  );
  const selected = items.find((item) => item.id === selectedId) ?? null;

  const update = (id: string, change: Partial<ConversationData>) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...change } : item)));

  /** Opening a conversation reads it. */
  const select = (id: string | null) => {
    setSelectedId(id);
    if (id) update(id, { unread: false });
  };

  // The arrow keys move through the list while focus is on the page or in the list; the fields,
  // the thread and the menus keep their own keys.
  const move = useRef<(step: number) => void>(() => {});
  move.current = (step) => {
    const index = shown.findIndex((item) => item.id === selectedId);
    const next = shown[Math.min(Math.max(index + step, 0), shown.length - 1)];
    if (!next || next.id === selectedId) return;
    select(next.id);
    rows.current.get(next.id)?.focus();
  };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      const target = event.target as Node;
      if (target !== document.body && !list.current?.contains(target)) return;
      event.preventDefault();
      move.current(event.key === 'ArrowDown' ? 1 : -1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  /** Archiving takes the conversation out of the inbox and opens the next; Undo puts it back. */
  const archive = (conversation: ConversationData) => {
    const before = { items, selectedId };
    const index = shown.findIndex((item) => item.id === conversation.id);
    const rest = shown.filter((item) => item.id !== conversation.id);
    setItems(items.filter((item) => item.id !== conversation.id));
    select(rest[Math.min(index, rest.length - 1)]?.id ?? null);
    const id = showToast({
      content: 'Conversation archived',
      action: (
        <Toast.Action
          preset="ghost"
          onClick={() => {
            setItems(before.items);
            setSelectedId(before.selectedId);
            dismissToast(id);
          }}
        >
          Undo
        </Toast.Action>
      ),
    });
  };

  const reply = (conversation: ConversationData, text: string) => {
    const message = {
      id: `${conversation.id}-${conversation.messages.length + 1}`,
      from: account,
      at: NOW,
      body: text.split(/\n+/),
    };
    update(conversation.id, { messages: [...conversation.messages, message] });
  };

  return (
    <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
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
            onClick={onToggleSidebar}
            className="-ml-ws-5"
          />
          <Breadcrumbs separator="arrow">
            <Breadcrumbs.Item>Inbox</Breadcrumbs.Item>
          </Breadcrumbs>
        </div>
      </div>

      {/* The two columns fill the card under the bar; each scrolls on its own. */}
      <div className="flex min-h-0 flex-1">
        <ConversationList
          conversations={shown}
          query={query}
          onQueryChange={setQuery}
          filter={filter}
          onFilterChange={setFilter}
          selectedId={selectedId}
          onSelect={select}
          listRef={list}
          rowRef={(id) => (row) => {
            if (row) rows.current.set(id, row);
            else rows.current.delete(id);
          }}
        />
        {/* With nothing open the list says why; the rest of the page stays empty. */}
        {selected && (
          <Conversation
            key={selected.id}
            conversation={selected}
            onArchive={() => archive(selected)}
            onToggleStar={() => update(selected.id, { starred: !selected.starred })}
            onToggleRead={() => update(selected.id, { unread: !selected.unread })}
            onReply={(text) => reply(selected, text)}
          />
        )}
      </div>
    </main>
  );
}

/**
 * Inbox (Inset direction): mail with customers on the raised page beside the workspace sidebar.
 * The list and the open conversation are two columns under the bar, split by a line; reading,
 * archiving and replying all happen without leaving the page.
 */
export default function Inbox() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider position="bottom-center">
      <div className="bg-ws-static-background flex h-dvh">
        <InboxSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <Page
          sidebarId={sidebarId}
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
        />
      </div>
    </ToastProvider>
  );
}
