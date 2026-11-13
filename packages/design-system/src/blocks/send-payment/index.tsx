import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, cn, IconButton, StatusBadge } from '@wideset/react';
import { useEffect, useId, useRef, useState } from 'react';

import { ConfirmDialog } from './confirm-dialog';
import {
  CONFIRM_ABOVE,
  nextTransferId,
  recentTransfers,
  recipientById,
  type Transfer,
  workspace,
} from './data';
import { formatDate, formatUsd } from './format';
import {
  draftPayment,
  emptyPayment,
  type PaymentErrors,
  type PaymentValues,
  quotePayment,
  validatePayment,
} from './payment';
import { PaymentForm } from './payment-form';
import { PaymentReceipt } from './payment-receipt';
import { PaymentReview } from './payment-review';
import { RecentTransfers } from './recent-transfers';
import { SendPaymentSidebar } from './sidebar';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

type Step = 'form' | 'review' | 'receipt';

/**
 * Send payment (Inset direction): one payment on the raised page beside the workspace sidebar,
 * in three steps that share one narrow card: the form, the review before anything moves, and the
 * receipt the page becomes. The recent transfers stand beside it as text. The screen holds the
 * payment, so going back keeps what was typed; a payment over the limit is confirmed in a dialog.
 */
export default function SendPayment() {
  const formId = useId();
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  const [step, setStep] = useState<Step>('form');
  const [values, setValues] = useState<PaymentValues>(draftPayment);
  const [errors, setErrors] = useState<PaymentErrors>({});
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);

  const quote = quotePayment(values);
  const recipient = recipientById(values.recipientId)?.name ?? '';
  const amount = formatUsd(quote.amount);

  // Each step replaces the last one in place, so focus moves to the title that names it.
  const title = useRef<HTMLHeadingElement>(null);
  const shown = useRef(step);
  useEffect(() => {
    if (shown.current !== step) title.current?.focus();
    shown.current = step;
  }, [step]);

  const change = (patch: Partial<PaymentValues>) => {
    setValues((current) => ({ ...current, ...patch }));
    // A field stops being in error the moment it is changed; it is checked again on submit.
    setErrors((current) => ({
      ...current,
      ...Object.fromEntries(Object.keys(patch).map((field) => [field, undefined])),
    }));
  };

  const review = () => {
    const found = validatePayment(values);
    setErrors(found);
    const [first] = Object.keys(found);
    if (first) document.getElementById(`${formId}-${first}`)?.focus();
    else setStep('review');
  };

  // A timeout stands in for the transfer; a real screen awaits it and, when it is refused, stays
  // on the review and says why.
  const send = () => {
    setConfirming(false);
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStep('receipt');
    }, 1200);
  };

  const status = quote.scheduled ? 'Scheduled' : 'Processing';
  const header = {
    form: {
      title: 'Send payment',
      line: `Pay a saved recipient from ${workspace.name}’s balance.`,
    },
    review: {
      title: 'Review payment',
      line: 'Check it over. Nothing moves until you send it.',
    },
    receipt: quote.scheduled
      ? {
          title: 'Payment scheduled',
          line: `${amount} goes to ${recipient} on ${formatDate(quote.sendDate)}.`,
        }
      : {
          title: 'Payment sent',
          line: `${amount} is on its way to ${recipient} and should arrive by ${formatDate(quote.arrival)}.`,
        },
  }[step];

  const sent: Transfer = {
    id: nextTransferId,
    recipient,
    date: quote.sendDate,
    amount: quote.amount,
    status,
  };

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <SendPaymentSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
              <Breadcrumbs.Item asChild>
                <a href="#payouts">Payouts</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>Send payment</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
            <header className="gap-ws-2 flex flex-col">
              <div className="gap-ws-7 flex items-center">
                <h1
                  ref={title}
                  tabIndex={-1}
                  className="typography-title-md text-ws-static-strong outline-none"
                >
                  {header.title}
                </h1>
                {/* Processing and Scheduled are lifecycle states, so the badge stays neutral. */}
                {step === 'receipt' && <StatusBadge size="lg">{status}</StatusBadge>}
              </div>
              <p className="typography-body-md text-ws-static-subtle tabular-nums">{header.line}</p>
            </header>

            <div className="gap-ws-18 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,38rem)_18rem]">
              {step === 'form' && (
                <PaymentForm
                  id={formId}
                  values={values}
                  errors={errors}
                  onChange={change}
                  onSubmit={review}
                />
              )}
              {step === 'review' && (
                <PaymentReview
                  values={values}
                  quote={quote}
                  sending={sending}
                  onBack={() => setStep('form')}
                  onSend={() => (quote.amount > CONFIRM_ABOVE ? setConfirming(true) : send())}
                />
              )}
              {step === 'receipt' && (
                <PaymentReceipt
                  values={values}
                  quote={quote}
                  transferId={nextTransferId}
                  onSendAnother={() => {
                    setValues(emptyPayment);
                    setStep('form');
                  }}
                />
              )}

              <RecentTransfers
                transfers={step === 'receipt' ? [sent, ...recentTransfers] : recentTransfers}
              />
            </div>
          </div>
        </div>
      </main>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        amount={quote.amount}
        recipient={recipient}
        scheduled={quote.scheduled}
        onConfirm={send}
      />
    </div>
  );
}
