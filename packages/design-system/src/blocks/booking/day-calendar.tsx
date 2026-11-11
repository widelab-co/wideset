// TODO(custom): Calendar has no "available" day state; the days with free time are drawn in the strong text colour through `modifiersClassNames`.
import { Calendar } from '@wideset/react';

import { slotsFor } from './data';
import { fromDay, toDay } from './format';

type DayCalendarProps = {
  day: string;
  onDayChange: (day: string) => void;
  month: Date;
  onMonthChange: (month: Date) => void;
  /** The meeting's length: a day is open when it has room for it. */
  minutes: number;
  /** The sample's today: earlier days are closed. */
  today: Date;
};

/**
 * The second part: a month calendar. Days with room for the meeting are open and drawn strong;
 * past days and days without free time are closed (the calendar fades them and the keyboard skips
 * them). The chosen day is the calendar's one brand-coloured day.
 */
export function DayCalendar({
  day,
  onDayChange,
  month,
  onMonthChange,
  minutes,
  today,
}: DayCalendarProps) {
  const closed = (date: Date) => date < today || slotsFor(toDay(date), minutes).length === 0;

  return (
    <Calendar
      mode="single"
      required
      selected={fromDay(day)}
      onSelect={(date) => onDayChange(toDay(date))}
      month={month}
      onMonthChange={onMonthChange}
      today={today}
      weekStartsOn={1}
      disabled={closed}
      modifiers={{ open: (date: Date) => !closed(date) }}
      modifiersClassNames={{ open: '[&>button]:text-ws-static-strong' }}
      footer={`Only days with ${minutes} free minutes are open.`}
    />
  );
}
