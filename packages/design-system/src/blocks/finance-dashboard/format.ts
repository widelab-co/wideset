// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const count = new Intl.NumberFormat(LOCALE);
const usd = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'USD' });
const usdWhole = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const percent = new Intl.NumberFormat(LOCALE, { style: 'percent', minimumFractionDigits: 2 });
// Dates are calendar days (`2025-02-12`), parsed as UTC midnight: format them in UTC too.
const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const dayPadded = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  timeZone: 'UTC',
});
const isoDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC' });

export const formatCount = (value: number) => count.format(value);
export const formatUsd = (value: number) => usd.format(value);
export const formatUsdWhole = (value: number) => usdWhole.format(value);
/** Unsigned: the arrow beside it carries the direction. */
export const formatChange = (value: number) => percent.format(Math.abs(value));
export const formatDay = (iso: string) => day.format(new Date(iso));
export const formatDayPadded = (iso: string) => dayPadded.format(new Date(iso));
export const formatDate = (iso: string) => isoDate.format(new Date(iso));
