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
const monthYear = new Intl.DateTimeFormat(LOCALE, {
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Money is kept in whole cents: 276000 → $2,760.00. */
export const formatUsd = (cents: number) => usd.format(cents / 100);
export const formatPercent = (rate: number) => percent.format(rate);
export const formatDate = (iso: string) => date.format(new Date(iso));
/** Nov 10 – 30, 2026. */
export const formatPeriod = (from: string, to: string) =>
  date.formatRange(new Date(from), new Date(to));
/** A card's expiry, `2026-12` → 12/2026. */
export const formatExpiry = (yearMonth: string) => monthYear.format(new Date(`${yearMonth}-01`));
