// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-GB';

const euro = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});
const count = new Intl.NumberFormat(LOCALE);
const percent = new Intl.NumberFormat(LOCALE, { style: 'percent' });
// Days are calendar days (`2026-11-27`), parsed as UTC midnight: format them in UTC too.
const day = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const dayThisYear = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});
const dateTime = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});
const relative = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

export const formatEuro = (value: number) => euro.format(value);
export const formatCount = (value: number) => count.format(value);
export const formatPercent = (value: number) => percent.format(value);
export const formatDay = (iso: string) => day.format(new Date(iso));
/** The full date and time, for the `title` of a relative time. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));

/**
 * How long ago, the way a timeline reads it: hours today, days for the last few days
 * ("Yesterday", "3 days ago"), then the date (with the year once it is another year's).
 */
export function formatAgo(iso: string, now: string) {
  const days = (Date.parse(now.slice(0, 10)) - Date.parse(iso.slice(0, 10))) / DAY;
  const date = new Date(iso);
  const text =
    days === 0
      ? relative.format(-Math.max(1, Math.round((Date.parse(now) - date.getTime()) / HOUR)), 'hour')
      : days < 4
        ? relative.format(-days, 'day')
        : (date.getUTCFullYear() === new Date(now).getUTCFullYear() ? dayThisYear : day).format(
            date,
          );
  return text.charAt(0).toUpperCase() + text.slice(1);
}
