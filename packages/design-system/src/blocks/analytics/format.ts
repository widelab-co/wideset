// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const count = new Intl.NumberFormat(LOCALE);
const compact = new Intl.NumberFormat(LOCALE, { notation: 'compact', maximumFractionDigits: 1 });
const percent = (decimals: number) =>
  new Intl.NumberFormat(LOCALE, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
const points = (decimals: number) =>
  new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
// Dates are calendar days (`2026-12-14`), parsed as UTC midnight: format them in UTC too.
const day = new Intl.DateTimeFormat(LOCALE, { month: 'short', day: 'numeric', timeZone: 'UTC' });
const dayAndYear = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatCount = (value: number) => count.format(value);
export const formatCompact = (value: number) => compact.format(value);
export const formatPercent = (value: number, decimals = 1) => percent(decimals).format(value);
/** A change between two rates, in percentage points, unsigned: an arrow carries the direction. */
export const formatPoints = (value: number, decimals = 1) =>
  `${points(decimals).format(Math.abs(value) * 100)} pts`;
export const formatDay = (iso: string) => day.format(new Date(iso));
export const formatRange = (from: string, to: string) =>
  dayAndYear.formatRange(new Date(from), new Date(to));
/** Seconds as m:ss. */
export const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
