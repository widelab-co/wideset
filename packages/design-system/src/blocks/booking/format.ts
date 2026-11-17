// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

// Calendar days (`2026-11-13`) are UTC midnight: format them in UTC.
const day = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

/** Friday, November 13. */
export const formatDay = (iso: string) => day.format(new Date(iso));

// Times follow the zone the viewer picks, so their formatters are made per call.
/** 9:30 AM, in the given zone. */
export const formatTime = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit', timeZone }).format(
    new Date(iso),
  );

/** 9:30 – 10:15 AM, in the given zone; the caller names the zone by its city. */
export const formatTimeRange = (from: string, to: string, timeZone: string) =>
  new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit', timeZone }).formatRange(
    new Date(from),
    new Date(to),
  );

/** Friday, November 13, 2026, in the given zone. */
export const formatLongDate = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat(LOCALE, { dateStyle: 'full', timeZone }).format(new Date(iso));

/** A `Date` from the calendar (local midnight) as its calendar day: `2026-11-13`. */
export const toDay = (date: Date) =>
  [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part) => String(part).padStart(2, '0'))
    .join('-');

/** A calendar day as the local-midnight `Date` the calendar works with. */
export const fromDay = (iso: string) => {
  const [year, month, date] = iso.split('-').map(Number);
  return new Date(year, month - 1, date);
};
