import { RiPieChart2Line } from '@remixicon/react';
import { Breadcrumbs } from '@wideset/react';

import { report, ROUTES } from './data';
import { RequestAccess } from './request-access';
import { AppSidebar } from './sidebar';

/**
 * No access (Frame direction): the viewer opened a page they may not see. The page keeps its
 * place, the breadcrumbs say what it is, and the closed state takes the body: who owns it, why it
 * is closed, a request with an optional message, and the way back.
 */
export default function NoAccess() {
  return (
    <div className="bg-ws-static-foreground flex h-dvh">
      <AppSidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        {/* The bar belongs to the surround: it runs edge to edge, the crumbs 20px from its edge. */}
        <div className="h-ws-18 border-ws-static-subtle px-ws-11 flex shrink-0 items-center border-b">
          <Breadcrumbs separator="arrow">
            <Breadcrumbs.Item asChild>
              <a href={ROUTES.reports}>
                <RiPieChart2Line aria-hidden="true" className="size-ws-9" />
                Reports
              </a>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>{report.name}</Breadcrumbs.Item>
          </Breadcrumbs>
        </div>

        {/* The state hangs from a fixed height above the middle, so it stays put when the form
            gives way to the sent state. */}
        <div className="px-ws-16 py-ws-28 flex min-h-0 flex-1 items-start justify-center overflow-y-auto">
          <RequestAccess />
        </div>
      </main>
    </div>
  );
}
