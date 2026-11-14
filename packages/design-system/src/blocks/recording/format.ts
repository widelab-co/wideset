import { NOW } from './data';

// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';
const MINUTE = 60_000;

const relative = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });
const dateTime = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeStyle: 'short' });
const twoDigits = new Intl.NumberFormat(LOCALE, { minimumIntegerDigits: 2 });

/** A player's clock: "4:12", "26:24". */
export function formatClock(seconds: number) {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${twoDigits.format(whole % 60)}`;
}

/** The same moment read aloud, for a scrubber's `aria-valuetext`: "4 min 12 s". */
export function formatSpoken(seconds: number) {
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  return minutes ? `${minutes} min ${whole % 60} s` : `${whole % 60} s`;
}

/** A call's length in the header: "26 min". */
export const formatLength = (seconds: number) => `${Math.round(seconds / 60)} min`;

/** When the call took place: "Nov 10, 2026, 11:30 AM". */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));

/** How long ago a comment was left, the same day: "Just now", "35 minutes ago", "2 hours ago". */
export function formatWhen(iso: string) {
  const minutes = Math.round((NOW.getTime() - new Date(iso).getTime()) / MINUTE);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return relative.format(-minutes, 'minute');
  return relative.format(-Math.floor(minutes / 60), 'hour');
}
