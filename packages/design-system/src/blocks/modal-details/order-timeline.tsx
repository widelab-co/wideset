// TODO(custom): event timeline (dot, event, time, text, facts); no Timeline in Wideset.
import { cn } from '@wideset/react';

import type { OrderEvent } from './data';

/**
 * What happened to the order, newest first, on a line of dots: the event and when, what it meant,
 * and the facts that came with it.
 */
export function OrderTimeline({ events }: { events: OrderEvent[] }) {
  return (
    <ol className="flex flex-col">
      {events.map((event, index) => {
        const last = index === events.length - 1;
        return (
          <li key={event.id} className={cn('gap-ws-7 relative flex', !last && 'pb-ws-12')}>
            {/* Figma's dot (#c2c2c2, 11px down) is unbound: the nearest tokens stand in. */}
            <span aria-hidden="true" className="w-ws-13 pt-ws-6 flex shrink-0 justify-center">
              <span className="size-ws-4 rounded-ws-control-full bg-(--ws-semantic-stroke-neutral)" />
            </span>
            {/* The line stops 4px short of the dots at both ends. */}
            {last ? null : (
              <span
                aria-hidden="true"
                className="border-ws-static-base left-ws-8 top-ws-11 -bottom-ws-4 absolute border-l"
              />
            )}
            <div className="gap-ws-3 flex min-w-0 flex-1 flex-col">
              <div className="gap-ws-12 flex items-start justify-between">
                <p className="typography-label-strong-sm text-ws-static-base">{event.title}</p>
                <p className="typography-caption-md text-ws-static-subtle shrink-0">{event.at}</p>
              </div>
              <p className="typography-body-sm text-ws-static-subtle">{event.text}</p>
              {event.details ? (
                <dl className="mt-ws-7 gap-ws-2 text-ws-static-subtle flex flex-col">
                  {event.details.map((detail) => (
                    <div key={detail.label} className="typography-body-sm">
                      <dt className="font-ws-semibold inline">{detail.label}: </dt>
                      <dd className="inline">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
