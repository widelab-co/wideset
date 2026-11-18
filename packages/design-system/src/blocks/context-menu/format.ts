import { NOW } from './data';

const LOCALE = 'en-US';

const usd = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const relative = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });
const dayMonth = new Intl.DateTimeFormat(LOCALE, { month: 'short', day: 'numeric' });
const full = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium', timeStyle: 'short' });

const DAY = 24 * 60 * 60 * 1000;
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** `$18,500`: whole dollars, as MRR is read. */
export const formatUsd = (value: number) => usd.format(value);

/** `18 minutes ago`, `Yesterday`, `3 days ago`, then `Oct 28` from a week back. */
export function formatActivity(iso: string) {
  const date = new Date(iso);
  const days = Math.round((startOfDay(NOW).getTime() - startOfDay(date).getTime()) / DAY);
  const minutes = Math.round((NOW.getTime() - date.getTime()) / 60000);
  const text =
    days >= 7
      ? dayMonth.format(date)
      : days > 0
        ? relative.format(-days, 'day')
        : minutes < 60
          ? relative.format(-minutes, 'minute')
          : relative.format(-Math.floor(minutes / 60), 'hour');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** `Nov 10, 2026, 3:42 PM`, for the title behind a relative date. */
export const formatDateTime = (iso: string) => full.format(new Date(iso));
