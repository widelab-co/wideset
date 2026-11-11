import { RiSearchLine, RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, cn, IconButton, TextInput } from '@wideset/react';
import { useId, useState } from 'react';

import { ActiveFilters } from './active-filters';
import { APPLIED, applyFilter, compare, DRAFT, type Sort, type SortKey } from './conditions';
import { DEALS } from './data';
import { DealsTable } from './deals-table';
import { FilterPopover } from './filter-popover';
import { PageHeader } from './page-header';
import { DealsSidebar } from './sidebar';
import { SortPopover } from './sort-popover';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';
/** The direction a column sorts in first: soonest, largest, A to Z, earliest stage. */
const FIRST: Record<SortKey, Sort['direction']> = {
  closeDate: 'asc',
  amount: 'desc',
  name: 'asc',
  customer: 'asc',
  stage: 'asc',
};
const OPPOSITE = { asc: 'desc', desc: 'asc' } as const;

/**
 * Filter popover (Inset direction): building a filter over the deals list, open on load. The
 * toolbar holds search, then Filter and Sort at its end; the filter on the list shows as chips
 * between the toolbar and the table. The popover is the builder: rows of field, test and value
 * joined by one word, applied together. Sort is its own small popover beside it.
 */
export default function FilterPopoverBlock() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(APPLIED);
  const [sort, setSort] = useState<Sort>({ key: 'closeDate', direction: 'asc' });

  const words = query.trim().toLowerCase();
  const rows = applyFilter(DEALS, filter)
    .filter((deal) => `${deal.name} ${deal.customer}`.toLowerCase().includes(words))
    .sort(compare(sort));

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <DealsSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
              <Breadcrumbs.Item>Deals</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
            <PageHeader />

            <section aria-label="Deals" className="gap-ws-9 flex flex-col">
              <div className="gap-ws-5 flex flex-wrap items-center">
                <TextInput
                  size="sm"
                  className="w-[18rem] max-w-full"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                >
                  <TextInput.Prefix inner>
                    <TextInput.Icon icon={RiSearchLine} />
                  </TextInput.Prefix>
                  <TextInput.Input
                    type="search"
                    placeholder="Search by deal or customer"
                    aria-label="Search deals"
                  />
                  <TextInput.Suffix inner>
                    <TextInput.ClearButton />
                  </TextInput.Suffix>
                </TextInput>
                <div className="gap-ws-5 ml-auto flex items-center">
                  <FilterPopover
                    applied={filter}
                    onApply={setFilter}
                    defaultOpen
                    defaultDraft={DRAFT}
                  />
                  <SortPopover sort={sort} onSortChange={setSort} />
                </div>
              </div>
              <ActiveFilters filter={filter} onChange={setFilter} />
              <DealsTable
                rows={rows}
                sort={sort}
                // A second click on the sorted column turns it round.
                onSort={(key) =>
                  setSort({
                    key,
                    direction: sort.key === key ? OPPOSITE[sort.direction] : FIRST[key],
                  })
                }
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
