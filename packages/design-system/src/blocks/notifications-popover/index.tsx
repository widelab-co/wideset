import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, IconButton } from '@wideset/react';
import { useId, useState } from 'react';

import { type Notification, notifications as notificationsAtStart, TODAY } from './data';
import { HomePage } from './home-page';
import { NotificationsPopover } from './notifications-popover';
import { WorkspaceSidebar } from './sidebar';

/**
 * Notifications popover (panel over Home, Inset direction): the bell at the right of the page bar,
 * its popover open on load. Opening a notification reads it and closes the popover, as going to
 * it would; answering the access request resolves it in place; when nothing is left unread the
 * bell loses its dot.
 */
export default function NotificationsPopoverBlock() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(true);
  const [notifications, setNotifications] = useState(notificationsAtStart);

  const update = (id: string, change: Partial<Notification>) =>
    setNotifications((current) => current.map((n) => (n.id === id ? { ...n, ...change } : n)));

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <WorkspaceSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
          {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
              left so its glyph, not its box, sits 20px from the edge; the crumbs follow it, the
              bell is pulled right the same way. */}
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
              <Breadcrumbs.Item>Home</Breadcrumbs.Item>
            </Breadcrumbs>
            <div className="-mr-ws-5 ml-auto">
              <NotificationsPopover
                notifications={notifications}
                today={TODAY}
                open={open}
                onOpenChange={setOpen}
                onOpen={(id) => {
                  update(id, { read: true });
                  setOpen(false);
                }}
                onAnswer={(id, approved) =>
                  update(id, {
                    read: true,
                    request: { status: approved ? 'approved' : 'declined' },
                  })
                }
                onMarkAllRead={() =>
                  setNotifications((current) => current.map((n) => ({ ...n, read: true })))
                }
              />
            </div>
          </div>
        </div>

        <HomePage />
      </main>
    </div>
  );
}
