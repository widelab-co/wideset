// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

// Days are calendar days (`2026-11-10`), parsed as UTC midnight: format them in UTC too.
const longDay = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});
const shortDay = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});
const fullDate = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long', timeZone: 'UTC' });
const monthDay = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});
// Times are local (`2026-11-10T11:30`, no zone): parsed and formatted in the reader's zone, so
// the clock on screen is the one in the data.
const time = new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit' });
const relative = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });

const DAY = 86_400_000;

/** November 6, 2026: the day an update shipped. */
export const formatDate = (iso: string) => fullDate.format(new Date(iso));
/** Oct 23: an earlier update's day, in a list of this year's. */
export const formatMonthDay = (iso: string) => monthDay.format(new Date(iso));
/** Tuesday, November 10. */
export const formatLongDay = (iso: string) => longDay.format(new Date(iso));
/** 11:30 AM. */
export const formatTime = (iso: string) => time.format(new Date(iso));

/** A day as the week reads it: `Today`, `Tomorrow`, then `Thu, Nov 12`. */
export function formatDay(iso: string, today: string) {
  const day = iso.slice(0, 10);
  const away = (Date.parse(day) - Date.parse(today)) / DAY;
  if (away < 0 || away > 1) return shortDay.format(new Date(day));
  const text = relative.format(away, 'day');
  return text.charAt(0).toUpperCase() + text.slice(1);
}
