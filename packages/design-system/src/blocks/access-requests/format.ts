import { NOW } from './data';

const DAY = 24 * 60 * 60 * 1000;
const relative = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const dateTime = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' });

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const startOfDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

/** "Just now", "2 hours ago", "Yesterday", "4 days ago"; a week or more back, the date. */
export function formatRelative(iso: string) {
  const then = new Date(iso);
  const days = Math.round((startOfDay(NOW) - startOfDay(then)) / DAY);
  if (days >= 7) return date.format(then);
  if (days > 0) return capitalise(relative.format(-days, 'day'));
  const minutes = Math.round((NOW.getTime() - then.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return capitalise(relative.format(-minutes, 'minute'));
  return capitalise(relative.format(-Math.round(minutes / 60), 'hour'));
}

/** The exact moment, for the `title` beside a relative date. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));

/** Whether an invitation sent at `iso` still works: its link lasts 7 days. */
export const isExpired = (iso: string) => new Date(iso).getTime() + 7 * DAY <= NOW.getTime();
