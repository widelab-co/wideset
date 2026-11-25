// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
// Days are calendar days (`2026-11-30`), parsed as UTC midnight: format them in UTC too.
const day = new Intl.DateTimeFormat(LOCALE, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});
const time = new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit' });
const dateTime = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeStyle: 'short' });

export const formatUsd = (value: number) => usd.format(value);
/** A calendar day: "Nov 13, 2026". */
export const formatDay = (iso: string) => day.format(new Date(iso));
/** When something happened today: "11:46 AM"; the full moment goes in its `title`. */
export const formatTime = (iso: string) => time.format(new Date(iso));
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));
