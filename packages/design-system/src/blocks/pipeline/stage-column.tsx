// TODO(custom): a board column (stage name, its total, cards that scroll on their own, a drop line, Add deal); Wideset has no board or column.
import { RiAddLine } from '@remixicon/react';
import { Button, cn, StatusBadge, type StatusBadgeProps } from '@wideset/react';
import { type HTMLAttributes, type Ref, useId } from 'react';

import type { Deal, StageId } from './data';
import { DealCard } from './deal-card';
import { formatUsd } from './format';

/**
 * A stage's colour says how its deals stand, as on the sales overview: the early stages carry
 * nothing yet, a proposal is out and in progress, a negotiation needs a look, a commit is as good
 * as won.
 */
const STAGE_COLOR: Record<StageId, NonNullable<StatusBadgeProps['color']>> = {
  qualified: 'neutral',
  discovery: 'neutral',
  proposal: 'info',
  negotiation: 'notice',
  commit: 'positive',
};

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
 * One stage: a quiet grey container that holds its name as a badge in the stage's colour, the total
 * of its deals, the white deal cards, and Add deal under them. The fill groups a stage at a glance
 * and lets the white cards stand off it. The list scrolls on its own, so a long stage never pushes
 * the page.
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
    <section
      aria-labelledby={titleId}
      className="bg-ws-static-alpha-subtle rounded-ws-container-md p-ws-5 flex min-h-0 min-w-0 flex-col"
    >
      {/* The badge's text lines up with the cards' text under it. */}
      <header className="gap-ws-5 pl-ws-2 pr-ws-7 pb-ws-5 flex items-center justify-between">
        <StatusBadge size="lg" color={STAGE_COLOR[stage.id]} className="min-w-0">
          <h2 id={titleId} className="truncate">
            {stage.label}
          </h2>
        </StatusBadge>
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
            <div key={deal.id} className="py-ws-3 relative">
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
          <div className="py-ws-5 px-ws-7 relative">
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
