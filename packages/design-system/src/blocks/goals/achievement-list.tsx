// TODO(custom): milestone row (a neutral icon tile, what, who, when); Wideset has no award mark or activity row.
import type { RemixiconComponentType } from '@remixicon/react';

import { formatDay } from './format';

export type Milestone = {
  id: string;
  title: string;
  /** Who reached it; left out where the page is already one person's. */
  person?: string;
  /** The day it was reached. */
  date: string;
  icon: RemixiconComponentType;
};

/**
 * Milestones as a quiet list, not a wall of badges: a small neutral tile with a line icon for the
 * kind of milestone, what was reached, who reached it, and the day. The tile is the timeline's
 * mark at a square, so it reads as a record, not a prize.
 */
export function AchievementList({ items }: { items: Milestone[] }) {
  return (
    <ul className="gap-ws-9 flex flex-col">
      {items.map(({ id, title, person, date, icon: Icon }) => (
        <li key={id} className="gap-ws-7 flex items-center">
          <span
            aria-hidden="true"
            className="size-ws-14 rounded-ws-control-lg border-ws-static-base text-ws-static-subtle flex shrink-0 items-center justify-center border"
          >
            <Icon className="size-ws-8" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="typography-label-strong-sm text-ws-static-strong truncate">
              {title}
            </span>
            <span className="typography-caption-md text-ws-static-subtle truncate tabular-nums">
              {person ? `${person}, ` : ''}
              <time dateTime={date}>{formatDay(date)}</time>
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
