// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const count = new Intl.NumberFormat(LOCALE);
// Dates are calendar days (`2026-11-10`), parsed as UTC midnight: format them in UTC too.
const date = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** 1284 → 1,284. */
export const formatCount = (value: number) => count.format(value);
/** Nov 10, 2026. */
export const formatDate = (iso: string) => date.format(new Date(iso));
/** 1 customer, 243 customers. */
export const customers = (value: number) =>
  `${formatCount(value)} ${value === 1 ? 'customer' : 'customers'}`;
