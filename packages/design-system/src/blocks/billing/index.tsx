import { ToastProvider, useToast } from '@wideset/react';
import { useState } from 'react';

import { CancelPlanModal } from './cancel-plan-modal';
import { ChangePlanModal } from './change-plan-modal';
import {
  card,
  failedPayment,
  type Interval,
  invoices,
  planById,
  type PlanId,
  subscription,
  workspace,
} from './data';
import { FailedPaymentAlert } from './failed-payment-alert';
import { formatDate, formatUsd } from './format';
import { InvoicesTable } from './invoices-table';
import { PageHeader } from './page-header';
import { PaymentMethod } from './payment-method';
import { PlanCard } from './plan-card';
import { BillingSidebar } from './sidebar';

function BillingPage() {
  const { showToast } = useToast();
  const [current, setCurrent] = useState<{ planId: PlanId; interval: Interval }>({
    planId: subscription.planId,
    interval: subscription.interval,
  });
  const [cancelled, setCancelled] = useState(false);
  const [paid, setPaid] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [dialog, setDialog] = useState<'change' | 'cancel' | null>(null);

  const plan = planById(current.planId);
  const failed = invoices.find((invoice) => invoice.id === failedPayment.invoiceId)!;
  const rows = paid
    ? invoices.map((invoice) =>
        invoice.id === failed.id ? { ...invoice, status: 'paid' as const } : invoice,
      )
    : invoices;
  const closeDialog = (open: boolean) => !open && setDialog(null);

  // A timeout stands in for the charge; a real screen awaits it and keeps the alert, with the
  // bank's reason, if it is declined again.
  function retry() {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      setPaid(true);
      showToast({ content: `Payment of ${formatUsd(failed.amount)} received`, status: 'success' });
    }, 1200);
  }

  return (
    <div className="p-ws-12 gap-ws-12 mx-auto flex w-full max-w-[80rem] flex-col">
      <PageHeader
        summary={`${workspace.name} is on ${plan.name} with ${subscription.seats} seats, billed ${current.interval} to ${card.brand} ending ${card.last4}.`}
      />

      {!paid && (
        <FailedPaymentAlert
          amount={failed.amount}
          failedOn={failed.date}
          pausesOn={failedPayment.pausesOn}
          retrying={retrying}
          onRetry={retry}
        />
      )}

      <div className="gap-ws-12 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <PlanCard
          plan={plan}
          interval={current.interval}
          seats={subscription.seats}
          periodStart={subscription.periodStart}
          periodEnd={subscription.periodEnd}
          renews={subscription.renews}
          cancelled={cancelled}
          onChangePlan={() => setDialog('change')}
          onCancel={() => setDialog('cancel')}
          onResume={() => {
            setCancelled(false);
            showToast({
              content: `${plan.name} resumed. It renews on ${formatDate(subscription.renews)}.`,
            });
          }}
        />
        <PaymentMethod />
      </div>

      <InvoicesTable invoices={rows} />

      <ChangePlanModal
        open={dialog === 'change'}
        onOpenChange={closeDialog}
        current={current}
        seats={subscription.seats}
        onConfirm={(choice) => {
          setCurrent(choice);
          setCancelled(false);
          setDialog(null);
          showToast({
            content: `Switched to ${planById(choice.planId).name}, billed ${choice.interval}`,
            status: 'success',
          });
        }}
      />
      <CancelPlanModal
        open={dialog === 'cancel'}
        onOpenChange={closeDialog}
        plan={plan}
        periodEnd={subscription.periodEnd}
        renews={subscription.renews}
        onConfirm={() => {
          setCancelled(true);
          setDialog(null);
          showToast({
            content: `${plan.name} cancelled. It stays on until ${formatDate(subscription.periodEnd)}.`,
          });
        }}
      />
    </div>
  );
}

/** Billing (Inset direction): a workspace's plan, usage, payment method and invoices. */
export default function Billing() {
  return (
    <ToastProvider>
      <div className="bg-ws-static-background flex h-dvh">
        <BillingSidebar />
        <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* The page scrolls inside the card, so the card's corners stay put. */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <BillingPage />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
