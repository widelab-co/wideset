// TODO(custom): drag and drop between board columns with pointer events (a copy under the pointer, the drop line, Alt+arrow moves, announcements); Wideset has no sortable list or board.
import { type HTMLAttributes, type PointerEvent, useEffect, useId, useRef, useState } from 'react';

import { type Deal, type StageId, STAGES } from './data';
import { DealCard } from './deal-card';
import { StageColumn } from './stage-column';

type Target = { stage: StageId; index: number };

type Drag = {
  id: string;
  pointerId: number;
  /** Where the pointer went down, and where on the card. */
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  width: number;
  x: number;
  y: number;
  /** Past a few pixels of movement a press becomes a drag. */
  active: boolean;
  target?: Target;
};

/** How far the pointer travels before a press on a card becomes a drag, in px. */
const THRESHOLD = 4;

/**
 * The five stages side by side at a fixed 15.5rem, wide enough for a card to breathe: at 1440px four
 * stages fit and the fifth shows its edge, so the board reads as one that scrolls sideways. Cards
 * move three ways: dragged with the pointer, Alt and an arrow on a focused card (up and down within
 * its stage, left and right to the next one), or the card's Move to menu. Each move is announced,
 * and the focus stays on the card.
 */
export function PipelineBoard({
  deals,
  onMove,
  onAddDeal,
}: {
  /** The deals the filters let through, in board order. */
  deals: Deal[];
  /** Puts a deal in a stage, before another deal, or last with `null`. */
  onMove: (id: string, stage: StageId, beforeId: string | null) => void;
  onAddDeal: (stage: StageId) => void;
}) {
  const hintId = useId();
  const lists = useRef<Partial<Record<StageId, HTMLDivElement | null>>>({});
  const [drag, setDrag] = useState<Drag>();
  // A drag ends in a click on the card's link; this swallows it.
  const dragged = useRef(false);
  const [announcement, setAnnouncement] = useState('');
  const [focusId, setFocusId] = useState<string>();

  useEffect(() => {
    if (!focusId) return;
    document.getElementById(`deal-${focusId}`)?.focus();
    setFocusId(undefined);
  }, [focusId]);

  const inStage = (stage: StageId) => deals.filter((deal) => deal.stage === stage);
  const stageLabel = (stage: StageId) => STAGES.find(({ id }) => id === stage)!.label;

  /** Moves a deal to `index` among the other cards of `stage`, and says where it went. */
  const move = (deal: Deal, stage: StageId, index: number, keepFocus: boolean) => {
    const others = inStage(stage).filter(({ id }) => id !== deal.id);
    const at = Math.max(0, Math.min(index, others.length));
    onMove(deal.id, stage, others[at]?.id ?? null);
    setAnnouncement(
      `${deal.customer}, ${deal.name} moved to ${stageLabel(stage)}, ${at + 1} of ${others.length + 1}`,
    );
    if (keepFocus) setFocusId(deal.id);
  };

  /** The column under the pointer, and the slot among its cards. */
  const targetAt = (x: number, y: number, id: string): Target | undefined => {
    for (const { id: stage } of STAGES) {
      const list = lists.current[stage];
      const box = list?.getBoundingClientRect();
      if (!list || !box || x < box.left || x > box.right) continue;
      const cards = Array.from(list.querySelectorAll<HTMLElement>('[data-deal]')).filter(
        (card) => card.dataset.deal !== id,
      );
      const index = cards.findIndex((card) => {
        const rect = card.getBoundingClientRect();
        return y < rect.top + rect.height / 2;
      });
      return { stage, index: index === -1 ? cards.length : index };
    }
    return undefined;
  };

  const handlersFor = (deal: Deal): HTMLAttributes<HTMLElement> => ({
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      dragged.current = false;
      // The menu button is not a handle, and its menu (in a portal) is not part of the card.
      const target = event.target as HTMLElement;
      if (event.button !== 0 || target.closest('button') || !event.currentTarget.contains(target))
        return;
      const box = event.currentTarget.getBoundingClientRect();
      event.currentTarget.setPointerCapture?.(event.pointerId);
      setDrag({
        id: deal.id,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        offsetX: event.clientX - box.left,
        offsetY: event.clientY - box.top,
        width: box.width,
        x: event.clientX,
        y: event.clientY,
        active: false,
      });
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (drag?.pointerId !== event.pointerId) return;
      const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
      if (!drag.active && distance < THRESHOLD) return;
      setDrag({
        ...drag,
        active: true,
        x: event.clientX,
        y: event.clientY,
        // Between two columns the line stays where it was.
        target: targetAt(event.clientX, event.clientY, drag.id) ?? drag.target,
      });
    },
    onPointerUp: (event: PointerEvent<HTMLElement>) => {
      if (drag?.pointerId !== event.pointerId) return;
      if (drag.active && drag.target) {
        dragged.current = true;
        move(deal, drag.target.stage, drag.target.index, false);
      }
      setDrag(undefined);
    },
    onPointerCancel: () => setDrag(undefined),
    onClickCapture: (event) => {
      if (!dragged.current) return;
      event.preventDefault();
      dragged.current = false;
    },
    onKeyDown: (event) => {
      // Keys pressed in the card's menu reach here through the portal; they are the menu's.
      if (!event.currentTarget.contains(event.target as Node)) return;
      if (event.key === 'Escape' && drag) {
        setDrag(undefined);
        return;
      }
      if (!event.altKey) return;
      const column = inStage(deal.stage);
      const index = column.indexOf(deal);
      const stage = STAGES.findIndex(({ id }) => id === deal.stage);
      // `false`: the card is already at that edge.
      const moves: Record<string, Target | false> = {
        ArrowUp: index > 0 && { stage: deal.stage, index: index - 1 },
        ArrowDown: index < column.length - 1 && { stage: deal.stage, index: index + 1 },
        ArrowLeft: stage > 0 && { stage: STAGES[stage - 1].id, index },
        ArrowRight: stage < STAGES.length - 1 && { stage: STAGES[stage + 1].id, index },
      };
      const to = moves[event.key];
      if (to === undefined) return;
      event.preventDefault();
      if (to) move(deal, to.stage, to.index, true);
      else setAnnouncement(`${deal.customer}, ${deal.name} cannot move further that way`);
    },
  });

  const draggedDeal = drag?.active ? deals.find(({ id }) => id === drag.id) : undefined;

  return (
    // Padded like the columns, so a card's focus ring at the board's edge is not cut.
    <div className="-mx-ws-3 px-ws-3 min-h-0 flex-1 overflow-x-auto">
      <div className="gap-ws-7 grid h-full grid-cols-[repeat(5,15.5rem)] grid-rows-[minmax(0,1fr)]">
        {STAGES.map((stage) => (
          <StageColumn
            key={stage.id}
            stage={stage}
            deals={inStage(stage.id)}
            draggingId={draggedDeal?.id}
            dropIndex={drag?.target?.stage === stage.id ? drag.target.index : undefined}
            hintId={hintId}
            listRef={(element) => {
              lists.current[stage.id] = element;
            }}
            handlersFor={handlersFor}
            onMoveTo={(deal, to) => move(deal, to, 0, true)}
            onAddDeal={() => onAddDeal(stage.id)}
          />
        ))}
      </div>

      <p id={hintId} className="sr-only">
        Alt and the arrow keys move the deal: up and down within its stage, left and right to the
        next stage.
      </p>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {/* The copy under the pointer. Its place is the one value no class can hold. */}
      {draggedDeal && drag && (
        <div
          aria-hidden="true"
          className="z-ws-popout top-ws-0 left-ws-0 pointer-events-none fixed"
          style={{
            width: drag.width,
            transform: `translate(${drag.x - drag.offsetX}px, ${drag.y - drag.offsetY}px)`,
          }}
        >
          <DealCard deal={draggedDeal} overlay />
        </div>
      )}
    </div>
  );
}
