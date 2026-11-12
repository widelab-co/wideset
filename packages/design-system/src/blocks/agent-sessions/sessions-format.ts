const relative = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
const dateTime = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' });

/** How long ago, in the largest unit that fits: "Just now", "6 minutes ago", "2 hours ago", "yesterday". */
export const formatAgo = (iso: string, now: string) => {
  const minutes = Math.round((Date.parse(iso) - Date.parse(now)) / 60000);
  if (minutes === 0) return 'Just now';
  if (minutes > -60) return relative.format(minutes, 'minute');
  if (minutes > -24 * 60) return relative.format(Math.round(minutes / 60), 'hour');
  return relative.format(Math.round(minutes / (24 * 60)), 'day');
};

/** The full date and time, for the title of a relative one. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));

/** How long a session has run: "4m", "1h 12m". */
export const formatRunTime = (minutes: number) =>
  minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
