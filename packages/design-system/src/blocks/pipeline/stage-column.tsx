// TODO(custom): a board column (stage name, its total, cards that scroll on their own, a drop line, Add deal); Wideset has no board or column.
import { RiAddLine } from '@remixicon/react';
import { Button, cn } from '@wideset/react';
import { type HTMLAttributes, type Ref, useId } from 'react';

import type { Deal, StageId } from './data';
import { DealCard } from './deal-card';
import { formatUsd } from './format';

/** Where a dragged card would land: a thin brand line in the gap, taking no room. */
function DropLine({ edge }: { edge: 'top' | 'bottom' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'h-ws-2 bg-ws-dynamic-primary-default rounded-ws-control-full inset-x-ws-0 pointer-events-none absolute',
        edge === 'top' ? 'top-ws-0 -translate-y-1/2' : 'bottom-ws-0 translate-y-1/2',
      )}
    />
  );
}

/**
 * One stage: its name and the total of its deals as plain text, the deals, and Add deal under
 * them. No fill behind the column: the cards carry the board, the gaps split the stages. The list
 * scrolls on its own, so a long stage never pushes the page.
 */
export function StageColumn({
  stage,
  deals,
  draggingId,
  dropIndex,
  hintId,
  listRef,
  handlersFor,
  onMoveTo,
  onAddDeal,
}: {
  stage: { id: StageId; label: string };
  deals: Deal[];
  draggingId?: string;
  /** Where a dragged card would land, among the cards other than it. */
  dropIndex?: number;
  hintId: string;
  listRef: Ref<HTMLDivElement>;
  handlersFor: (deal: Deal) => HTMLAttributes<HTMLElement>;
  onMoveTo: (deal: Deal, stage: StageId) => void;
  onAddDeal: () => void;
}) {
  const titleId = useId();
  const others = deals.filter((deal) => deal.id !== draggingId);
  const total = deals.reduce((sum, deal) => sum + deal.amount, 0);

  /** The edge of a card's slot that shows the drop line, if the card would land there. */
  const lineAt = (deal: Deal): 'top' | 'bottom' | undefined => {
    if (dropIndex === undefined) return undefined;
    const position = others.indexOf(deal);
    // Only the dragged card is in this column: the line goes above it.
    if (position === -1) return others.length === 0 ? 'top' : undefined;
    if (position === dropIndex) return 'top';
    if (position === others.length - 1 && dropIndex === others.length) return 'bottom';
    return undefined;
  };

  return (
    <section aria-labelledby={titleId} className="flex min-h-0 min-w-0 flex-col">
      <header className="gap-ws-5 pb-ws-5 flex items-baseline justify-between">
        <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong truncate">
          {stage.label}
        </h2>
        <span className="typography-label-sm text-ws-static-subtle tabular-nums">
          {formatUsd(total)}
        </span>
      </header>

      {/* Padded, so the focus ring of a card is not cut by the scrolling edge. */}
      <div
        ref={listRef}
        data-stage={stage.id}
        className="-mx-ws-3 px-ws-3 relative flex min-h-0 flex-col overflow-y-auto"
      >
        {deals.map((deal) => {
          const line = lineAt(deal);
          return (
            <div key={deal.id} className="py-ws-2 relative">
              {line && <DropLine edge={line} />}
              <DealCard
                deal={deal}
                placeholder={deal.id === draggingId}
                hintId={hintId}
                handlers={handlersFor(deal)}
                onMoveTo={(to) => onMoveTo(deal, to)}
              />
            </div>
          );
        })}
        {deals.length === 0 && (
          <div className="py-ws-5 relative">
            {dropIndex === 0 && <DropLine edge="top" />}
            <p className="typography-body-sm text-ws-static-subtle">No deals in this stage</p>
          </div>
        )}
      </div>

      <Button
        variant="secondary"
        preset="ghost"
        size="sm"
        className="mt-ws-3 self-start"
        onClick={onAddDeal}
      >
        <Button.Icon icon={RiAddLine} />
        Add deal
      </Button>
    </section>
  );
}
