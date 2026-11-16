import { RiSideBarLine } from '@remixicon/react';
import {
  AppShell,
  Breadcrumbs,
  Card,
  cn,
  IconButton,
  ToastProvider,
  useToast,
} from '@wideset/react';
import { useId, useState } from 'react';

import { Address } from './address';
import { CustomerSummary } from './customer-summary';
import { billingAddress, customer, note, order, shippingAddress, total, tracking } from './data';
import { formatDate, formatUsd } from './format';
import { ItemsTable } from './items-table';
import { KeyValue } from './key-value';
import { OrderHeader } from './order-header';
import { OrderTotals } from './order-totals';
import { RefundDialog } from './refund-dialog';
import { Section } from './section';
import { SectionCard } from './section-card';
import { OrderDetailSidebar } from './sidebar';
import { TrackingTimeline } from './tracking-timeline';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';
/** A section's two parts side by side; the second is as wide as the page's side column. */
const SPLIT = 'gap-ws-16 grid grid-cols-[minmax(0,1fr)_18rem] items-start';

/** The page inside the card: under the toasts, so a refund can report itself. */
function OrderPage() {
  const { showToast } = useToast();
  // What went back to the customer so far, in cents.
  const [refunded, setRefunded] = useState(0);
  const [refunding, setRefunding] = useState(false);

  const { shipping } = order;
  const status =
    refunded === 0 ? 'Shipped' : refunded === total ? 'Refunded' : 'Partially refunded';

  return (
    <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
      <OrderHeader
        status={status}
        onRefund={refunded < total ? () => setRefunding(true) : undefined}
        quiet={refunding}
      />

      <div className="gap-ws-16 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="gap-ws-12 flex min-w-0 flex-col">
          <SectionCard title="Items">
            {/* Straight in the card, so the table's row lines run from edge to edge. */}
            <ItemsTable />
            {/* The totals stand under the amounts they add up; how it was paid reads beside them.
                Card.Content keeps 10px free on its right for a scrollbar: the padding gives it
                back, so the amounts end on the table's. */}
            <Card.Content contentClassName="pr-ws-6">
              <div className={SPLIT}>
                <dl className="gap-ws-11 flex flex-col">
                  <KeyValue label="Paid with">{order.card}</KeyValue>
                  <KeyValue label="Paid on">{formatDate(order.paidOn)}</KeyValue>
                </dl>
                <OrderTotals refunded={refunded} />
              </div>
            </Card.Content>
          </SectionCard>

          <SectionCard title="Delivery">
            <Card.Content contentClassName="pr-ws-6">
              {/* Where the parcels are comes first; who carries them and when they land beside
                  it, in the totals' column. */}
              <div className={SPLIT}>
                <TrackingTimeline events={tracking} />
                {/* Dropped by the timeline's own inset, so the first label and the first event
                    share a line. */}
                <dl className="gap-ws-11 pt-ws-4 flex flex-col">
                  <KeyValue label="Courier">{shipping.service}</KeyValue>
                  <KeyValue label="Tracking number">{shipping.trackingNumber}</KeyValue>
                  <KeyValue label="Estimated delivery">
                    {formatDate(shipping.expected.day)}, by {shipping.expected.by}
                  </KeyValue>
                </dl>
              </div>
            </Card.Content>
          </SectionCard>
        </div>

        {/* Dropped by the card header's inset, so "Customer" stands on the cards' title line. */}
        <aside aria-label="Customer and addresses" className="gap-ws-14 lg:pt-ws-9 flex flex-col">
          <Section title="Customer">
            <CustomerSummary />
          </Section>
          <Section title="Shipping address">
            <Address lines={shippingAddress} />
          </Section>
          <Section title="Billing address">
            <Address lines={billingAddress} />
          </Section>
          <Section title="Delivery note">
            <p className="typography-body-md text-ws-static-base">{note}</p>
          </Section>
        </aside>
      </div>

      <RefundDialog
        open={refunding}
        onOpenChange={setRefunding}
        order={{
          number: order.number,
          customer: customer.name,
          paid: total,
          refundable: total - refunded,
          card: order.card,
        }}
        onConfirm={(amount) => {
          setRefunded(refunded + amount);
          setRefunding(false);
          showToast({
            content: `${formatUsd(amount)} refunded to ${customer.name}`,
            status: 'success',
          });
        }}
      />
    </div>
  );
}

/**
 * Order detail (Inset direction): one order on the raised page beside the workspace sidebar. The
 * main column reads top to bottom as the order does, each part in its own bordered card: what was
 * bought and what it came to, then where the parcels are, as a timeline whose first event is the
 * current step. The side column holds who bought and where it goes, plain, as facts to look up. Refunding takes the same dialog as the list; it changes
 * the status and adds a row to the totals.
 */
export default function OrderDetail() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider>
      <AppShell direction="inset">
        <OrderDetailSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
                <Breadcrumbs.Item asChild>
                  <a href="#orders">Orders</a>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>{order.number}</Breadcrumbs.Item>
              </Breadcrumbs>
            </div>
          </div>

          {/* The page scrolls inside the card, so the card's corners stay put. */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <OrderPage />
          </div>
        </AppShell.Main>
      </AppShell>
    </ToastProvider>
  );
}
