import { RiCheckDoubleLine } from '@remixicon/react';
import { Button, Tabs } from '@wideset/react';
import { useId } from 'react';

import { type Notification, type Tab, TABS } from './data';
import { groupOf, GROUPS } from './format';
import { NotificationRow } from './notification-row';

type NotificationListProps = {
  notifications: Notification[];
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMarkAllRead: () => void;
  /** Where the rows register themselves, so the arrow keys can move focus with the selection. */
  rowRef: (id: string) => (row: HTMLButtonElement | null) => void;
};

/**
 * The inbox column: its title and one bulk action, the tabs, and the notifications of the open
 * tab grouped by day, newest first. The unread dot on a row says what is new.
 */
export function NotificationList({
  notifications,
  tab,
  onTabChange,
  selectedId,
  onSelect,
  onMarkAllRead,
  rowRef,
}: NotificationListProps) {
  const titleId = useId();
  const allRead = notifications.every((n) => n.read);

  return (
    <section
      aria-labelledby={titleId}
      className="border-ws-static-subtle flex w-[28rem] shrink-0 flex-col border-r"
    >
      <Tabs
        value={tab}
        onValueChange={(value) => onTabChange(value as Tab)}
        className="min-h-0 flex-1"
      >
        {/* 96px, as the detail's header: the two lines meet across the page. */}
        <div className="h-ws-24 flex shrink-0 flex-col justify-end">
          <div className="gap-ws-9 px-ws-11 flex flex-1 items-center justify-between">
            <h1 id={titleId} className="typography-subtitle-md text-ws-static-strong">
              Inbox
            </h1>
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
          </div>
          <Tabs.List aria-label="Notifications" className="px-ws-11 w-full">
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
            <Tabs.Content
              key={value}
              value={value}
              className="px-ws-5 pb-ws-7 min-h-0 flex-1 overflow-y-auto"
            >
              {shown.length === 0 ? (
                <p role="status" className="sr-only">
                  No notifications here
                </p>
              ) : (
                GROUPS.map((group) => {
                  const items = shown.filter((n) => groupOf(n.at) === group);
                  if (items.length === 0) return null;
                  return (
                    <section key={group} aria-label={group}>
                      <h2 className="px-ws-7 pt-ws-9 pb-ws-3 typography-label-sm text-ws-static-subtle">
                        {group}
                      </h2>
                      <ul className="flex flex-col">
                        {items.map((notification) => (
                          <li key={notification.id}>
                            <NotificationRow
                              ref={rowRef(notification.id)}
                              notification={notification}
                              selected={notification.id === selectedId}
                              onSelect={() => onSelect(notification.id)}
                            />
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })
              )}
            </Tabs.Content>
          );
        })}
      </Tabs>
    </section>
  );
}
