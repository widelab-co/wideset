// One locale and currency for the whole screen; swap them for the user's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
// Days are calendar days (`2026-11-20`), parsed as UTC midnight: format them in UTC too.
const day = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeZone: 'UTC' });
const monthDay = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});
/** `Proposal or Negotiation`, `Proposal, Negotiation, or Commit`. */
const either = new Intl.ListFormat(LOCALE, { type: 'disjunction' });

/** $24,000: whole dollars, as deals are read. */
export const formatUsd = (value: number) => usd.format(value);
/** Nov 20, 2026. */
export const formatDate = (iso: string) => day.format(new Date(iso));
/** Nov 20: a day in a chip, where the year is this one or the next. */
export const formatMonthDay = (iso: string) => monthDay.format(new Date(iso));
export const formatEither = (items: string[]) => either.format(items);
