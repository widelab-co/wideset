import { NOW } from './data';

// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';
const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

const time = new Intl.DateTimeFormat(LOCALE, { timeStyle: 'short', timeZone: 'UTC' });
const day = new Intl.DateTimeFormat(LOCALE, { month: 'short', day: 'numeric', timeZone: 'UTC' });
const clock = new Intl.DateTimeFormat(LOCALE, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3,
  hourCycle: 'h23',
  timeZone: 'UTC',
});
const ago = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });

const daysAgo = (iso: string) =>
  Math.round((Date.parse(NOW.slice(0, 10)) - Date.parse(iso.slice(0, 10))) / DAY);

/** "Today, 10:12 AM", "Yesterday, 4:40 PM", "Nov 6, 11:05 AM": when a version was saved. */
export const formatSavedAt = (iso: string) => {
  const days = daysAgo(iso);
  const at = time.format(new Date(iso));
  if (days === 0) return `Today, ${at}`;
  if (days === 1) return `Yesterday, ${at}`;
  return `${day.format(new Date(iso))}, ${at}`;
};

/** "today at 10:12 AM", "yesterday at 4:40 PM", "on Nov 6 at 11:05 AM": the same, in a sentence. */
export const formatWhen = (iso: string) => {
  const days = daysAgo(iso);
  const at = time.format(new Date(iso));
  if (days === 0) return `today at ${at}`;
  if (days === 1) return `yesterday at ${at}`;
  return `on ${day.format(new Date(iso))} at ${at}`;
};

/** "Saved just now", "Saved 2 minutes ago": the header's save state. */
export const formatSaved = (iso: string) => {
  const minutes = Math.round((Date.parse(NOW) - Date.parse(iso)) / MINUTE);
  return minutes < 1 ? 'Saved just now' : `Saved ${ago.format(-minutes, 'minute')}`;
};

/** 10:14:06.204: a log line's moment, to the millisecond. */
export const formatClock = (date: Date) => clock.format(date);
