import { NOW } from './data';

// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const relative = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto', style: 'short' });
// Calendar days (`2026-03-04`) parse as UTC midnight: format them in UTC too.
const day = new Intl.DateTimeFormat(LOCALE, { month: 'short', day: 'numeric', timeZone: 'UTC' });
const fullDay = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/** `2 min. ago`, `8 hr. ago` within a day of now, then the day: `Nov 3`. */
export const formatSince = (iso: string) => {
  const minutes = Math.round((Date.parse(iso) - Date.parse(NOW)) / 60_000);
  if (minutes > -1) return 'Just now';
  if (minutes > -60) return relative.format(minutes, 'minute');
  if (minutes > -24 * 60) return relative.format(Math.round(minutes / 60), 'hour');
  return day.format(new Date(iso));
};

export const formatDay = (iso: string) => fullDay.format(new Date(iso));
