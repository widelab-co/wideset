import { Button, cn } from '@wideset/react';
import { forwardRef } from 'react';

import { programme } from './data';
import { formatDay, formatTeams, formatUsd } from './format';
import { KeyFigure } from './key-figure';
import { RewardProgress } from './reward-progress';

/** A figure after the first: a line on its left, then the 16px a table cell is padded by, so the
    figures stand on the columns of the table under them. */
const DIVIDED = 'border-ws-static-subtle pl-ws-9 border-l';

type CreditSummaryProps = {
  /** Credit earned so far, bonuses included. */
  earned: number;
  /** Credit that has gone against an invoice, this page's redemption included. */
  redeemed: number;
  /** Credit redeemed on this page: it comes off the next invoice. */
  applied: number;
  /** The day the next invoice is issued. */
  invoiceDate: string;
  /** Subscribed teams counted towards the next bonus. */
  towardsBonus: number;
  onRedeem: () => void;
  className?: string;
};

/**
 * How the programme is going, as one row of figures split by lines: the money on the left half
 * (what was earned, what is left to spend), the progress to the next bonus on the right half,
 * under the two halves of the share row. Only the progress has a bar. Redeeming is the available
 * credit's own action, a secondary button on its line; once the credit is spent the button goes
 * and the line under the figure says where the money went. The row can take focus, for the
 * moment the button that held it is gone.
 */
export const CreditSummary = forwardRef<HTMLElement, CreditSummaryProps>(function CreditSummary(
  { earned, redeemed, applied, invoiceDate, towardsBonus, onRedeem, className },
  ref,
) {
  const available = earned - redeemed;
  const toGo = programme.bonus.every - towardsBonus;

  return (
    <section
      ref={ref}
      tabIndex={-1}
      aria-label="Credit"
      className={cn('grid grid-cols-4 outline-none', className)}
    >
      <KeyFigure
        label="Credit earned"
        value={formatUsd(earned)}
        note={`${formatUsd(redeemed)} redeemed so far`}
        className="pr-ws-9"
      />
      <KeyFigure
        label="Credit available"
        value={formatUsd(available)}
        note={
          applied
            ? `${formatUsd(applied)} off the ${formatDay(invoiceDate)} invoice`
            : 'Not yet applied to an invoice'
        }
        action={
          available > 0 && (
            <Button size="sm" variant="secondary" preset="border" onClick={onRedeem}>
              Redeem
            </Button>
          )
        }
        className={cn(DIVIDED, 'pr-ws-9')}
      />
      <RewardProgress
        label="Next reward"
        value={towardsBonus}
        target={programme.bonus.every}
        unit="teams subscribed"
        note={`${formatTeams(toGo)} to go for a ${formatUsd(programme.bonus.amount)} bonus`}
        className={cn(DIVIDED, 'col-span-2')}
      />
    </section>
  );
});
