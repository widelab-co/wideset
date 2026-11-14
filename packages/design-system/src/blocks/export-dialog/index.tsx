import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, cn, IconButton, ToastProvider, useToast } from '@wideset/react';
import { useId, useState } from 'react';

import { CustomersTable } from './customers-table';
import { account, CUSTOMERS, START_SELECTION } from './data';
import { ExportDialog } from './export-dialog';
import { Filters, type FilterValues, isFiltered, NO_FILTERS } from './filters';
import { formatCustomers } from './format';
import { PageHeader } from './page-header';
import { CustomersSidebar } from './sidebar';
import { TableFooter } from './table-footer';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';
const PAGE_SIZE = 12;
/** The list opens filtered to the Enterprise segment. */
const START_FILTERS: FilterValues = { ...NO_FILTERS, segments: ['enterprise'] };

/** The screen inside the toasts: the list, its filters and selection, and the dialog over them. */
function CustomersScreen() {
  const sidebarId = useId();
  const { showToast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [filters, setFilters] = useState(START_FILTERS);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(START_SELECTION);
  // The dialog starts afresh every time it opens.
  const [dialog, setDialog] = useState({ key: 0, open: true });

  const words = filters.query.trim().toLowerCase();
  const matching = CUSTOMERS.filter(
    (customer) =>
      `${customer.name} ${customer.domain}`.toLowerCase().includes(words) &&
      (filters.segments.length === 0 || filters.segments.includes(customer.segment)) &&
      (filters.owners.length === 0 || filters.owners.includes(customer.owner)) &&
      (filters.health.length === 0 || filters.health.includes(customer.health)),
  ).sort((a, b) => b.arr - a.arr);
  const rows = matching.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AppShell direction="inset">
      <CustomersSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
              <Breadcrumbs.Item>Customers</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
            <PageHeader onExport={() => setDialog({ key: dialog.key + 1, open: true })} />
            <section aria-label="Customers" className="gap-ws-9 flex flex-col">
              <Filters
                values={filters}
                onChange={(values) => {
                  setFilters(values);
                  setPage(1);
                }}
              />
              <CustomersTable rows={rows} selected={selected} onSelectedChange={setSelected} />
              <TableFooter
                page={page}
                pageSize={PAGE_SIZE}
                total={matching.length}
                onPageChange={setPage}
              />
            </section>
          </div>
        </div>
      </AppShell.Main>

      <ExportDialog
        key={dialog.key}
        open={dialog.open}
        onOpenChange={(open) => setDialog({ ...dialog, open })}
        customers={CUSTOMERS}
        matching={isFiltered(filters) ? matching : undefined}
        selected={CUSTOMERS.filter((customer) => selected.includes(customer.id))}
        onQueued={(count) =>
          showToast({
            variant: 'expanded',
            content: `Exporting ${formatCustomers(count)}`,
            description: `We will e-mail the file to ${account.email} when it is ready.`,
          })
        }
        onSent={(fileName) => showToast({ content: `Sent ${fileName} to ${account.email}` })}
      />
    </AppShell>
  );
}

/**
 * Export dialog (panel over Customers, Inset direction): the customers list filtered to
 * Enterprise, three rows selected and Export pressed, so the dialog is open on load. Export in
 * the page header opens it again; it offers the three scopes the list gives it, with their real
 * counts, then prepares the file in place.
 */
export default function ExportDialogBlock() {
  return (
    <ToastProvider>
      <CustomersScreen />
    </ToastProvider>
  );
}
