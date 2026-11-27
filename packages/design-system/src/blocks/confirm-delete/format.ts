// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';
const DAY = 86_400_000;

// Days are calendar days (`2026-11-10`), parsed as UTC midnight: format them in UTC too.
const shortDay = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});
const longDay = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long', timeZone: 'UTC' });
const relative = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });

/** A day as a list says it: `Today`, `Yesterday`, then `Nov 6`. */
export function formatDay(iso: string, today: string) {
  const ago = (Date.parse(today) - Date.parse(iso)) / DAY;
  if (ago < 0 || ago > 1) return shortDay.format(new Date(iso));
  const text = relative.format(-ago, 'day');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** November 6, 2026: the exact day, for the `title` beside a relative one. */
export const formatLongDay = (iso: string) => longDay.format(new Date(iso));

/** `1 report`, `14 reports`. */
export const formatReports = (count: number) => `${count} ${count === 1 ? 'report' : 'reports'}`;

/** Who loses access, named by the first: `Jonas`, `Jonas and Priya`, `Jonas and 5 others`. */
export function formatPeople(people: string[]) {
  const [first, ...rest] = people.map((name) => name.split(' ')[0]);
  if (rest.length === 0) return first;
  if (rest.length === 1) return `${first} and ${rest[0]}`;
  return `${first} and ${rest.length} others`;
}
