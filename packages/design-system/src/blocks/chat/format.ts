import { NOW } from './data';

// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';
const DAY = 24 * 60 * 60_000;

const time = new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit' });
const fullDay = new Intl.DateTimeFormat(LOCALE, { weekday: 'long', month: 'long', day: 'numeric' });
const dateTime = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeStyle: 'short' });

const startOfDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

/** The calendar day of a local date and time: what the thread is grouped by. */
export const dayOf = (iso: string) => iso.slice(0, 10);

/** The day over a group of messages: "Today", "Yesterday", "Friday, November 6". */
export function formatDay(iso: string) {
  const days = Math.round((startOfDay(new Date(NOW)) - startOfDay(new Date(iso))) / DAY);
  if (days === 0) return 'Today';
  return days === 1 ? 'Yesterday' : fullDay.format(new Date(iso));
}

/** When a message was sent: the day is on the line above it, so the time is enough. */
export const formatTime = (iso: string) => time.format(new Date(iso));

/** The exact moment, for the `title` beside a short time. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));
