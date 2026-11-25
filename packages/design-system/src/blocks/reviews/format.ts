// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

// Dates are calendar days (`2026-11-06`), parsed as UTC midnight: format them in UTC too.
const date = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const count = new Intl.NumberFormat(LOCALE);
const average = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const share = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 0 });

/** Nov 6, 2026. */
export const formatDate = (iso: string) => date.format(new Date(iso));
export const formatCount = (value: number) => count.format(value);
/** A rating to one decimal: 4.6. */
export const formatAverage = (value: number) => average.format(value);
/** A share of the whole: 72%. */
export const formatShare = (value: number) => share.format(value);
