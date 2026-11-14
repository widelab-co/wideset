import { NOW } from './data';

// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';
const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

const time = new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit' });
const weekday = new Intl.DateTimeFormat(LOCALE, { weekday: 'long' });
const dateTime = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeStyle: 'short' });

const startOfDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
/** Whole calendar days between `iso` and now: 0 today, 1 yesterday. */
const daysAgo = (iso: string) => Math.round((startOfDay(NOW) - startOfDay(new Date(iso))) / DAY);

/** The list's day groups, newest first. Weeks start on Monday. */
export const GROUPS = ['Today', 'Yesterday', 'Earlier this week', 'Older'] as const;
export type Group = (typeof GROUPS)[number];

export function groupOf(iso: string): Group {
  const days = daysAgo(iso);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  const sinceMonday = (NOW.getDay() + 6) % 7;
  return days <= sinceMonday ? 'Earlier this week' : 'Older';
}

/** Compact age for a list row: "14m", "3h", "2d". The group heading carries the day. */
export function formatAge(iso: string) {
  const minutes = Math.max(1, Math.round((NOW.getTime() - new Date(iso).getTime()) / MINUTE));
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)}h`;
  return `${Math.max(1, daysAgo(iso))}d`;
}

/** When, in words: "Today at 4:06 PM", "Yesterday at 5:24 PM", "Monday at 4:52 PM". */
export function formatWhen(iso: string) {
  const days = daysAgo(iso);
  const day = days === 0 ? 'Today' : days === 1 ? 'Yesterday' : weekday.format(new Date(iso));
  return `${day} at ${time.format(new Date(iso))}`;
}

/** The exact moment, for the `title` beside a relative time. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));
