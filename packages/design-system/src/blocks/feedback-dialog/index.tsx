import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, IconButton } from '@wideset/react';
import { useId, useState } from 'react';

import { FeedbackModal } from './feedback-modal';
import { HomePage } from './home-page';
import { HomeSidebar } from './sidebar';

/**
 * Feedback dialog (panel over Home, Inset direction): sending feedback on the product, open on
 * load over a quiet Home (the deals to move this week and what is coming up). Send feedback in the
 * sidebar's help area opens it again, over whatever page is open; once sent, it thanks in place.
 */
export default function FeedbackDialogBlock() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(true);

  return (
    <AppShell direction="inset">
      <HomeSidebar
        id={sidebarId}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        onFeedback={() => setOpen(true)}
      />
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
              <Breadcrumbs.Item>Home</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        <HomePage />
      </AppShell.Main>

      {/* A starting point has nowhere to send it: sending only says thanks. */}
      <FeedbackModal open={open} onOpenChange={setOpen} page="Home" />
    </AppShell>
  );
}
