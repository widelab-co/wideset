import { cn } from '@wideset/react';

import type { CalendarEvent, EventColor } from './data';

const DAY = 86_400_000;
const isoDay = (time: number) => new Date(time).toISOString().slice(0, 10);
const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(to) - Date.parse(from)) / DAY);

/** The weeks, Monday first, that cover a month (0-based), as ISO dates. */
export function monthWeeks(year: number, month: number): string[][] {
  const first = Date.UTC(year, month, 1);
  const start = first - ((new Date(first).getUTCDay() + 6) % 7) * DAY;
  const last = Date.UTC(year, month + 1, 0);
  const weeks: string[][] = [];
  for (let monday = start; monday <= last; monday += 7 * DAY) {
    weeks.push(Array.from({ length: 7 }, (_, day) => isoDay(monday + day * DAY)));
  }
  return weeks;
}

const weekday = new Intl.DateTimeFormat('en', { weekday: 'long', timeZone: 'UTC' });
const fullDate = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

/** Five weekdays and a narrower weekend, as in Figma (184px and 120px at 1440). */
const COLUMNS = 'grid grid-cols-[repeat(5,minmax(0,1fr))_repeat(2,7.5rem)]';
const COL_START = [
  'col-start-1',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];
const COL_SPAN = [
  'col-span-1',
  'col-span-2',
  'col-span-3',
  'col-span-4',
  'col-span-5',
  'col-span-6',
  'col-span-7',
];

const TONE: Record<EventColor, string> = {
  purple: 'bg-ws-non-semantic-purple-subtle text-ws-non-semantic-purple-on-subtle',
  cyan: 'bg-ws-non-semantic-cyan-subtle text-ws-non-semantic-cyan-on-subtle',
  teal: 'bg-ws-non-semantic-teal-subtle text-ws-non-semantic-teal-on-subtle',
  green: 'bg-ws-non-semantic-green-subtle text-ws-non-semantic-green-on-subtle',
};

const STRIPES = Array.from({ length: 24 }, (_, index) => index);

/** Time blocked off: Figma's hatched "Shift", 8px stripes at 45°. */
function Busy({ title, className }: { title: string; className?: string }) {
  return (
    <div
      className={cn(
        'bg-ws-static-alpha-subtle rounded-ws-control-sm px-ws-5 py-ws-4 h-ws-18 relative overflow-hidden',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="gap-ws-4 absolute top-1/2 left-1/2 flex h-[24rem] -translate-x-1/2 -translate-y-1/2 rotate-45"
      >
        {STRIPES.map((stripe) => (
          <span key={stripe} className="w-ws-5 bg-ws-static-alpha-subtle" />
        ))}
      </span>
      <span className="typography-label-strong-sm text-ws-static-subtle relative block truncate">
        {title}
      </span>
    </div>
  );
}

function Event({ event, className }: { event: CalendarEvent; className: string }) {
  if (event.color === 'busy') return <Busy title={event.title} className={className} />;
  return (
    <div
      className={cn(
        'rounded-l-ws-control-md rounded-r-ws-container-sm gap-ws-3 px-ws-5 py-ws-4 flex min-w-0 flex-col',
        TONE[event.color],
        className,
      )}
    >
      <span className="typography-body-strong-sm truncate">{event.title}</span>
      {event.time && <span className="typography-body-sm truncate">{event.time}</span>}
    </div>
  );
}

type MonthGridProps = {
  weeks: string[][];
  events: CalendarEvent[];
  today: string;
  selected: string;
  onSelect: (day: string) => void;
};

/**
 * A month: one row per week, a cell per day (selectable), events laid over the cells. An event
 * spans its days; the grid stacks events that share a day into rows by itself.
 */
export function MonthGrid({ weeks, events, today, selected, onSelect }: MonthGridProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {weeks.map((days, row) => {
        const placed = events.flatMap((event) => {
          const from = Math.max(0, daysBetween(days[0], event.start));
          const to = Math.min(6, daysBetween(days[0], event.end ?? event.start));
          return from <= to ? [{ event, from, to }] : [];
        });
        return (
          <div key={days[0]} className="relative min-h-0 flex-1 overflow-hidden">
            <div className={cn(COLUMNS, 'h-full')}>
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  aria-pressed={day === selected}
                  aria-label={fullDate.format(Date.parse(day))}
                  onClick={() => onSelect(day)}
                  className="border-ws-static-subtle p-ws-4 hover:bg-ws-static-alpha-subtle aria-pressed:bg-ws-static-alpha-subtle focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex flex-col items-end justify-between border-r border-b focus-visible:-outline-offset-2"
                >
                  <span className="typography-label-strong-sm text-ws-static-strong px-ws-2 pt-ws-2 self-start">
                    {row === 0 ? weekday.format(Date.parse(day)) : null}
                  </span>
                  <span
                    className={cn(
                      'typography-label-sm min-w-ws-11 h-ws-11 flex items-center justify-end',
                      day === today
                        ? 'bg-ws-dynamic-secondary-default text-ws-dynamic-on-secondary-default rounded-ws-container-sm justify-center'
                        : 'text-ws-static-subtle',
                    )}
                  >
                    {Number(day.slice(8))}
                  </span>
                </button>
              ))}
            </div>
            <div
              className={cn(
                COLUMNS,
                'gap-y-ws-3 inset-x-ws-0 pointer-events-none absolute grid-flow-row-dense items-start',
                row === 0 ? 'top-ws-14' : 'top-ws-4',
              )}
            >
              {placed.map(({ event, from, to }) => (
                <Event
                  key={event.id}
                  event={event}
                  className={cn('mx-ws-4', COL_START[from], COL_SPAN[to - from])}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
