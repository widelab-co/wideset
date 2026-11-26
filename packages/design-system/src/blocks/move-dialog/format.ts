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
const day = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeZone: 'UTC' });
const dateTime = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});
const number = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 });

/** Whole calendar days between a date and today (UTC). */
export const daysAgo = (iso: string) =>
  Math.round((Date.parse(NOW.slice(0, 10)) - Date.parse(iso.slice(0, 10))) / DAY);

/** "Today, 9:41 AM", "Yesterday", "Nov 3", "Aug 12, 2025": as near as it is. */
export const formatModified = (iso: string) => {
  const days = daysAgo(iso);
  if (days === 0) return `Today, ${time.format(new Date(iso))}`;
  if (days === 1) return 'Yesterday';
  if (iso.slice(0, 4) === NOW.slice(0, 4)) return dayThisYear.format(new Date(iso));
  return day.format(new Date(iso));
};

/** Nov 10, 2026, 9:41 AM: the full moment, for a title attribute. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));

/** 312 MB, 1.4 MB, 86 KB: binary units, as file managers show them. */
export const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${number.format(bytes / 1024 / 1024)} MB`;
  return `${number.format(bytes / 1024 / 1024 / 1024)} GB`;
};

/** "1 file", "3 files". */
export const formatFiles = (count: number) => (count === 1 ? '1 file' : `${count} files`);
