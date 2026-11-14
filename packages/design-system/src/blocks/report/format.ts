import { isoOf } from './data';

// One locale and currency for the whole screen; swap them for the workspace's.
const LOCALE = 'en-US';
const CURRENCY = 'USD';

const usd = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
});
const usdSigned = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0,
  signDisplay: 'exceptZero',
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
const percentSigned = new Intl.NumberFormat(LOCALE, {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
});
const share = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 0 });
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
/** A movement with its sign: `+$11,640`, `-$2,310`. */
export const formatUsdSigned = (value: number) => usdSigned.format(value);
export const formatUsdCompact = (value: number) => usdCompact.format(value);
export const formatCount = (value: number) => count.format(value);
/** A change, unsigned: an arrow or the column says which way. */
export const formatPercent = (value: number) => percent.format(Math.abs(value));
export const formatPercentSigned = (value: number) => percentSigned.format(value);
export const formatShare = (value: number) => share.format(value);
export const formatDay = (dayNumber: number) => day.format(dateOf(dayNumber));
export const formatMonth = (dayNumber: number) => month.format(dateOf(dayNumber));
/** `Jan 1 – Nov 10, 2026`, or one day: `Nov 10, 2026`. */
export const formatRange = (from: number, to: number) =>
  from === to ? fullDay.format(dateOf(from)) : fullDay.formatRange(dateOf(from), dateOf(to));
