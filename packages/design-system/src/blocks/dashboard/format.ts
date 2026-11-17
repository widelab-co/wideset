import { isoOf } from './data';

// One locale and currency for the whole screen; swap them for the workspace's.
const LOCALE = 'en-US';
const CURRENCY = 'USD';

const usd = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
});
const usdCompact = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  notation: 'compact',
  maximumFractionDigits: 1,
});
const count = new Intl.NumberFormat(LOCALE);
const percent = new Intl.NumberFormat(LOCALE, {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const share = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 0 });
const points = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
// Days are calendar days (`2026-11-10`), parsed as UTC midnight: format them in UTC too.
const day = new Intl.DateTimeFormat(LOCALE, { month: 'short', day: 'numeric', timeZone: 'UTC' });
const month = new Intl.DateTimeFormat(LOCALE, { month: 'short', timeZone: 'UTC' });
const fullDay = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

const dateOf = (dayNumber: number) => new Date(isoOf(dayNumber));

export const formatUsd = (value: number) => usd.format(value);
/** An axis value: `$250K`, `$1M`. */
export const formatUsdCompact = (value: number) => usdCompact.format(value);
export const formatCount = (value: number) => count.format(value);
/** A rate or a change, unsigned: an arrow says which way a change went. */
export const formatPercent = (value: number) => percent.format(Math.abs(value));
/** A share of a whole, in whole percent: `45%`. */
export const formatShare = (value: number) => share.format(value);
/** A change between two rates, in percentage points, unsigned: `3.6 pts`. */
export const formatPoints = (value: number) => `${points.format(Math.abs(value) * 100)} pts`;
export const formatDay = (dayNumber: number) => day.format(dateOf(dayNumber));
export const formatMonth = (dayNumber: number) => month.format(dateOf(dayNumber));
/** `Nov 1 – 10, 2026`, or one day: `Nov 10, 2026`. */
export const formatRange = (from: number, to: number) =>
  from === to ? fullDay.format(dateOf(from)) : fullDay.formatRange(dateOf(from), dateOf(to));
