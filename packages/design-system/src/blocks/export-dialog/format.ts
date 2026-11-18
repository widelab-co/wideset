// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const count = new Intl.NumberFormat(LOCALE);
const day = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeZone: 'UTC' });
const number = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });

/** `$486,000`: whole dollars, as ARR is read. */
export const formatUsd = (value: number) => usd.format(value);

/** `1,496`. */
export const formatCount = (value: number) => count.format(value);

/** "1 customer", "1,496 customers". */
export const formatCustomers = (value: number) =>
  value === 1 ? '1 customer' : `${formatCount(value)} customers`;

/** `Nov 10, 2026`, from yyyy-MM-dd. */
export const formatDay = (iso: string) => day.format(new Date(iso));

/** 86 KB, 1.4 MB: binary units, as file managers show them. */
export const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${number.format(bytes / 1024 / 1024)} MB`;
};
