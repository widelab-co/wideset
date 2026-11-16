import { RiCheckDoubleLine } from '@remixicon/react';
import { AppShell, Button, Toast, ToastProvider, useToast } from '@wideset/react';
import { useEffect, useRef, useState } from 'react';

import {
  account,
  type Message,
  type Notification,
  notifications as initialNotifications,
  NOW,
  type Tab,
  TABS,
} from './data';
import { EmptyState } from './empty-state';
import { NotificationDetail } from './notification-detail';
import { NotificationList } from './notification-list';
import { InboxSidebar } from './sidebar';

const EMPTY: Record<Tab, { title: string; description: string }> = {
  all: {
    title: 'You’re all caught up',
    description: 'Mentions, assignments and changes to the deals you follow show up here.',
  },
  mentions: {
    title: 'No mentions',
    description: `When someone writes @${account.name} in a comment or a note, it shows up here.`,
  },
  assigned: {
    title: 'Nothing assigned to you',
    description: 'Deals, accounts and tasks someone hands over to you show up here.',
  },
};

/** Where the arrow keys move the selection: the page itself, the tabs and the list under them. */
const LIST = '[role="tablist"], [role="tabpanel"]';

const includes = (tab: Tab) => TABS.find((entry) => entry.value === tab)!.includes;

/** The page: the list beside the open notification, and the toasts their actions raise. */
function Inbox() {
  const { showToast, dismissToast } = useToast();
  const [items, setItems] = useState(initialNotifications);
  const [tab, setTab] = useState<Tab>('all');
  const [selectedId, setSelectedId] = useState<string | null>(initialNotifications[0].id);
  const [replies, setReplies] = useState<Record<string, Message[]>>({});
  const rows = useRef(new Map<string, HTMLButtonElement>());

  const shown = items.filter(includes(tab));
  const selected = shown.find((n) => n.id === selectedId) ?? null;
  const unread = items.filter((n) => !n.read).length;

  /** Opening a notification reads it. */
  const select = (id: string | null) => {
    setSelectedId(id);
    if (id) setItems((current) => current.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  // The arrow keys move the selection through the open tab while focus is on the page or in the
  // list; the sidebar, the detail and the menus keep their own keys.
  const move = useRef<(step: number) => void>(() => {});
  move.current = (step) => {
    const index = shown.findIndex((n) => n.id === selectedId);
    const next = shown[Math.min(Math.max(index + step, 0), shown.length - 1)];
    if (!next || next.id === selectedId) return;
    select(next.id);
    rows.current.get(next.id)?.focus();
  };
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      const target = event.target as Element;
      if (target !== document.body && !target.closest(LIST)) return;
      event.preventDefault();
      move.current(event.key === 'ArrowDown' ? 1 : -1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const changeTab = (next: Tab) => {
    setTab(next);
    const inTab = items.filter(includes(next));
    if (!inTab.some((n) => n.id === selectedId)) select(inTab[0]?.id ?? null);
  };

  /** Shows what an action did, with an Undo that puts the list back as it was. */
  const undoable = (content: string) => {
    const before = { items, selectedId };
    const id = showToast({
      content,
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

  const markAllRead = () => {
    setItems(items.map((n) => ({ ...n, read: true })));
    undoable(`${unread} ${unread === 1 ? 'notification' : 'notifications'} marked as read`);
  };

  const toggleRead = (notification: Notification) =>
    setItems(items.map((n) => (n.id === notification.id ? { ...n, read: !n.read } : n)));

  /** Muting hides the whole thread; the selection moves on to the next notification. */
  const mute = (notification: Notification) => {
    const index = shown.findIndex((n) => n.id === notification.id);
    const rest = shown.filter((n) => n.thread !== notification.thread);
    const next = rest[Math.min(index, rest.length - 1)];
    setItems(items.filter((n) => n.thread !== notification.thread));
    select(next?.id ?? null);
    undoable(`Muted ${notification.subject.name}`);
  };

  const reply = (notification: Notification, text: string) => {
    const message = { author: account, at: NOW.toISOString(), text };
    setReplies({ ...replies, [notification.id]: [...(replies[notification.id] ?? []), message] });
    showToast({ status: 'success', content: 'Reply sent' });
  };

  return (
    <AppShell direction="frame">
      <InboxSidebar unread={unread} />
      <AppShell.Main className="flex">
        <NotificationList
          notifications={items}
          tab={tab}
          onTabChange={changeTab}
          selectedId={selected?.id ?? null}
          onSelect={select}
          onMarkAllRead={markAllRead}
          rowRef={(id) => (row) => {
            if (row) rows.current.set(id, row);
            else rows.current.delete(id);
          }}
        />
        {selected ? (
          <NotificationDetail
            key={selected.id}
            notification={selected}
            replies={replies[selected.id] ?? []}
            onReply={(text) => reply(selected, text)}
            onToggleRead={() => toggleRead(selected)}
            onMute={() => mute(selected)}
          />
        ) : (
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <EmptyState
              icon={RiCheckDoubleLine}
              {...EMPTY[tab]}
              action={
                tab === 'all' ? undefined : (
                  <Button
                    size="sm"
                    variant="secondary"
                    preset="border"
                    onClick={() => changeTab('all')}
                  >
                    Show all notifications
                  </Button>
                )
              }
            />
          </div>
        )}
      </AppShell.Main>
    </AppShell>
  );
}

/**
 * Notifications (Frame direction): an inbox beside the open notification. The tabs filter it, the
 * arrow keys move through it, and opening a notification reads it.
 */
export default function Notifications() {
  return (
    <ToastProvider position="bottom-center">
      <Inbox />
    </ToastProvider>
  );
}
