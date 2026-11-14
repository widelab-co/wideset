// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'USD' });
const decimal = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const percent = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 2 });
// Dates are calendar days (`2026-11-05`) or UTC times: format them in UTC too.
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
const month = new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Money is kept in whole cents: 532080 → $5,320.80. */
export const formatUsd = (cents: number) => usd.format(cents / 100);
/** The same without the sign, for a field that shows `$` beside it: 532080 → 5,320.80. */
export const formatAmount = (cents: number) => decimal.format(cents / 100);
/** What was typed into such a field, in cents: `5,320.8` → 532080. Not a number: NaN. */
export const parseAmount = (text: string) =>
  text.trim() ? Math.round(Number(text.replace(/,/g, '')) * 100) : NaN;
export const formatPercent = (rate: number) => percent.format(rate);
/** Nov 5, 2026. */
export const formatDate = (iso: string) => date.format(new Date(iso));
/** Nov 5, 2026, 9:42 AM. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));
/** March 2025. */
export const formatMonth = (iso: string) => month.format(new Date(iso));
