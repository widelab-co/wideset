import { RiCheckDoubleLine, RiSettings3Line } from '@remixicon/react';
import { Button, IconButton, LinkButton, Popup, Tabs } from '@wideset/react';
import { useState } from 'react';

import { BellButton } from './bell-button';
import type { Notification } from './data';
import { groupOf, GROUPS } from './format';
import { NotificationItem } from './notification-item';

type Tab = 'all' | 'mentions';

const TABS: { value: Tab; label: string; includes: (n: Notification) => boolean }[] = [
  { value: 'all', label: 'All', includes: () => true },
  { value: 'mentions', label: 'Mentions', includes: (n) => n.mention === true },
];

type NotificationsPopoverProps = {
  notifications: Notification[];
  today: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpen: (id: string) => void;
  onAnswer: (id: string, approved: boolean) => void;
  onMarkAllRead: () => void;
};

/**
 * The bell and what it opens: the latest notifications in a popover under the page bar, so the
 * page stays in view. A header with the title, one bulk action and the settings; tabs without
 * counts; the notifications grouped by day; a footer that leads to the full inbox. It informs and
 * lets one request be answered in place, so it has no footer of buttons.
 */
export function NotificationsPopover({
  notifications,
  today,
  open,
  onOpenChange,
  onOpen,
  onAnswer,
  onMarkAllRead,
}: NotificationsPopoverProps) {
  const [tab, setTab] = useState<Tab>('all');
  const allRead = notifications.every((n) => n.read);

  return (
    <Popup open={open} onOpenChange={onOpenChange}>
      <Popup.Trigger asChild>
        <BellButton unread={!allRead} />
      </Popup.Trigger>
      <Popup.Container
        side="bottom"
        align="end"
        collisionPadding={12}
        // Focus the popover itself, not its first button: Tab and the tabs' arrows start from
        // there, and nothing looks pressed before anything is.
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          (event.currentTarget as HTMLElement).focus();
        }}
        className="max-h-[calc(100dvh-6rem)] w-[26rem]"
      >
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as Tab)}
          divider={false}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* The tabs' line is the header's own, edge to edge. */}
          <div className="border-ws-static-base pt-ws-9 px-ws-11 gap-ws-5 flex flex-col border-b">
            <div className="gap-ws-5 flex items-center justify-between">
              <Popup.Title>Notifications</Popup.Title>
              <div className="gap-ws-3 -mr-ws-5 flex items-center">
                <Button
                  size="sm"
                  variant="secondary"
                  preset="ghost"
                  disabled={allRead}
                  onClick={onMarkAllRead}
                >
                  <Button.Icon icon={RiCheckDoubleLine} />
                  Mark all as read
                </Button>
                <IconButton
                  icon={RiSettings3Line}
                  variant="secondary"
                  preset="ghost"
                  size="sm"
                  aria-label="Notification settings"
                />
              </div>
            </div>
            <Tabs.List aria-label="Notifications">
              {TABS.map(({ value, label }) => (
                <Tabs.Item key={value} value={value}>
                  <Tabs.Label>{label}</Tabs.Label>
                </Tabs.Item>
              ))}
            </Tabs.List>
          </div>

          {TABS.map(({ value, includes }) => {
            const shown = notifications.filter(includes);
            return (
              <Tabs.Content key={value} value={value} className="flex min-h-0 flex-1 flex-col">
                <Popup.Content contentClassName="px-ws-5 pt-ws-3 pb-ws-5">
                  {shown.length === 0 ? (
                    <p
                      role="status"
                      className="px-ws-7 py-ws-12 typography-body-md text-ws-static-subtle text-center"
                    >
                      No mentions yet. When someone writes your name in a comment, it shows up here.
                    </p>
                  ) : (
                    GROUPS.map((group) => {
                      const items = shown.filter((n) => groupOf(n.at, today) === group);
                      if (items.length === 0) return null;
                      return (
                        <section key={group} aria-label={group}>
                          <h3 className="px-ws-7 pt-ws-7 pb-ws-3 typography-label-sm text-ws-static-subtle">
                            {group}
                          </h3>
                          <ul className="flex flex-col">
                            {items.map((notification) => (
                              <li key={notification.id}>
                                <NotificationItem
                                  notification={notification}
                                  onOpen={() => onOpen(notification.id)}
                                  onAnswer={(approved) => onAnswer(notification.id, approved)}
                                />
                              </li>
                            ))}
                          </ul>
                        </section>
                      );
                    })
                  )}
                </Popup.Content>
              </Tabs.Content>
            );
          })}
        </Tabs>

        <div className="border-ws-static-base px-ws-11 py-ws-7 flex justify-center border-t">
          <LinkButton href="#inbox">View all notifications</LinkButton>
        </div>
      </Popup.Container>
    </Popup>
  );
}
