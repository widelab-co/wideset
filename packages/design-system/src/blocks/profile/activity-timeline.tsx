// TODO(custom): activity timeline; no Timeline in Wideset.
import {
  type RemixiconComponentType,
  RiArrowRightLine,
  RiHandCoinLine,
  RiMailLine,
  RiPhoneLine,
  RiStickyNoteLine,
} from '@remixicon/react';

import { type Activity, type ActivityKind, NOW } from './data';
import { formatAgo, formatDateTime } from './format';

const ICON: Record<ActivityKind, RemixiconComponentType> = {
  stage: RiArrowRightLine,
  call: RiPhoneLine,
  email: RiMailLine,
  note: RiStickyNoteLine,
  deal: RiHandCoinLine,
};

/**
 * The customer record's timeline, on a person's page: what they did, newest first, on one line of
 * marks. Every event is theirs, so the line starts with the verb instead of their name; each mark
 * says what kind of event it was, and what was said or changed reads under the line.
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
            <div className={last ? 'min-w-0 flex-1' : 'pb-ws-12 min-w-0 flex-1'}>
              <div className="gap-ws-9 pt-ws-4 flex items-baseline justify-between">
                <p className="typography-body-md text-ws-static-subtle min-w-0">
                  {item.action}
                  {item.subject ? (
                    <>
                      {' '}
                      <span className="text-ws-static-strong font-ws-medium">{item.subject}</span>
                    </>
                  ) : null}
                </p>
                <time
                  dateTime={item.at}
                  title={formatDateTime(item.at)}
                  className="typography-caption-md text-ws-static-subtle shrink-0 tabular-nums"
                >
                  {formatAgo(item.at, NOW)}
                </time>
              </div>
              {item.detail ? (
                <p className="mt-ws-3 typography-body-md text-ws-static-base max-w-[40rem]">
                  {item.detail}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
