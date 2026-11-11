// TODO(custom): tracking timeline (mark, event, time, text, the current step filled); no Timeline in Wideset.
import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiBox3Line,
  RiBuilding2Line,
  RiTruckLine,
} from '@remixicon/react';
import { cn } from '@wideset/react';

import type { TrackingEvent, TrackingKind } from './data';
import { formatDateTime } from './format';

const ICON: Record<TrackingKind, RemixiconComponentType> = {
  confirmed: RiBankCardLine,
  shipped: RiBox3Line,
  depot: RiBuilding2Line,
  'out-for-delivery': RiTruckLine,
};

/**
 * The order's way to the door, newest first, on one line of marks: the event and when, then
 * where it happened. The first event is where the parcels are now: its mark is filled the way
 * the library fills an active step, the earlier ones stay outlined.
 */
export function TrackingTimeline({ events }: { events: TrackingEvent[] }) {
  return (
    <ol className="flex flex-col">
      {events.map((event, index) => {
        const Icon = ICON[event.kind];
        const current = index === 0;
        const last = index === events.length - 1;
        return (
          <li
            key={event.id}
            aria-current={current ? 'step' : undefined}
            className="gap-ws-7 relative flex"
          >
            {last ? null : (
              <span
                aria-hidden="true"
                className="border-ws-static-base top-ws-15 bottom-ws-3 left-ws-9 absolute border-l"
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                'size-ws-14 rounded-ws-control-full flex shrink-0 items-center justify-center',
                current
                  ? 'bg-ws-dynamic-primary-alpha-strong-default text-ws-dynamic-primary-default'
                  : 'border-ws-static-base text-ws-static-subtle border',
              )}
            >
              <Icon className="size-ws-8" />
            </span>
            <div className={cn('min-w-0 flex-1', !last && 'pb-ws-11')}>
              <div className="gap-ws-9 pt-ws-4 flex items-baseline justify-between">
                <p
                  className={cn(
                    'typography-label-strong-sm',
                    current ? 'text-ws-static-strong' : 'text-ws-static-base',
                  )}
                >
                  {event.title}
                </p>
                <time
                  dateTime={event.at}
                  className="typography-caption-md text-ws-static-subtle shrink-0 tabular-nums"
                >
                  {formatDateTime(event.at)}
                </time>
              </div>
              <p className="typography-body-md text-ws-static-subtle">{event.text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
