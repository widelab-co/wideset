// TODO(custom): activity timeline; no Timeline in Wideset.
import {
  type RemixiconComponentType,
  RiEditLine,
  RiMailLine,
  RiPhoneLine,
  RiStickyNoteLine,
} from '@remixicon/react';

import type { Activity } from './data';
import { formatDateTime, formatTime } from './format';

const ICON: Record<Activity['kind'], RemixiconComponentType> = {
  call: RiPhoneLine,
  email: RiMailLine,
  note: RiStickyNoteLine,
  change: RiEditLine,
};

/**
 * What happened on the deal today, newest first, on one line of marks: who did what, then when.
 * A change applied from the assistant lands here like any other edit, with Maya as its author.
 */
export function ActivityTimeline({ items }: { items: Activity[] }) {
  return (
    <ol className="flex flex-col">
      {items.map((item, index) => {
        const Icon = ICON[item.kind];
        const last = index === items.length - 1;
        return (
          <li key={item.id} className="gap-ws-7 relative flex">
            {last ? null : (
              <span
                aria-hidden="true"
                className="border-ws-static-base top-ws-15 bottom-ws-3 left-ws-9 absolute border-l"
              />
            )}
            <span
              aria-hidden="true"
              className="size-ws-14 rounded-ws-control-full border-ws-static-base bg-ws-static-foreground text-ws-static-subtle flex shrink-0 items-center justify-center border"
            >
              <Icon className="size-ws-8" />
            </span>
            <div
              className={
                last
                  ? 'gap-ws-9 pt-ws-4 flex min-w-0 flex-1 items-baseline justify-between'
                  : 'gap-ws-9 pt-ws-4 pb-ws-11 flex min-w-0 flex-1 items-baseline justify-between'
              }
            >
              <p className="typography-body-md text-ws-static-subtle min-w-0">
                <span className="text-ws-static-strong font-ws-medium">{item.actor.name}</span>{' '}
                {item.action}
              </p>
              <time
                dateTime={item.at}
                title={formatDateTime(item.at)}
                className="typography-caption-md text-ws-static-subtle shrink-0 tabular-nums"
              >
                {formatTime(item.at)}
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
