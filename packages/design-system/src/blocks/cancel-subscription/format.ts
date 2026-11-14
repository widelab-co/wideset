// One locale and currency for the whole screen; swap them for the workspace's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'USD' });
// Dates are calendar days (`2026-11-30`), parsed as UTC midnight: format them in UTC too.
const date = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const month = new Intl.DateTimeFormat(LOCALE, { month: 'long', timeZone: 'UTC' });

export const formatUsd = (value: number) => usd.format(value);
export const formatDate = (iso: string) => date.format(new Date(iso));
/** The month a day falls in: `December`. */
export const formatMonth = (iso: string) => month.format(new Date(iso));
