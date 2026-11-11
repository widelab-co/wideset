// TODO(custom): the checks a pull request ran, as rows (state, name, time) where a failed one opens on its log; Wideset has no check list, and Accordion's rows all open.
import {
  type RemixiconComponentType,
  RiArrowRightSLine,
  RiCheckboxCircleFill,
  RiCheckLine,
  RiCloseCircleFill,
} from '@remixicon/react';
import { Button, Card, cn } from '@wideset/react';
import { useId, useRef, useState } from 'react';

import { type Check, CHECKS, type CheckState } from './checks-data';
import { formatDuration } from './checks-format';
import { LogExcerpt } from './checks-log-excerpt';

/** A state is a judgement, so its mark takes the colour of its meaning; the shape says it too. */
const STATE: Record<CheckState, { icon: RemixiconComponentType; colour: string; spoken: string }> =
  {
    passed: {
      icon: RiCheckboxCircleFill,
      colour: 'text-ws-semantic-positive',
      spoken: 'Passed in',
    },
    failed: {
      icon: RiCloseCircleFill,
      colour: 'text-ws-semantic-negative',
      spoken: 'Failed after',
    },
  };

/**
 * One check: its state's mark, its name, how long it ran. A failed check opens on the lines of
 * its log that say why, with the way on under them: ask Tandem to fix it (the pane's one accented
 * action, bordered, never filled: it writes the request into the session's composer) or read the
 * whole log. Folded, it says what failed in a line
 * under its name. A check with nothing to show is a plain row, not a control.
 */
function CheckRow({ check, onFix }: { check: Check; onFix?: (text: string) => void }) {
  const [open, setOpen] = useState(check.state === 'failed');
  const [sent, setSent] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const detailId = useId();
  const { icon: Icon, colour, spoken } = STATE[check.state];

  // The button gives way to a line saying where the request went. Without a composer to take the
  // focus, it goes back to the row.
  const send = () => {
    setSent(true);
    toggle.current?.focus();
    onFix?.(`Fix the failing ${check.name} check: ${check.reason}`);
  };

  return (
    <li className="border-ws-static-base border-b last:border-b-0">
      <div
        className={cn(
          'gap-ws-5 px-ws-11 py-ws-6 relative flex items-center',
          check.log && 'hover:bg-ws-dynamic-secondary-alpha-hover',
        )}
      >
        <Icon aria-hidden="true" className={cn('size-ws-11 shrink-0', colour)} />
        <div className="flex min-w-0 flex-1 flex-col">
          {check.log ? (
            <button
              ref={toggle}
              type="button"
              aria-expanded={open}
              aria-controls={detailId}
              onClick={() => setOpen(!open)}
              className="typography-label-strong-sm text-ws-static-strong focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default after:inset-ws-0 w-fit cursor-pointer text-left after:absolute"
            >
              {check.name}
            </button>
          ) : (
            <span className="typography-label-strong-sm text-ws-static-strong">{check.name}</span>
          )}
          {/* Folded, the row says what failed; open, the log under it does. */}
          {check.reason && !open && (
            <span className="typography-caption-md text-ws-static-subtle text-pretty">
              {check.reason}
            </span>
          )}
        </div>
        <span className="typography-label-sm text-ws-static-subtle shrink-0 tabular-nums">
          <span className="sr-only">{spoken} </span>
          {formatDuration(check.seconds)}
        </span>
        {/* Rows that do not open keep the chevron's room, so the times stand in one column. */}
        <span className="size-ws-9 shrink-0">
          {check.log && (
            <RiArrowRightSLine
              aria-hidden="true"
              className={cn(
                'size-ws-9 text-ws-dynamic-secondary-default transition-transform duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-smooth-out)',
                open && 'rotate-90',
              )}
            />
          )}
        </span>
      </div>

      {check.log && open && (
        <div id={detailId}>
          <LogExcerpt lines={check.log} />
          <div className="gap-ws-5 px-ws-11 py-ws-5 flex flex-wrap items-center">
            {sent ? (
              <p
                role="status"
                className="typography-label-strong-sm text-ws-static-subtle gap-ws-3 h-ws-forms-sm flex items-center"
              >
                <RiCheckLine aria-hidden="true" className="size-ws-9" />
                Added to your message
              </p>
            ) : (
              <Button preset="border" size="sm" onClick={send}>
                Fix with Tandem
              </Button>
            )}
            {check.logHref && (
              <Button asChild variant="secondary" preset="ghost" size="sm">
                <a href={check.logHref} target="_blank" rel="noreferrer">
                  View full log
                </a>
              </Button>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

/**
 * The pull request's checks in a card: the failing one first and open, since it is the one that
 * asks for something, then the rest in the order they ran. Rows run edge to edge, split by
 * lines, their text in line with the card's title.
 */
export function CheckList({ onFix }: { onFix?: (text: string) => void }) {
  const titleId = useId();

  return (
    <Card role="region" aria-labelledby={titleId}>
      <Card.Header>
        <h3 id={titleId} className="typography-label-strong-md text-ws-static-strong">
          Checks
        </h3>
      </Card.Header>
      <ul>
        {CHECKS.map((check) => (
          <CheckRow key={check.id} check={check} onFix={onFix} />
        ))}
      </ul>
    </Card>
  );
}
