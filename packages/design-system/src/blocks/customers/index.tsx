import { cn, Tabs } from '@wideset/react';
import { useState } from 'react';

import { CustomersTable, type Sort } from './customers-table';
import { account, type Customer, CUSTOMERS, type OwnerId, SEGMENTS, type SortKey } from './data';
import { Filters, type FilterValues } from './filters';
import { PageHeader } from './page-header';
import { SelectionBar } from './selection-bar';
import { CustomersSidebar } from './sidebar';
import { TableFooter } from './table-footer';

const PAGE_SIZE = 12;
const NO_FILTERS: FilterValues = { query: '', plans: [], owners: [], health: [] };
/** The direction a column sorts in first: newest, largest, A to Z. */
const FIRST_DIRECTION: Record<SortKey, Sort['direction']> = {
  lastActivity: 'desc',
  mrr: 'desc',
  name: 'asc',
};
const OPPOSITE = { asc: 'desc', desc: 'asc' } as const;

/**
 * The surround of each visual direction (specs/patterns/directions.md). An app picks one and keeps
 * it on every screen; this screen carries all four only to show that the page inside stays the
 * same. Copy the one your app uses.
 */
const SURROUND = {
  flat: { root: 'bg-ws-static-foreground', sidebar: 'page', main: '' },
  frame: { root: 'bg-ws-static-foreground', sidebar: 'tinted', main: '' },
  inset: {
    root: 'bg-ws-static-background',
    sidebar: 'frame',
    main: 'bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 overflow-hidden',
  },
  canvas: { root: 'bg-ws-static-background', sidebar: 'frame', main: '' },
} as const;
export type Direction = keyof typeof SURROUND;

const compare =
  ({ key, direction }: Sort) =>
  (a: Customer, b: Customer) => {
    const order =
      key === 'mrr'
        ? a.mrr - b.mrr
        : key === 'name'
          ? a.name.localeCompare(b.name)
          : a.lastActivity.localeCompare(b.lastActivity);
    return direction === 'asc' ? order : -order;
  };

/**
 * Customers: a CRM list to work through, in the Flat direction (or another one, through
 * `direction`). Segment tabs, search and filters narrow the table; rows select into an action
 * bar; the table sorts and pages.
 */
export default function Customers({ direction = 'flat' }: { direction?: Direction }) {
  const surround = SURROUND[direction];
  const canvas = direction === 'canvas';
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [segment, setSegment] = useState('all');
  const [filters, setFilters] = useState(NO_FILTERS);
  const [sort, setSort] = useState<Sort>({ key: 'lastActivity', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const inSegment = SEGMENTS.find((item) => item.value === segment)!.match;
  const query = filters.query.trim().toLowerCase();
  const matching = customers
    .filter(
      (c) =>
        inSegment(c) &&
        (c.name.toLowerCase().includes(query) || c.domain.includes(query)) &&
        (filters.plans.length === 0 || filters.plans.includes(c.plan)) &&
        (filters.owners.length === 0 || filters.owners.includes(c.owner)) &&
        (filters.health.length === 0 || filters.health.includes(c.health)),
    )
    .sort(compare(sort));
  const rows = matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Anything that changes the rows goes back to the first page.
  const showSegment = (value: string) => {
    setSegment(value);
    setPage(1);
  };
  const filter = (values: FilterValues) => {
    setFilters(values);
    setPage(1);
  };
  const sortBy = (key: SortKey, direction = FIRST_DIRECTION[key]) => {
    setSort({ key, direction });
    setPage(1);
  };
  const assign = (ids: string[], owner: OwnerId) =>
    setCustomers((all) => all.map((c) => (ids.includes(c.id) ? { ...c, owner } : c)));

  return (
    <div className={cn(surround.root, 'flex h-dvh')}>
      <CustomersSidebar surface={surround.sidebar} />
      <main className={cn(surround.main, 'flex min-w-0 flex-1 flex-col')}>
        <Tabs
          value={segment}
          onValueChange={showSegment}
          divider={false}
          className="min-h-0 flex-1"
        >
          <PageHeader line={!canvas} />
          <Tabs.Content value={segment} className="px-ws-12 min-h-0 flex-1 overflow-y-auto">
            {/* In Canvas the list is a white section on the grey: no border, no shadow. */}
            <div
              className={cn(
                'gap-ws-9 mx-auto flex w-full max-w-[80rem] flex-col',
                canvas
                  ? 'bg-ws-static-foreground rounded-ws-container-md p-ws-9 mt-ws-9 mb-ws-12'
                  : 'py-ws-9',
              )}
            >
              <Filters
                values={filters}
                onChange={filter}
                sort={sort.key}
                onSortChange={(key) => sortBy(key)}
              />
              <CustomersTable
                rows={rows}
                sort={sort}
                // A second click on the sorted column turns it round.
                onSort={(key) =>
                  sortBy(key, sort.key === key ? OPPOSITE[sort.direction] : undefined)
                }
                selected={selected}
                onSelectedChange={setSelected}
                onAssignToMe={(id) => assign([id], account.id)}
                onClearFilters={() => filter(NO_FILTERS)}
              />
              <TableFooter
                page={page}
                pageSize={PAGE_SIZE}
                total={matching.length}
                onPageChange={setPage}
              />
            </div>
          </Tabs.Content>
        </Tabs>
      </main>
      <SelectionBar
        count={selected.length}
        onClear={() => setSelected([])}
        onAssign={(owner) => {
          assign(selected, owner);
          setSelected([]);
        }}
      />
    </div>
  );
}
