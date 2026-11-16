import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, cn, IconButton, Popup, Tabs } from '@wideset/react';
import { useId, useRef, useState } from 'react';

import { CoachMark } from './coach-mark';
import { CustomersTable } from './customers-table';
import { type Customer, CUSTOMERS, type OwnerId, SEGMENTS, type SortKey, TOUR } from './data';
import { Filters, type FilterValues } from './filters';
import { HelpMenu } from './help-menu';
import { PageHeader } from './page-header';
import { CustomersSidebar } from './sidebar';
import { TourContext, TourSpot } from './tour-spot';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';
const NO_FILTERS: FilterValues = { query: '', plans: [], owners: [], health: [] };
/** The signed-in teammate, for "Assign to me". */
const ME: OwnerId = 'maya';

const compare = (key: SortKey) => (a: Customer, b: Customer) =>
  key === 'mrr'
    ? b.mrr - a.mrr
    : key === 'name'
      ? a.name.localeCompare(b.name)
      : b.lastActivity.localeCompare(a.lastActivity);

/**
 * Coach marks (Inset direction): a four-step tour of Customers for a new teammate, open on load
 * over the real page. One mark at a time sits under the control it explains (the segment tabs, the
 * filters, a row's menu, Add customer), and that control alone takes a ring in the brand colour.
 * There is no scrim: the page stays as it is, readable and usable, so the tour is a light layer on
 * it rather than a curtain in front of it. "Take the tour" in the help menu at the end of the top
 * bar starts it again.
 */
export default function CoachMarks() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [segment, setSegment] = useState('all');
  const [filters, setFilters] = useState(NO_FILTERS);
  const [sort, setSort] = useState<SortKey>('lastActivity');
  const [tour, setTour] = useState({ step: 0, open: true });
  const help = useRef<HTMLButtonElement>(null);

  const inSegment = SEGMENTS.find((item) => item.value === segment)!.match;
  const query = filters.query.trim().toLowerCase();
  const rows = customers
    .filter(
      (c) =>
        inSegment(c) &&
        (c.name.toLowerCase().includes(query) || c.id.includes(query)) &&
        (filters.plans.length === 0 || filters.plans.includes(c.plan)) &&
        (filters.owners.length === 0 || filters.owners.includes(c.owner)) &&
        (filters.health.length === 0 || filters.health.includes(c.health)),
    )
    .sort(compare(sort));

  return (
    // The tour's Popup holds the whole page: its anchor is whichever control the step rings.
    <Popup open={tour.open}>
      <TourContext.Provider value={{ target: TOUR[tour.step].target, open: tour.open }}>
        <AppShell direction="inset">
          <CustomersSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
          <AppShell.Main>
            <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
              {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is
                  pulled left so its glyph, not its box, sits 20px from the edge; the crumbs
                  follow it, and the page's help closes the bar on the right. */}
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
                <Breadcrumbs separator="arrow" className="min-w-0 flex-1">
                  <Breadcrumbs.Item>Customers</Breadcrumbs.Item>
                </Breadcrumbs>
                <HelpMenu triggerRef={help} onTakeTour={() => setTour({ step: 0, open: true })} />
              </div>
            </div>

            {/* The page scrolls inside the card, so the card's corners stay put. */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
                <PageHeader />

                <Tabs value={segment} onValueChange={setSegment} divider={false}>
                  <div className="border-ws-static-base border-b">
                    <TourSpot id="segments" className="w-fit">
                      <Tabs.List aria-label="Segments">
                        {SEGMENTS.map((item) => (
                          <Tabs.Item key={item.value} value={item.value}>
                            <Tabs.Label>{item.label}</Tabs.Label>
                          </Tabs.Item>
                        ))}
                      </Tabs.List>
                    </TourSpot>
                  </div>
                  <Tabs.Content value={segment} className="gap-ws-9 pt-ws-9 flex flex-col">
                    <Filters
                      values={filters}
                      onChange={setFilters}
                      sort={sort}
                      onSortChange={setSort}
                    />
                    <CustomersTable
                      rows={rows}
                      onAssignToMe={(id) =>
                        setCustomers((all) =>
                          all.map((c) => (c.id === id ? { ...c, owner: ME } : c)),
                        )
                      }
                    />
                  </Tabs.Content>
                </Tabs>
              </div>
            </div>
          </AppShell.Main>
        </AppShell>
      </TourContext.Provider>
      <CoachMark
        steps={TOUR}
        step={tour.step}
        open={tour.open}
        onStepChange={(step) => setTour({ step, open: true })}
        onClose={() => setTour((current) => ({ ...current, open: false }))}
        returnFocusRef={help}
      />
    </Popup>
  );
}
