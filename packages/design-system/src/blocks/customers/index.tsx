import { Tabs } from '@wideset/react';
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
 * Customers: a CRM list to work through, in the Flat direction. Segment tabs with counts, search
 * and filters narrow the table; rows select into an action bar; the table sorts and pages.
 */
export default function Customers() {
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
    <div className="bg-ws-static-foreground flex h-dvh">
      <CustomersSidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <Tabs
          value={segment}
          onValueChange={showSegment}
          divider={false}
          className="min-h-0 flex-1"
        >
          <PageHeader customers={customers} />
          <Tabs.Content value={segment} className="px-ws-12 min-h-0 flex-1 overflow-y-auto">
            <div className="gap-ws-9 py-ws-9 mx-auto flex w-full max-w-[80rem] flex-col">
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
