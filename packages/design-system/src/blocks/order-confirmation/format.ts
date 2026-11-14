// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'USD' });
const percent = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 2 });
// Dates are calendar days (`2026-11-10`), parsed as UTC midnight: format them in UTC too.
const date = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const dayMonth = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});

export const formatUsd = (value: number) => usd.format(value);
export const formatPercent = (rate: number) => percent.format(rate);
/** Nov 10, 2026. */
export const formatDate = (iso: string) => date.format(new Date(iso));
/** Nov 10 – 30: a stretch inside one year, which the page already names. */
export const formatDays = (from: string, to: string) =>
  dayMonth.formatRange(new Date(from), new Date(to));
