// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'USD' });
const decimal = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
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

/** Money is kept in whole cents: 425000 → $4,250.00. */
export const formatUsd = (cents: number) => usd.format(cents / 100);
/** The same without the sign, for a field that shows `$` beside it: 425000 → 4,250.00. */
export const formatAmount = (cents: number) => decimal.format(cents / 100);
export const formatPercent = (rate: number) => percent.format(rate);
export const formatDate = (iso: string) => date.format(new Date(iso));
export const formatDayMonth = (iso: string) => dayMonth.format(new Date(iso));
