import { NOW } from './changes-data';

// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';
const MINUTE = 60_000;

const relative = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });

/** How long ago a comment was left, the same day: "Just now", "35 minutes ago", "2 hours ago". */
export function formatWhen(iso: string) {
  const minutes = Math.round((NOW.getTime() - new Date(iso).getTime()) / MINUTE);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return relative.format(-minutes, 'minute');
  return relative.format(-Math.floor(minutes / 60), 'hour');
}
