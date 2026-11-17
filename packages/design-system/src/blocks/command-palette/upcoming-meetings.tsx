// TODO(custom): agenda list (a time column, then the meeting and who it is with); Wideset has no agenda or event row.
import { Card } from '@wideset/react';
import { useId } from 'react';

import type { Meeting } from './data';
import { formatDay, formatTime } from './format';

/**
 * The next few meetings, in a card beside the deals so the row reads as two containers drawn the
 * same way: when on the left, in one column so the times line up, then what the meeting is and
 * the customer it is with. Plain rows, nothing to click: the calendar owns them.
 */
export function UpcomingMeetings({ meetings, today }: { meetings: Meeting[]; today: string }) {
  const titleId = useId();

  return (
    <Card role="region" aria-labelledby={titleId}>
      <Card.Header>
        <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
          Coming up
        </h2>
      </Card.Header>
      {/* Card.Content keeps 10px free on its right for a scrollbar: the padding gives it back. */}
      <Card.Content contentClassName="pr-ws-6">
        <ul className="gap-ws-9 flex flex-col">
          {meetings.map((meeting) => (
            <li key={meeting.id} className="gap-ws-9 flex items-start">
              <time dateTime={meeting.start} className="flex w-[4.5rem] shrink-0 flex-col">
                <span className="typography-label-sm text-ws-static-strong tabular-nums">
                  {formatTime(meeting.start)}
                </span>
                <span className="typography-caption-md text-ws-static-subtle">
                  {formatDay(meeting.start, today)}
                </span>
              </time>
              <div className="flex min-w-0 flex-col">
                <span className="typography-label-strong-sm text-ws-static-strong truncate">
                  {meeting.title}
                </span>
                <span className="typography-caption-md text-ws-static-subtle truncate">
                  {meeting.customer} · {meeting.minutes} min
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Card.Content>
    </Card>
  );
}
