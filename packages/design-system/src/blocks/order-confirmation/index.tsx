import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, IconButton } from '@wideset/react';
import { useId, useState } from 'react';

import { ConfirmationHeader } from './confirmation-header';
import { order } from './data';
import { NextSteps } from './next-steps';
import { Receipt } from './receipt';
import { AppSidebar } from './sidebar';

/**
 * Order confirmation (Inset direction): the page after a purchase, here an upgrade from Growth to
 * Scale. One narrow reading column on the raised page, in the order the buyer asks: did it work,
 * what happens next, what did I pay, what do I do now. The way on is the only filled button.
 */
export default function OrderConfirmation() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <AppSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
              onClick={() => setCollapsed(!collapsed)}
              className="-ml-ws-5"
            />
            <Breadcrumbs separator="arrow">
              <Breadcrumbs.Item asChild>
                <a href="#settings">Settings</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item asChild>
                <a href="#billing">Billing</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>{`Order ${order.number}`}</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* A confirmation is read, not scanned: one column of 40rem, centred on the page. */}
          <div className="px-ws-14 gap-ws-14 pt-ws-14 pb-ws-16 mx-auto flex w-full max-w-[44rem] flex-col">
            <ConfirmationHeader />
            <Receipt />
            <NextSteps />
          </div>
        </div>
      </main>
    </div>
  );
}
