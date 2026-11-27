// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const count = new Intl.NumberFormat(LOCALE);
// Close dates are calendar days (`2026-11-30`), parsed as UTC midnight: format them in UTC too.
const dayThisYear = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});
const day = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatUsd = (value: number) => usd.format(value);
export const formatCount = (value: number) => count.format(value);

/** "Nov 30", with the year only once it is another year than `today`'s. */
export const formatClose = (close: string, today: string) =>
  (close.slice(0, 4) === today.slice(0, 4) ? dayThisYear : day).format(new Date(close));
