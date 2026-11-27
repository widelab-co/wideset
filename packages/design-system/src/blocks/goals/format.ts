import { type Measure, MEASURES } from './data';

// One locale and currency for the whole screen; swap them for the workspace's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const count = new Intl.NumberFormat(LOCALE);
const share = new Intl.NumberFormat(LOCALE, { style: 'percent', maximumFractionDigits: 0 });
// Days are calendar days (`2026-11-10`), parsed as UTC midnight: format them in UTC too.
const day = new Intl.DateTimeFormat(LOCALE, { month: 'short', day: 'numeric', timeZone: 'UTC' });
const fullDay = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatUsd = (value: number) => usd.format(value);
export const formatCount = (value: number) => count.format(value);
/** A share of a whole, in whole percent: `91%`. */
export const formatShare = (value: number) => share.format(value);
/** `Dec 31`. */
export const formatDay = (iso: string) => day.format(new Date(iso));
/** `Oct 1 – Dec 31, 2026`. */
export const formatRange = (from: string, to: string) =>
  fullDay.formatRange(new Date(from), new Date(to));

/** A figure in the goal's own unit: `$199,600` for money, `25` for anything counted. */
export const formatMeasure = (measure: Measure, value: number) =>
  MEASURES[measure].money ? formatUsd(value) : formatCount(value);
