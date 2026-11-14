import { NOW } from './data';

// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';
const DAY = 24 * 60 * 60_000;

const time = new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit' });
const day = new Intl.DateTimeFormat(LOCALE, { month: 'short', day: 'numeric' });
const dateTime = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeStyle: 'short' });

const startOfDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
/** Whole calendar days between `iso` and now: 0 today, 1 yesterday. */
const daysAgo = (iso: string) =>
  Math.round((startOfDay(new Date(NOW)) - startOfDay(new Date(iso))) / DAY);

/** When a conversation last moved, as short as a list row needs: "8:47 AM", "Yesterday", "Nov 6". */
export function formatListTime(iso: string) {
  const days = daysAgo(iso);
  if (days === 0) return time.format(new Date(iso));
  return days === 1 ? 'Yesterday' : day.format(new Date(iso));
}

/** When a message was sent: the time today, the day and the time before that. */
export function formatMessageTime(iso: string) {
  const at = new Date(iso);
  return daysAgo(iso) === 0 ? time.format(at) : `${day.format(at)}, ${time.format(at)}`;
}

/** The exact moment, for the `title` beside a short time. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));
