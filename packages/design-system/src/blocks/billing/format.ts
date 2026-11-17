// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'USD' });
const usdWhole = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const count = new Intl.NumberFormat(LOCALE);
const compact = new Intl.NumberFormat(LOCALE, { notation: 'compact', maximumFractionDigits: 1 });
const decimal = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });
// Dates are calendar days (`2026-11-01`), parsed as UTC midnight: format them in UTC too.
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
const monthYear = new Intl.DateTimeFormat(LOCALE, {
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatUsd = (value: number) => usd.format(value);
export const formatUsdWhole = (value: number) => usdWhole.format(value);
export const formatCount = (value: number) => count.format(value);
/** 612,400 → 612.4K: for limits too long to read at a glance. */
export const formatCompact = (value: number) => compact.format(value);
export const formatGb = (value: number) =>
  value >= 1_000 ? `${decimal.format(value / 1_000)} TB` : `${decimal.format(value)} GB`;
export const formatDate = (iso: string) => date.format(new Date(iso));
export const formatDayMonth = (iso: string) => dayMonth.format(new Date(iso));
/** A card's expiry, `2026-12` → 12/2026. */
export const formatExpiry = (yearMonth: string) => monthYear.format(new Date(`${yearMonth}-01`));
/** 1–30 Nov 2026. */
export const formatPeriod = (from: string, to: string) =>
  date.formatRange(new Date(from), new Date(to));
