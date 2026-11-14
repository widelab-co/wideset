import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, Button, cn, IconButton, SystemAlert } from '@wideset/react';
import { useId, useRef, useState } from 'react';

import { customer, deals, lastSynced, tickets } from './data';
import { DealsTable } from './deals-table';
import { EmptyState } from './empty-state';
import { ErrorState } from './error-state';
import { formatTime } from './format';
import { Module } from './module';
import { PageHeader } from './page-header';
import { AppSidebar } from './sidebar';
import { TableSkeleton } from './table-skeleton';
import { TicketsTable } from './tickets-table';

/** One column of the page: the header and the modules share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

/** A state that stands in for the content sits in the middle of the module's body. */
const CENTRED = 'p-ws-9 flex flex-1 items-center justify-center';

/**
 * Page states (Inset direction): a customer's overview with its four modules in the four states a
 * module can be in, in reading order: loaded, loading, empty, failed. The frame and the header are
 * the same in all four; only the body changes. Retry on the failed one loads, then shows its
 * table. The line under the bar is the page-level version: one notice for the whole page.
 */
export default function PageStates() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [ticketsState, setTicketsState] = useState<'failed' | 'loading' | 'loaded'>('failed');
  const ticketsRef = useRef<HTMLElement>(null);

  // A timeout stands in for the request; a real screen awaits it and goes back to `failed` with
  // the reason if it fails again.
  function retry() {
    setTicketsState('loading');
    // Retry goes away with the error: keep the keyboard on the module it was in.
    ticketsRef.current?.focus();
    setTimeout(() => setTicketsState('loaded'), 1200);
  }

  const viewAll = (
    <Button size="sm" variant="secondary" preset="ghost">
      View all
    </Button>
  );

  return (
    <AppShell direction="inset">
      <AppSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
              <Breadcrumbs.Item asChild>
                <a href="#customers">Customers</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>{customer.name}</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page-level state: it speaks for every module, so it runs edge to edge under the
            bar and stays while the condition holds. */}
        <SystemAlert
          status="notice"
          dismissible={false}
          message={`Your connection is unstable. Some data on this page is from ${formatTime(lastSynced)}.`}
        />

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
            <PageHeader />

            {/* Equal rows: every module is as tall as the tallest, whatever state it is in. */}
            <div className="gap-ws-12 grid auto-rows-fr grid-cols-1 lg:grid-cols-2">
              <Module title="Open deals" action={viewAll}>
                <DealsTable deals={deals} />
              </Module>

              <Module title="Invoices" busy>
                <TableSkeleton />
              </Module>

              <Module title="Notes">
                <div className={CENTRED}>
                  <EmptyState
                    title="No notes yet"
                    description={`Call and meeting notes for ${customer.name} appear here.`}
                  >
                    <Button size="sm" variant="secondary" preset="border">
                      Add note
                    </Button>
                  </EmptyState>
                </div>
              </Module>

              <Module
                title="Support tickets"
                busy={ticketsState === 'loading'}
                action={ticketsState === 'loaded' && viewAll}
                regionRef={ticketsRef}
              >
                {ticketsState === 'failed' && (
                  <div className={CENTRED}>
                    <ErrorState
                      title="Support tickets did not load"
                      description="The help desk did not answer in time. Try again in a moment."
                    >
                      <Button size="sm" variant="secondary" preset="border" onClick={retry}>
                        Retry
                      </Button>
                    </ErrorState>
                  </div>
                )}
                {ticketsState === 'loading' && <TableSkeleton />}
                {ticketsState === 'loaded' && <TicketsTable tickets={tickets} />}
              </Module>
            </div>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
