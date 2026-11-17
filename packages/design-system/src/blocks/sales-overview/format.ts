// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const count = new Intl.NumberFormat(LOCALE);
const usd = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const usdCompact = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
});
const percent = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 0 });
// Dates are calendar days (`2026-12-14`), parsed as UTC midnight: format them in UTC too.
const day = new Intl.DateTimeFormat(LOCALE, { month: 'short', day: 'numeric', timeZone: 'UTC' });

export const formatCount = (value: number) => count.format(value);
export const formatUsd = (value: number) => usd.format(value);
/** `$500K`, `$1.2M`: for amounts beside a figure that already gives the exact one. */
export const formatUsdCompact = (value: number) => usdCompact.format(value);
export const formatPercent = (value: number) => percent.format(value);
export const formatDay = (iso: string) => day.format(new Date(iso));
/** Whole days from one calendar day to another. */
export const daysBetween = (from: string, to: string) =>
  Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000);
