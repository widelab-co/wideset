// One locale and currency for the whole screen; swap them for the workspace's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, { style: 'currency', currency: 'USD' });
// Dates are calendar days (`2026-11-10`), parsed as UTC midnight: format them in UTC too.
const date = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const day = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short', timeZone: 'UTC' });
const plural = new Intl.PluralRules(LOCALE);

export const formatUsd = (value: number) => usd.format(value);
export const formatDate = (iso: string) => date.format(new Date(iso));
/** A day without its year, where the year is plain from the page: `Dec 1`. */
export const formatDay = (iso: string) => day.format(new Date(iso));
/** `1 team`, `3 teams`. */
export const formatTeams = (count: number) =>
  `${count} ${plural.select(count) === 'one' ? 'team' : 'teams'}`;
