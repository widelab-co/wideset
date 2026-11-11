import { RiSidebarFoldLine } from '@remixicon/react';
import { Breadcrumbs, cn, IconButton } from '@wideset/react';
import { useId, useState } from 'react';

import { ActivityTimeline } from './activity-timeline';
import { activity, invoice } from './data';
import { InvoiceDocument } from './invoice-document';
import { InvoiceHeader } from './invoice-header';
import { InvoiceSidebar } from './sidebar';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

/**
 * Invoice (Inset direction): one invoice as a document on the raised page beside the workspace
 * sidebar. The header names it and holds what to do with it; the document is the page's one
 * object, its activity a narrow column beside it.
 */
export default function Invoice() {
  const activityId = useId();
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <InvoiceSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
          {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
              left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
          <div className="gap-ws-5 px-ws-11 flex w-full items-center">
            <IconButton
              icon={RiSidebarFoldLine}
              variant="secondary"
              preset="ghost"
              size="sm"
              iconClassName="text-ws-static-subtle size-ws-9"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              aria-controls={sidebarId}
              onClick={() => setCollapsed(!collapsed)}
              className={cn('-ml-ws-5', collapsed && 'rotate-180')}
            />
            <Breadcrumbs separator="arrow">
              <Breadcrumbs.Item asChild>
                <a href="#settings">Settings</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item asChild>
                <a href="#billing">Billing</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>{invoice.number}</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
            <InvoiceHeader />

            <div className="gap-ws-16 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_18rem]">
              <InvoiceDocument />

              <aside aria-labelledby={activityId} className="gap-ws-9 flex flex-col">
                <h2 id={activityId} className="typography-label-strong-md text-ws-static-strong">
                  Activity
                </h2>
                <ActivityTimeline items={activity} />
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
