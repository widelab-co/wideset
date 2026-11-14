import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, cn, IconButton } from '@wideset/react';
import { useId, useState } from 'react';

import { BillingDetails } from './billing-details';
import { BillingPeriod } from './billing-period';
import { type CardErrors, emptyCard, validateCard } from './card';
import {
  billingDetails,
  type Interval,
  plan,
  priceOrder,
  type Promo,
  subscription,
  workspace,
} from './data';
import { OrderItems } from './order-items';
import { OrderSummary, type PaymentState } from './order-summary';
import { type Method, PaymentMethod } from './payment-method';
import { Section } from './section';
import { CheckoutSidebar } from './sidebar';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

/**
 * Checkout (Inset direction): paying for a plan change on the raised page beside the workspace
 * sidebar. The order is the wide column, in the order it is decided: what is bought, how often it
 * is billed, how it is paid, who is invoiced. The summary stays in view beside it and holds the
 * page's one filled button. The screen holds the whole order, so every change reprices it.
 */
export default function Checkout() {
  const cardId = useId();
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  const [seats, setSeats] = useState(subscription.seats);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [interval, setInterval] = useState<Interval>('monthly');
  const [promo, setPromo] = useState<Promo | null>(null);
  const [details, setDetails] = useState(billingDetails);
  const [method, setMethod] = useState<Method>('saved');
  const [card, setCard] = useState(emptyCard);
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [payment, setPayment] = useState<PaymentState>('idle');

  const totals = priceOrder({ seats, addOnIds, interval, promo, vatNumber: details.vatNumber });

  // A timeout stands in for the charge; a real screen awaits it and, when the bank declines,
  // says why at the card and leaves the order as it was.
  function pay() {
    if (method === 'new') {
      const errors = validateCard(card);
      setCardErrors(errors);
      const [first] = Object.keys(errors);
      if (first) return document.getElementById(`${cardId}-${first}`)?.focus();
    }
    setPayment('paying');
    setTimeout(() => setPayment('paid'), 1200);
  }

  return (
    <AppShell direction="inset">
      <CheckoutSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
                <a href="#settings">Settings</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item asChild>
                <a href="#billing">Billing</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>Checkout</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-14 pt-ws-14 pb-ws-16 flex flex-col')}>
            <header className="gap-ws-2 flex flex-col">
              <h1 className="typography-title-md text-ws-static-strong">Upgrade to {plan.name}</h1>
              <p className="typography-body-md text-ws-static-subtle">
                {payment === 'paid'
                  ? `${workspace.name} moved from ${subscription.plan} to ${plan.name} today.`
                  : `${workspace.name} moves from ${subscription.plan} to ${plan.name} today. Review the order, then pay.`}
              </p>
            </header>

            <div className="gap-ws-16 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_22rem]">
              {/* Once paid, the order is a record: it stays readable but no longer changes. */}
              <div inert={payment !== 'idle'} className="gap-ws-14 flex flex-col">
                <Section title="Plan and add-ons">
                  <OrderItems
                    seats={seats}
                    onSeatsChange={setSeats}
                    addOnIds={addOnIds}
                    onAddOnsChange={setAddOnIds}
                    interval={interval}
                  />
                </Section>
                <Section title="Billing period">
                  <BillingPeriod interval={interval} seats={seats} onChange={setInterval} />
                </Section>
                <Section title="Payment method">
                  <PaymentMethod
                    id={cardId}
                    method={method}
                    onMethodChange={setMethod}
                    card={card}
                    cardErrors={cardErrors}
                    onCardChange={(next) => {
                      setCard(next);
                      setCardErrors({});
                    }}
                  />
                </Section>
                <Section title="Billing details">
                  <BillingDetails details={details} onChange={setDetails} />
                </Section>
              </div>

              <div className="lg:top-ws-14 lg:sticky">
                <OrderSummary
                  totals={totals}
                  interval={interval}
                  promo={promo}
                  onPromoChange={setPromo}
                  payment={payment}
                  onPay={pay}
                />
              </div>
            </div>
          </div>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
