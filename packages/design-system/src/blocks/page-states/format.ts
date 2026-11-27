// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
// Dates are calendar days (`2026-12-15`), parsed as UTC midnight: format them in UTC too.
const date = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const time = new Intl.DateTimeFormat(LOCALE, { timeStyle: 'short' });

/** $222,000: deal values are whole dollars. */
export const formatUsd = (value: number) => usd.format(value);
/** Dec 15, 2026. */
export const formatDate = (iso: string) => date.format(new Date(iso));
/** 10:42 AM, from a local date and time (`2026-11-10T10:42:00`). */
export const formatTime = (iso: string) => time.format(new Date(iso));
