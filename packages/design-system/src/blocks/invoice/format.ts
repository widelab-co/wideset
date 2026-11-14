// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'USD' });
const percent = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 2 });
// Dates are calendar days (`2026-10-01`), parsed as UTC midnight: format them in UTC too.
const date = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const dateTime = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});

export const formatUsd = (value: number) => usd.format(value);
export const formatPercent = (rate: number) => percent.format(rate);
export const formatDate = (iso: string) => date.format(new Date(iso));
/** Oct 1, 2026, 9:01 AM. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));
/** Oct 1 – 31, 2026. */
export const formatPeriod = (from: string, to: string) =>
  date.formatRange(new Date(from), new Date(to));
