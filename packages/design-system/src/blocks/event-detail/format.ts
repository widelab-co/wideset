// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

/** The event's own time zone: times read as they will on the day, in London. */
const ZONE = 'Europe/London';

const longDate = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'full', timeZone: ZONE });
const time = new Intl.DateTimeFormat(LOCALE, {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: ZONE,
});
const zoned = new Intl.DateTimeFormat(LOCALE, {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: ZONE,
  timeZoneName: 'short',
});
const month = new Intl.DateTimeFormat(LOCALE, { month: 'short', timeZone: ZONE });
const day = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', timeZone: ZONE });
const weekday = new Intl.DateTimeFormat(LOCALE, { weekday: 'short', timeZone: ZONE });
// Calendar days (`2026-11-26`) are UTC midnight: format them in UTC.
const shortDate = new Intl.DateTimeFormat(LOCALE, {
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

/** Thursday, December 3, 2026. */
export const formatLongDate = (iso: string) => longDate.format(new Date(iso));
/** 2:20 PM. */
export const formatTime = (iso: string) => time.format(new Date(iso));
/** 1:30 – 5:30 PM GMT. */
export const formatTimeRange = (from: string, to: string) =>
  zoned.formatRange(new Date(from), new Date(to));
/** The date leaf: Dec, 3, Thu. */
export const formatLeaf = (iso: string) => ({
  month: month.format(new Date(iso)),
  day: day.format(new Date(iso)),
  weekday: weekday.format(new Date(iso)),
});
/** November 26. */
export const formatShortDate = (iso: string) => shortDate.format(new Date(iso));
