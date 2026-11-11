// TODO(custom): page header with a date leaf and a row of facts with icons; no PageHeader or facts row in Wideset.
import {
  type RemixiconComponentType,
  RiMapPin2Line,
  RiTimeLine,
  RiUser3Line,
  RiUserLocationLine,
} from '@remixicon/react';
import type { ReactNode } from 'react';

import { event, hosts } from './data';
import { DateLeaf } from './date-leaf';
import { formatLongDate, formatTimeRange } from './format';
import { TextLink } from './text-link';

/** One fact in the row: a quiet icon that names what it is, then the fact. */
function Fact({ icon: Icon, children }: { icon: RemixiconComponentType; children: ReactNode }) {
  return (
    <li className="gap-ws-3 flex items-center">
      <Icon aria-hidden="true" className="size-ws-9 text-ws-static-subtle shrink-0" />
      <span>{children}</span>
    </li>
  );
}

/**
 * The event's header: the date leaf, the name and one line on what it is for, the actions on the
 * right with the answer to the invitation last, then the facts in a quiet row under the name
 * (when, where with a map, the format, who hosts).
 */
export function EventHeader({ actions }: { actions: ReactNode }) {
  return (
    <header className="gap-x-ws-9 gap-y-ws-7 grid grid-cols-[auto_minmax(0,1fr)] items-center lg:grid-cols-[auto_minmax(0,1fr)_auto]">
      <DateLeaf at={event.start} />
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">{event.name}</h1>
        <p className="typography-body-md text-ws-static-subtle">{event.summary}</p>
      </div>
      {/* Beside the name on a wide page, under the facts on a narrow one. */}
      <div className="gap-ws-5 col-[2/-1] row-start-3 flex flex-wrap items-center lg:col-[3/4] lg:row-start-1">
        {actions}
      </div>
      <ul
        aria-label="Event facts"
        className="gap-x-ws-11 gap-y-ws-3 typography-body-md text-ws-static-base col-[2/-1] flex flex-wrap items-center"
      >
        <Fact icon={RiTimeLine}>
          <time
            dateTime={event.start}
            className="text-ws-static-strong font-ws-medium tabular-nums"
          >
            {formatLongDate(event.start)}, {formatTimeRange(event.start, event.end)}
          </time>
        </Fact>
        <Fact icon={RiMapPin2Line}>
          {event.venue.address} ·{' '}
          <TextLink href={event.venue.map} target="_blank" rel="noreferrer">
            Map
          </TextLink>
        </Fact>
        <Fact icon={RiUserLocationLine}>{event.format}</Fact>
        <Fact icon={RiUser3Line}>Hosted by {hosts.map(({ name }) => name).join(' and ')}</Fact>
      </ul>
    </header>
  );
}
