import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, IconButton, ToastProvider, useToast } from '@wideset/react';
import { useEffect, useId, useRef, useState } from 'react';

import { AlternativeOffer } from './alternative-offer';
import { ConfirmCancel } from './confirm-cancel';
import {
  alternatives,
  monthlyPrice,
  type OutcomeId,
  outcomes,
  type ReasonId,
  ROUTES,
  subscription,
} from './data';
import { formatUsd } from './format';
import { LeavingReason } from './leaving-reason';
import { OutcomeSummary } from './outcome-summary';
import { CancelSubscriptionSidebar } from './sidebar';
import { WhatHappens } from './what-happens';

/**
 * The page: four steps in one narrow column, read top to bottom, then the result in their place.
 * It holds the reason and the note, so undoing a cancellation brings the steps back as they were
 * left.
 */
function CancelSubscriptionPage() {
  const { showToast } = useToast();
  const [reason, setReason] = useState<ReasonId>();
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState<OutcomeId | null>(null);
  const [outcomeId, setOutcomeId] = useState<OutcomeId | null>(null);
  const outcome = outcomeId && outcomes[outcomeId];

  // The result replaces the steps in place, so focus moves to the title that names it.
  const title = useRef<HTMLHeadingElement>(null);
  const shown = useRef(outcomeId);
  useEffect(() => {
    if (shown.current !== outcomeId) title.current?.focus();
    shown.current = outcomeId;
  }, [outcomeId]);

  // A timeout stands in for the request; a real screen awaits it and, when it fails, stays on the
  // steps and says so in an InlineAlert above the buttons.
  const decide = (id: OutcomeId) => {
    setSaving(id);
    setTimeout(() => {
      setSaving(null);
      setOutcomeId(id);
    }, 800);
  };

  const header = outcome ?? {
    title: `Cancel the ${subscription.plan} plan`,
    line: `${formatUsd(monthlyPrice)} a month for ${subscription.seats} seats. Nothing changes until you confirm below.`,
  };

  return (
    // The page is read, not scanned: one column of 40rem, centred on the card.
    <div className="px-ws-14 gap-ws-14 pt-ws-14 pb-ws-16 mx-auto flex w-full max-w-[44rem] flex-col">
      <header className="gap-ws-2 flex flex-col">
        <h1
          ref={title}
          tabIndex={-1}
          className="typography-title-md text-ws-static-strong outline-none"
        >
          {header.title}
        </h1>
        <p className="typography-body-md text-ws-static-subtle tabular-nums">{header.line}</p>
      </header>

      {outcome ? (
        <OutcomeSummary
          outcome={outcome}
          onUndo={() => {
            setOutcomeId(null);
            showToast({ content: outcome.undone });
          }}
        />
      ) : (
        <>
          <WhatHappens />
          {/* The offer answers the reason, so the two are one step. */}
          <div>
            <LeavingReason
              reason={reason}
              onReasonChange={setReason}
              note={note}
              onNoteChange={setNote}
              disabled={saving !== null}
            />
            <AlternativeOffer
              alternative={reason && alternatives[reason]}
              busy={saving !== null}
              onAccept={(alternative) => decide(alternative.outcome)}
            />
          </div>
          <ConfirmCancel
            cancelling={saving === 'cancelled'}
            busy={saving !== null}
            onCancel={() => decide('cancelled')}
          />
        </>
      )}
    </div>
  );
}

/**
 * Cancel subscription (Inset direction): cancelling the Scale plan as one focused page on the
 * raised card beside the workspace sidebar. It says what happens and what is lost, asks why
 * without insisting, offers one alternative that fits the reason, and ends in the only red thing
 * on the page; then the page becomes the result, with the way to undo it.
 */
export default function CancelSubscription() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider>
      <div className="bg-ws-static-background flex h-dvh">
        <CancelSubscriptionSidebar
          id={sidebarId}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        />
        <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
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
                  <a href="#settings">Settings</a>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item asChild>
                  <a href={ROUTES.billing}>Billing</a>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>Cancel plan</Breadcrumbs.Item>
              </Breadcrumbs>
            </div>
          </div>

          {/* The page scrolls inside the card, so the card's corners stay put. */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <CancelSubscriptionPage />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
