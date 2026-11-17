import { NOW } from './data';

const DAY = 24 * 60 * 60 * 1000;
const relative = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
const date = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});
const dateTime = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** "Aug 14, 2026". */
export const formatDate = (iso: string) => date.format(new Date(iso));

/** The exact moment, for the `title` beside a relative date. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));

/** "Active now", "2 hours ago", "Yesterday"; a week or more back, the date. */
export function formatLastActive(iso: string) {
  const minutes = Math.round((NOW.getTime() - new Date(iso).getTime()) / 60000);
  if (minutes < 5) return 'Active now';
  if (minutes < 60 * 24) {
    return capitalise(
      minutes < 60
        ? relative.format(-minutes, 'minute')
        : relative.format(-Math.round(minutes / 60), 'hour'),
    );
  }
  const days = Math.round((NOW.getTime() - new Date(iso).getTime()) / DAY);
  return days >= 7 ? formatDate(iso) : capitalise(relative.format(-days, 'day'));
}

/**
 * How a date and an amount read in a format and time zone: "Nov 10, 2026, 2:30 PM and
 * $1,560.00". The amount stays in dollars; only how it is written changes.
 */
export function formatExample(locale: string, timeZone: string) {
  const when = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(NOW);
  const amount = new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(1560);
  return { when, amount };
}
