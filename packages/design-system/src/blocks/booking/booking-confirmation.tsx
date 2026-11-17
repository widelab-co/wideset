import { RiCheckLine } from '@remixicon/react';
import { Button, StatusBadge } from '@wideset/react';

import { AddToCalendarMenu, type CalendarEntry } from './add-to-calendar-menu';
import { BookingSummary, type Choice } from './booking-summary';

type BookingConfirmationProps = {
  /** "Renewal review booked". */
  title: string;
  /** Who the invitation went to, as a sentence. */
  sentence: string;
  facts: Choice[];
  entry: CalendarEntry;
  onBookAnother: () => void;
};

/**
 * The booking, done: a small mark in the positive colour (a judgement: it worked), what happened
 * in one line, the facts read back with the time in both zones, then the calendar and a way to book
 * the next one. No filled button: there is nothing left to finish.
 */
export function BookingConfirmation({
  title,
  sentence,
  facts,
  entry,
  onBookAnother,
}: BookingConfirmationProps) {
  return (
    <div className="gap-ws-12 flex flex-col">
      <div className="gap-ws-9 flex flex-col items-start">
        <StatusBadge
          color="positive"
          emphasis="high"
          size="lg"
          shape="rounded"
          role="img"
          aria-label="Booked"
        >
          <StatusBadge.Icon icon={RiCheckLine} />
        </StatusBadge>
        <div className="gap-ws-2 flex flex-col" role="status">
          <h2 className="typography-subtitle-xs text-ws-static-strong">{title}</h2>
          <p className="typography-body-md text-ws-static-subtle">{sentence}</p>
        </div>
      </div>
      <BookingSummary choices={facts} />
      <div className="gap-ws-5 flex flex-wrap items-center">
        <AddToCalendarMenu entry={entry} align="start" />
        <Button variant="secondary" preset="ghost" size="sm" onClick={onBookAnother}>
          Book another
        </Button>
      </div>
    </div>
  );
}
