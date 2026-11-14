// TODO(custom): a list of time slots where the chosen one shows Confirm beside it; Wideset has no time-slot picker (TimePicker is a field for any time, not a list of free ones).
import { RiArrowRightLine } from '@remixicon/react';
import { Button, Select } from '@wideset/react';
import { useId } from 'react';

import { contact, timeZones } from './data';
import { formatDay, formatTime } from './format';

type TimeSlotsProps = {
  /** The chosen calendar day. */
  day: string;
  /** Its free start times, UTC instants. */
  slots: string[];
  /** Words for the meeting, for the empty state: "60 min workshop". */
  meeting: string;
  timeZone: string;
  onTimeZoneChange: (timeZone: string) => void;
  selected?: string;
  onSelect: (slot: string) => void;
  onConfirm: () => void;
  /** The next day with room for the meeting, when this one has none. */
  nextDay?: string;
  onShowDay: (day: string) => void;
};

/**
 * The third part: the chosen day's free times, read in the zone picked above them. Each time is
 * one button; the chosen one keeps the brand outline and gives half its row to Confirm, the
 * screen's one filled button. A day with no room for the meeting says so and offers the next day
 * that has.
 */
export function TimeSlots({
  day,
  slots,
  meeting,
  timeZone,
  onTimeZoneChange,
  selected,
  onSelect,
  onConfirm,
  nextDay,
  onShowDay,
}: TimeSlotsProps) {
  const titleId = useId();
  const firstName = contact.name.split(' ')[0];

  return (
    // The zone sits where the Meeting field does (6px under its title), and each time on the row of
    // a week in the calendar beside it (20 + 6 + 32 + 12).
    <div className="flex flex-col">
      <h3 id={titleId} className="typography-label-strong-md text-ws-static-strong">
        {formatDay(day)}
      </h3>
      <Select
        size="sm"
        className="mt-ws-4 w-full"
        aria-label="Time zone"
        options={timeZones}
        value={timeZone}
        onValueChange={onTimeZoneChange}
      />

      {slots.length > 0 ? (
        <ul aria-labelledby={titleId} className="mt-ws-7 gap-ws-5 flex flex-col">
          {slots.map((slot) =>
            slot === selected ? (
              <li key={slot} className="gap-ws-5 grid grid-cols-2">
                <Button
                  variant="primary"
                  preset="border"
                  size="sm"
                  aria-pressed="true"
                  className="w-full"
                >
                  {formatTime(slot, timeZone)}
                </Button>
                <Button size="sm" className="w-full" onClick={onConfirm}>
                  Confirm
                </Button>
              </li>
            ) : (
              <li key={slot}>
                <Button
                  variant="secondary"
                  preset="border"
                  size="sm"
                  aria-pressed="false"
                  className="w-full"
                  onClick={() => onSelect(slot)}
                >
                  {formatTime(slot, timeZone)}
                </Button>
              </li>
            ),
          )}
        </ul>
      ) : (
        <div className="mt-ws-9 gap-ws-7 flex flex-col items-start" role="status">
          <p className="typography-body-md text-ws-static-subtle">
            {firstName} has no free time for a {meeting} on this day.
            {nextDay ? ` Her next is ${formatDay(nextDay)}.` : ' Try a shorter meeting.'}
          </p>
          {nextDay ? (
            <Button
              variant="secondary"
              preset="border"
              size="sm"
              onClick={() => onShowDay(nextDay)}
            >
              {`Show ${formatDay(nextDay)}`}
              <Button.Icon icon={RiArrowRightLine} />
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
