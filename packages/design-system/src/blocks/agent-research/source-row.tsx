// TODO(custom): one source in the sources list (its number, title, site and date, what was taken from it, where it is cited); ListItem has no room for four lines and is not a link.
import { RiArrowRightUpLine } from '@remixicon/react';
import { cn } from '@wideset/react';
import { useEffect, useRef } from 'react';

import { Citation } from './citation';
import { ARRIVE } from './motion';
import type { Source } from './research-data';
import { formatDate } from './research-format';
import { StepMark } from './step-mark';

type SourceRowProps = {
  source: Source;
  /** It is being read right now: a spinner stands where its number will be, and it says no more yet. */
  reading: boolean;
  /** Where the report cites it, in words; empty until it does. */
  cited: string;
  /** It is the source in focus: one of its citations, or the row itself, is pointed at. */
  active: boolean;
  /** A citation was pressed: the row stays lit and comes into view. */
  pinned: boolean;
  /** The run is in progress: the row arrives with the transcript's short rise. */
  live: boolean;
  onPeek: (source: number | null) => void;
};

/**
 * A source, as one link across the whole row that opens the page. It leads with the number the
 * report cites it by, in the same square as the citation marks, then says what the page is, whose
 * it is and how old, what the report took from it, and where the report cites it. Resting on the
 * row lights its marks in the report; a mark that is pressed lights the row and scrolls it into
 * view.
 */
export function SourceRow({
  source,
  reading,
  cited,
  active,
  pinned,
  live,
  onPeek,
}: SourceRowProps) {
  const row = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // `scrollIntoView` is missing where there is no layout (a test).
    if (pinned) row.current?.scrollIntoView?.({ block: 'nearest' });
  }, [pinned]);

  return (
    <li className={cn('border-ws-static-subtle border-b', live && ARRIVE)}>
      <a
        ref={row}
        href={`https://${source.site}${source.path}`}
        target="_blank"
        rel="noreferrer"
        aria-current={pinned || undefined}
        onPointerEnter={() => onPeek(source.id)}
        onPointerLeave={() => onPeek(null)}
        onFocus={() => onPeek(source.id)}
        onBlur={() => onPeek(null)}
        className={cn(
          'gap-ws-7 px-ws-11 py-ws-7 focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex items-start transition-[background-color] duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-out) focus-visible:-outline-offset-2',
          active && 'bg-ws-static-alpha-subtle',
        )}
      >
        <span className="h-ws-11 w-ws-11 flex shrink-0 items-center justify-center">
          {reading ? (
            <StepMark status="running" />
          ) : (
            <Citation source={source.id} active={active} />
          )}
        </span>
        <span className="gap-ws-2 flex min-w-0 flex-1 flex-col">
          <span className="typography-label-strong-sm text-ws-static-strong">{source.title}</span>
          <span className="typography-caption-md text-ws-static-subtle">
            {source.site} · {formatDate(source.published)}
          </span>
          {!reading && (
            <span className="typography-body-md text-ws-static-base mt-ws-2">{source.taken}</span>
          )}
          {cited && (
            <span className="typography-caption-md text-ws-static-subtle">Cited in {cited}</span>
          )}
        </span>
        <RiArrowRightUpLine
          aria-hidden
          className="size-ws-9 text-ws-static-subtle mt-ws-2 shrink-0"
        />
      </a>
    </li>
  );
}
