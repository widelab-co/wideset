import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, cn, IconButton, ToastProvider, useToast } from '@wideset/react';
import { useId, useState } from 'react';

import {
  CUSTOMERS,
  type Order,
  ORDERS,
  paidFor,
  refundableFor,
  type Sort,
  type SortKey,
  totalOf,
} from './data';
import { exportCsv } from './export-csv';
import { Filters, type FilterValues } from './filters';
import { formatUsd } from './format';
import { OrdersTable } from './orders-table';
import { PageHeader } from './page-header';
import { RefundDialog } from './refund-dialog';
import { OrdersSidebar } from './sidebar';
import { TableFooter } from './table-footer';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';
const PAGE_SIZE = 12;
const NO_FILTERS: FilterValues = { query: '', statuses: [] };
const OPPOSITE = { asc: 'desc', desc: 'asc' } as const;

// Order numbers rise with time, so the number is the date order and settles equal totals.
const compare =
  ({ key, direction }: Sort) =>
  (a: Order, b: Order) => {
    const order = (key === 'total' ? totalOf(a) - totalOf(b) : 0) || a.id.localeCompare(b.id);
    return direction === 'asc' ? order : -order;
  };

/** The page inside the card: under the toasts, so a refund can report itself. */
function OrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState(ORDERS);
  const [filters, setFilters] = useState(NO_FILTERS);
  // Counts the times the filters were cleared: the date range empties itself when it changes.
  const [cleared, setCleared] = useState(0);
  const [sort, setSort] = useState<Sort>({ key: 'placed', direction: 'desc' });
  const [page, setPage] = useState(1);
  // The order stays while the dialog closes, so its words do not vanish under the fade.
  const [refund, setRefund] = useState<{ order: Order; open: boolean }>();

  const query = filters.query.trim().toLowerCase().replace(/^#/, '');
  const { from, to } = filters.range ?? {};
  const matching = orders
    .filter(
      (order) =>
        (order.id.includes(query) ||
          CUSTOMERS[order.customer].name.toLowerCase().includes(query)) &&
        (filters.statuses.length === 0 || filters.statuses.includes(order.status)) &&
        (!from || !to || (order.placed >= from && order.placed <= to)),
    )
    .sort(compare(sort));
  const rows = matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const narrowed = query !== '' || filters.statuses.length > 0 || filters.range !== undefined;

  // Anything that changes the rows goes back to the first page.
  const filter = (values: FilterValues) => {
    setFilters(values);
    setPage(1);
  };
  const clearFilters = () => {
    filter(NO_FILTERS);
    setCleared(cleared + 1);
  };
  const sortBy = (next: Sort) => {
    setSort(next);
    setPage(1);
  };

  function applyRefund(order: Order, amount: number) {
    const refunded = order.refunded + amount;
    const status = refunded === paidFor(order) ? 'refunded' : 'partially-refunded';
    setOrders((all) => all.map((o) => (o.id === order.id ? { ...o, refunded, status } : o)));
    setRefund({ order, open: false });
    showToast({
      content: `${formatUsd(amount)} refunded to ${CUSTOMERS[order.customer].name}`,
      status: 'success',
    });
  }

  return (
    <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
      <PageHeader onExport={() => exportCsv(matching)} />

      <section aria-label="Orders" className="gap-ws-9 flex flex-col">
        <Filters
          values={filters}
          onChange={filter}
          sort={`${sort.key}-${sort.direction}`}
          onSortChange={(value) => {
            const [key, direction] = value.split('-') as [SortKey, Sort['direction']];
            sortBy({ key, direction });
          }}
          resetKey={cleared}
          // With no rows left, the empty state holds the way back.
          onClear={narrowed && rows.length > 0 ? clearFilters : undefined}
        />
        <OrdersTable
          rows={rows}
          sort={sort}
          // A second click on the sorted column turns it round.
          onSort={(key) =>
            sortBy({ key, direction: sort.key === key ? OPPOSITE[sort.direction] : 'desc' })
          }
          onRefund={(order) => setRefund({ order, open: true })}
          onClearFilters={clearFilters}
        />
        <TableFooter
          page={page}
          pageSize={PAGE_SIZE}
          total={matching.length}
          onPageChange={setPage}
        />
      </section>

      {refund && (
        <RefundDialog
          open={refund.open}
          onOpenChange={(open) => setRefund({ ...refund, open })}
          order={{
            number: `#${refund.order.id}`,
            customer: CUSTOMERS[refund.order.customer].name,
            paid: paidFor(refund.order),
            refundable: refundableFor(refund.order),
            card: CUSTOMERS[refund.order.customer].card,
          }}
          onConfirm={(amount) => applyRefund(refund.order, amount)}
        />
      )}
    </div>
  );
}

/**
 * Orders (Inset direction): the order history on the raised page beside the workspace sidebar.
 * Search, a status filter, a date range and the sort narrow one table that pages; a row opens
 * its order, and its menu refunds it in a small dialog that changes the row and says so in a
 * toast. The history is read, not acted on, so the page has no filled button: Export is
 * secondary.
 */
export default function Orders() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider>
      <AppShell direction="inset">
        <OrdersSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <AppShell.Main>
          <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
            {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is
                pulled left so its glyph, not its box, sits 20px from the edge; the crumbs follow
                it. */}
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
                <Breadcrumbs.Item>Orders</Breadcrumbs.Item>
              </Breadcrumbs>
            </div>
          </div>

          {/* The page scrolls inside the card, so the card's corners stay put. */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <OrdersPage />
          </div>
        </AppShell.Main>
      </AppShell>
    </ToastProvider>
  );
}
