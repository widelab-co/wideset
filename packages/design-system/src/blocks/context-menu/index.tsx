import { RiSearchLine, RiSideBarLine } from '@remixicon/react';
import {
  AppShell,
  Breadcrumbs,
  cn,
  IconButton,
  TextInput,
  Toast,
  ToastProvider,
  useToast,
} from '@wideset/react';
import { useId, useLayoutEffect, useRef, useState } from 'react';

import { CustomerMenu, type MenuAction, type MenuAnchor } from './customer-menu';
import { CustomersTable } from './customers-table';
import { type Customer, CUSTOMERS, customerUrl, OPEN_ON, PEOPLE, type PersonId } from './data';
import { DeleteDialog } from './delete-dialog';
import { PageHeader } from './page-header';
import { CustomersSidebar } from './sidebar';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

type MenuState = { customer: Customer; anchor: MenuAnchor; open: boolean };

/**
 * The page inside the card, under the toasts. It holds the customers, so every item in the menu
 * changes the list in one place and says so: the owner and the tags change in the row, a
 * duplicate appears under its original, and an archived row goes with Undo in its toast.
 */
function CustomersPage() {
  const { showToast, dismissToast } = useToast();
  const page = useRef<HTMLDivElement>(null);
  const copies = useRef(0);
  const [rows, setRows] = useState(CUSTOMERS);
  const [query, setQuery] = useState('');
  const [menu, setMenu] = useState<MenuState>();
  // The name stays while the dialog closes, so its words do not vanish under the fade.
  const [deleting, setDeleting] = useState<{ customer: Customer; open: boolean }>();

  // On load the menu is open on Kestrel Analytics, as if it had just been right-clicked a little
  // past its name. It is placed once the row has its place on the screen.
  useLayoutEffect(() => {
    const row = page.current?.querySelector<HTMLTableRowElement>(`[data-customer="${OPEN_ON}"]`);
    const customer = CUSTOMERS.find((item) => item.id === OPEN_ON);
    if (!row || !customer) return;
    const box = row.getBoundingClientRect();
    const name = row.cells[0].getBoundingClientRect();
    setMenu({
      customer,
      open: true,
      anchor: {
        x: name.left + name.width * 0.6,
        y: box.top + box.height / 2,
        width: 0,
        height: 0,
        align: 'start',
        origin: row,
      },
    });
  }, []);

  const words = query.trim().toLowerCase();
  const shown = rows.filter((customer) =>
    `${customer.name} ${customer.domain}`.toLowerCase().includes(words),
  );

  const change = (id: string, patch: Partial<Customer>) =>
    setRows((all) =>
      all.map((customer) => (customer.id === id ? { ...customer, ...patch } : customer)),
    );

  /** A toast whose Undo puts the list back as it was before the action. */
  const toastWithUndo = (content: string) => {
    const before = rows;
    const id = showToast({
      content,
      action: (
        <Toast.Action
          preset="ghost"
          onClick={() => {
            setRows(before);
            dismissToast(id);
          }}
        >
          Undo
        </Toast.Action>
      ),
    });
  };

  const act = (customer: Customer, action: MenuAction) => {
    if (action === 'open') showToast({ content: `Opening ${customer.name}` });
    if (action === 'open-new-tab') showToast({ content: `${customer.name} opened in a new tab` });
    if (action === 'copy-link') {
      navigator.clipboard?.writeText(customerUrl(customer.id)).catch(() => {});
      showToast({ content: `Copied the link to ${customer.name}` });
    }
    if (action === 'duplicate') {
      const copy = {
        ...customer,
        id: `${customer.id}-copy-${++copies.current}`,
        name: `Copy of ${customer.name}`,
      };
      setRows((all) => all.flatMap((item) => (item.id === customer.id ? [item, copy] : [item])));
      toastWithUndo(`Duplicated ${customer.name}`);
    }
    if (action === 'archive') {
      setRows((all) => all.filter((item) => item.id !== customer.id));
      toastWithUndo(`Archived ${customer.name}`);
    }
    if (action === 'delete') setDeleting({ customer, open: true });
  };

  const assign = (customer: Customer, owner: PersonId) => {
    if (owner === customer.owner) return;
    change(customer.id, { owner });
    toastWithUndo(`${customer.name} assigned to ${owner === 'maya' ? 'you' : PEOPLE[owner].name}`);
  };

  // The menu reads the row as it is now, so a tag ticked in it shows at once.
  const menuCustomer = menu && (rows.find((item) => item.id === menu.customer.id) ?? menu.customer);

  return (
    <div ref={page} className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
      <PageHeader />

      <section aria-label="Customers" className="gap-ws-9 flex flex-col">
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
            placeholder="Search by name or domain"
            aria-label="Search customers"
          />
          <TextInput.Suffix inner>
            <TextInput.ClearButton />
          </TextInput.Suffix>
        </TextInput>
        <CustomersTable
          rows={shown}
          menuFor={menu?.open ? menu.customer.id : undefined}
          onOpen={(customer) => act(customer, 'open')}
          onMenu={(customer, anchor) => setMenu({ customer, anchor, open: true })}
          onAction={act}
        />
      </section>

      {menu && menuCustomer && (
        <CustomerMenu
          customer={menuCustomer}
          anchor={menu.anchor}
          open={menu.open}
          onOpenChange={(open) => setMenu({ ...menu, open })}
          onAction={(action) => act(menuCustomer, action)}
          onAssign={(owner) => assign(menuCustomer, owner)}
          onTagChange={(tag, on) =>
            change(menuCustomer.id, {
              tags: on
                ? [...menuCustomer.tags, tag]
                : menuCustomer.tags.filter((item) => item !== tag),
            })
          }
        />
      )}

      {deleting && (
        <DeleteDialog
          name={deleting.customer.name}
          open={deleting.open}
          onOpenChange={(open) => setDeleting({ ...deleting, open })}
          onConfirm={() => {
            setRows((all) => all.filter((item) => item.id !== deleting.customer.id));
            showToast({ content: `Deleted ${deleting.customer.name}` });
          }}
        />
      )}
    </div>
  );
}

/**
 * Context menu (panel over Customers, Inset direction): the actions on one customer, open on load
 * where its row was right-clicked. The page behind is the customers list, kept quiet: a search
 * and a table. The same menu opens from the row's ⋯ button and from Shift F10 or the Menu key on
 * a focused row, and every item in it does what it says.
 */
export default function ContextMenuBlock() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider>
      <AppShell direction="inset">
        <CustomersSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
                <Breadcrumbs.Item>Customers</Breadcrumbs.Item>
              </Breadcrumbs>
            </div>
          </div>

          {/* The page scrolls inside the card, so the card's corners stay put. */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <CustomersPage />
          </div>
        </AppShell.Main>
      </AppShell>
    </ToastProvider>
  );
}
