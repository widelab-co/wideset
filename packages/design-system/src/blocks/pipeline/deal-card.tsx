// TODO(custom): a deal card on a board (a link across the card, a move menu, drag handlers); Wideset has no board card or draggable item.
import { RiCheckLine, RiErrorWarningLine, RiMoreFill } from '@remixicon/react';
import { cn, DropdownMenu, IconButton, ListItem } from '@wideset/react';
import type { HTMLAttributes } from 'react';

import { type Deal, PEOPLE, type StageId, STAGES, TODAY } from './data';
import { formatClose, formatUsd } from './format';
import { PersonAvatar } from './person-avatar';

type DealCardProps = {
  deal: Deal;
  /** The card left in place while its copy follows the pointer. */
  placeholder?: boolean;
  /** The copy under the pointer: lifted, and without the menu. */
  overlay?: boolean;
  /** The id of the line that says how to move a card with the keyboard. */
  hintId?: string;
  onMoveTo?: (stage: StageId) => void;
  /** Pointer and key handlers for dragging and moving, from the board. */
  handlers?: HTMLAttributes<HTMLElement>;
};

/**
 * One deal: the customer, the deal, its amount, when it should close and who owns it. The whole
 * card is one link to the deal, so it is one tab stop; Alt and an arrow move it from there, and
 * the menu on hover moves it to a stage. Every card is drawn the same in every column; a close
 * date that has passed is the one negative mark on the board.
 */
export function DealCard({
  deal,
  placeholder = false,
  overlay = false,
  hintId,
  onMoveTo,
  handlers,
}: DealCardProps) {
  const owner = PEOPLE.find((person) => person.id === deal.ownerId)!;
  const overdue = deal.close < TODAY;

  return (
    <article
      data-deal={deal.id}
      {...handlers}
      className={cn(
        'group p-ws-7 gap-ws-6 rounded-ws-container-md bg-ws-static-foreground relative flex touch-pan-y flex-col border select-none',
        'outline-ws-dynamic-primary-strong-default has-[a:focus-visible]:wds-focus-visible',
        overlay
          ? 'border-ws-static-strong shadow-ws-medium cursor-grabbing'
          : 'border-ws-static-base hover:border-ws-static-strong cursor-grab',
        placeholder && 'cursor-grabbing opacity-40',
      )}
    >
      <div className="gap-ws-5 flex items-start">
        {/* The link's box stretches over the card, so the card is one target. */}
        <a
          id={overlay ? undefined : `deal-${deal.id}`}
          href={`#deals/${deal.id}`}
          draggable={false}
          aria-describedby={hintId}
          tabIndex={overlay ? -1 : undefined}
          className="gap-ws-1 after:inset-ws-0 flex min-w-0 flex-1 flex-col outline-none after:absolute"
        >
          <span className="typography-label-strong-sm text-ws-static-strong truncate">
            {deal.customer}
          </span>
          <span className="typography-body-sm text-ws-static-subtle truncate">{deal.name}</span>
        </a>
        {onMoveTo && !overlay && !placeholder && (
          // Shown on hover or focus, and always where there is no hover.
          <span className="-mt-ws-2 -mr-ws-3 relative opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 has-[[data-state=open]]:opacity-100 [@media(hover:none)]:opacity-100">
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <IconButton
                  icon={RiMoreFill}
                  variant="secondary"
                  preset="ghost"
                  size="xs"
                  aria-label={`Move ${deal.customer}, ${deal.name}`}
                />
              </DropdownMenu.Trigger>
              {/* The card moves to another column, so the board puts the focus on it there. */}
              <DropdownMenu.Content
                align="end"
                onCloseAutoFocus={(event) => event.preventDefault()}
              >
                <DropdownMenu.Label>Move to</DropdownMenu.Label>
                {STAGES.map((stage) => (
                  <DropdownMenu.Item
                    key={stage.id}
                    disabled={stage.id === deal.stage}
                    onSelect={() => onMoveTo(stage.id)}
                  >
                    <ListItem.Content>
                      <ListItem.Label>{stage.label}</ListItem.Label>
                    </ListItem.Content>
                    {stage.id === deal.stage && (
                      <ListItem.Suffix>
                        <RiCheckLine aria-label="Current stage" className="size-ws-9" />
                      </ListItem.Suffix>
                    )}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu>
          </span>
        )}
      </div>

      <div className="gap-ws-5 flex items-center justify-between">
        <span className="typography-label-sm text-ws-static-strong tabular-nums">
          {formatUsd(deal.amount)}
        </span>
        <span className="gap-ws-5 flex min-w-0 items-center">
          <span
            className={cn(
              'gap-ws-2 typography-caption-md flex items-center whitespace-nowrap tabular-nums',
              overdue ? 'text-ws-semantic-negative' : 'text-ws-static-subtle',
            )}
          >
            {overdue && <RiErrorWarningLine aria-hidden="true" className="size-ws-8" />}
            <span className="sr-only">{overdue ? 'Overdue, was to close' : 'Closes'} </span>
            {formatClose(deal.close, TODAY)}
          </span>
          <PersonAvatar
            size="xs"
            name={owner.name}
            initials={owner.initials}
            color={owner.color}
            title={owner.name}
          />
          <span className="sr-only">, owned by {owner.name}</span>
        </span>
      </div>
    </article>
  );
}
