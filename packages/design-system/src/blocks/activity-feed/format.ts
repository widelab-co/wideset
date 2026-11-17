import { NOW } from './data';

// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';
const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

const relative = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });
const day = new Intl.DateTimeFormat(LOCALE, { month: 'short', day: 'numeric' });
const dateTime = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeStyle: 'short' });

const startOfDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** How long ago, as a feed says it: "Just now", "35 minutes ago", "Yesterday", then "Nov 6". */
export function formatWhen(iso: string) {
  const then = new Date(iso);
  const minutes = Math.round((NOW.getTime() - then.getTime()) / MINUTE);
  const days = Math.round((startOfDay(NOW) - startOfDay(then)) / DAY);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return relative.format(-minutes, 'minute');
  if (days === 0) return relative.format(-Math.floor(minutes / 60), 'hour');
  if (days === 1) return capitalize(relative.format(-1, 'day'));
  return day.format(then);
}

/** The exact moment, for the `title` beside a relative time. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));
