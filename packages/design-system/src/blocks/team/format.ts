import { NOW } from './data';

const DAY = 24 * 60 * 60 * 1000;
const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const dateTime = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const startOfDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

/** "Just now", "12 minutes ago", "Yesterday", "4 days ago"; a week or more back, the date. */
export function formatRelative(iso: string) {
  const then = new Date(iso);
  const days = Math.round((startOfDay(NOW) - startOfDay(then)) / DAY);
  if (days >= 7) return date.format(then);
  if (days > 0) return capitalise(relative.format(-days, 'day'));
  const minutes = Math.round((NOW.getTime() - then.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return relative.format(-minutes, 'minute');
  return relative.format(-Math.round(minutes / 60), 'hour');
}

/** The exact moment, for the `title` beside a relative date. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));

/** Days until an invitation sent at `iso` expires (7 days later); 0 or less once it has. */
export const daysToExpiry = (iso: string) =>
  Math.round((new Date(iso).getTime() + 7 * DAY - NOW.getTime()) / DAY);

/** "Expires tomorrow", "Expires in 6 days". */
export const formatExpiry = (days: number) => `Expires ${relative.format(days, 'day')}`;
