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
import { useId, useRef, useState } from 'react';

import { CreditSummary } from './credit-summary';
import {
  account,
  creditOf,
  nextInvoice,
  programme,
  redeemedBefore,
  type Referral,
  referrals,
  today,
} from './data';
import { formatDate, formatUsd } from './format';
import { InviteByEmail } from './invite-by-email';
import { PageHeader } from './page-header';
import { RedeemDialog } from './redeem-dialog';
import { ReferralsTable } from './referrals-table';
import { Section } from './section';
import { ShareLink } from './share-link';
import { ReferralsSidebar } from './sidebar';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';
/** A band under another: a line and space above it. Only sharing, the page's job, has a box. */
const LINE = 'border-ws-static-subtle pt-ws-12 border-t';

/**
 * The page, in the order it is used: the deal in one line, the two ways to share in a card (the
 * page's main action, so the one thing boxed), how the credit stands, then who was invited. It holds the invitations and the credit redeemed here, so sending
 * an invite adds a row and redeeming moves the figures.
 */
function ReferralsPage() {
  const { showToast } = useToast();
  const [invited, setInvited] = useState<Referral[]>(referrals);
  const [applied, setApplied] = useState(0);
  const [redeeming, setRedeeming] = useState(false);
  const summary = useRef<HTMLElement>(null);
  const shareId = useId();

  const credit = creditOf(invited);
  const redeemed = redeemedBefore + applied;
  // Credit never takes an invoice below zero: what is left over stays available.
  const redeemable = Math.min(credit.earned - redeemed, nextInvoice.amount);

  const invite = (email: string) => {
    setInvited([{ email, invited: today, status: 'invited' }, ...invited]);
    showToast({ status: 'success', content: `Invitation sent to ${email}` });
  };

  const redeem = () => {
    setApplied(applied + redeemable);
    setRedeeming(false);
    showToast({
      status: 'success',
      content: `${formatUsd(redeemable)} comes off your ${formatDate(nextInvoice.date)} invoice`,
    });
  };

  return (
    <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
      <PageHeader />

      {/* The page's main action in the page's one card: the two ways to share. */}
      <Card role="region" aria-labelledby={shareId}>
        <Card.Header>
          <h2 id={shareId} className="typography-label-strong-md text-ws-static-strong">
            Share your link
          </h2>
        </Card.Header>
        {/* Card.Content keeps 10px free on the right for a scrollbar: the padding gives it back.
            The 32px gap puts the second field on the line of the figures' right half below. */}
        <Card.Content contentClassName="pr-ws-6">
          <div className="gap-ws-14 grid grid-cols-2 items-start">
            <ShareLink link={programme.link} quiet={redeeming} />
            <InviteByEmail
              taken={[account.email, ...invited.map((referral) => referral.email)]}
              onInvite={invite}
            />
          </div>
        </Card.Content>
      </Card>

      <CreditSummary
        ref={summary}
        earned={credit.earned}
        redeemed={redeemed}
        applied={applied}
        invoiceDate={nextInvoice.date}
        towardsBonus={credit.towardsBonus}
        onRedeem={() => setRedeeming(true)}
        // The card's border closes the band above: no line of its own, the space does it.
        className="pt-ws-9"
      />

      <Section title="Invitations" className={LINE}>
        <ReferralsTable referrals={invited} />
      </Section>

      <RedeemDialog
        open={redeeming}
        onOpenChange={setRedeeming}
        amount={redeemable}
        invoice={nextInvoice}
        onConfirm={redeem}
        // Redeeming removes the button that opened the dialog: the figures take the focus.
        onCloseAutoFocus={(event) => {
          if (!applied) return;
          event.preventDefault();
          summary.current?.focus();
        }}
      />
    </div>
  );
}

/**
 * Referrals (Inset direction): Orbit's referral programme as a settings page on the raised card
 * beside the workspace sidebar. No hero and no illustration: the link and its Copy button lead, in
 * the page's one card; the credit is three plain figures with one bar, and the people invited are
 * a short table, both on the white under lines.
 */
export default function Referrals() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider>
      <AppShell direction="inset">
        <ReferralsSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
                  <a href="#settings">Settings</a>
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>Referrals</Breadcrumbs.Item>
              </Breadcrumbs>
            </div>
          </div>

          {/* The page scrolls inside the card, so the card's corners stay put. */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ReferralsPage />
          </div>
        </AppShell.Main>
      </AppShell>
    </ToastProvider>
  );
}
