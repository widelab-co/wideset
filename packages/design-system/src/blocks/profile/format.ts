import { NOW } from './data';

// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const share = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 0 });
const ordinal = new Intl.PluralRules(LOCALE, { type: 'ordinal' });
const SUFFIX: Partial<Record<Intl.LDMLPluralRule, string>> = { one: 'st', two: 'nd', few: 'rd' };
// Days are calendar days (`2026-11-27`), parsed as UTC midnight: format them in UTC too.
const day = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});
const dayThisYear = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
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

export const formatUsd = (value: number) => usd.format(value);
/** A share of a whole, in whole percent: `91%`. */
export const formatShare = (value: number) => share.format(value);
/** `1st`, `2nd`, `3rd`, `4th`. */
export const formatOrdinal = (value: number) => `${value}${SUFFIX[ordinal.select(value)] ?? 'th'}`;
/** A day, with its year only when it is not this year's: `Nov 27`, `Jan 22, 2027`. */
export const formatDay = (iso: string) =>
  (iso.slice(0, 4) === NOW.slice(0, 4) ? dayThisYear : day).format(new Date(iso));
/** The full date and time, for the `title` of a relative time. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));
/** The time of day where someone is: `3:00 PM`. */
export const formatLocalTime = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat(LOCALE, { timeStyle: 'short', timeZone }).format(new Date(iso));

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
