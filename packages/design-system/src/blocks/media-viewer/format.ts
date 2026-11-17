import { NOW } from './data';

// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';
const DAY = 24 * 60 * 60 * 1000;

const time = new Intl.DateTimeFormat(LOCALE, { timeStyle: 'short', timeZone: 'UTC' });
const dayThisYear = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});
const dateTime = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});
const number = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });
const usd = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});
const percent = new Intl.NumberFormat(LOCALE, { style: 'percent' });

const daysAgo = (iso: string) =>
  Math.round((Date.parse(NOW.slice(0, 10)) - Date.parse(iso.slice(0, 10))) / DAY);

/** "Today, 9:12 AM", "Yesterday", "Nov 6": as near as it is. */
export const formatModified = (iso: string) => {
  const days = daysAgo(iso);
  if (days === 0) return `Today, ${time.format(new Date(iso))}`;
  if (days === 1) return 'Yesterday';
  return dayThisYear.format(new Date(iso));
};

/** Nov 10, 2026, 9:12 AM: the full moment. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));

/** "Just now", "Today, 9:40 AM": when a comment was posted. */
export const formatPosted = (iso: string) => (iso === NOW ? 'Just now' : formatModified(iso));

/** 2.4 MB, 410 KB: binary units, as file managers show them. */
export const formatSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${number.format(bytes / 1024 / 1024)} MB`;

/** A chart's value: $1.24M or $610K for money, 28% for a rate. */
export const formatChartValue = (value: number, unit: 'thousands' | 'percent') =>
  unit === 'percent' ? percent.format(value / 100) : usd.format(value * 1000);
