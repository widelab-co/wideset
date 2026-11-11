/** The preview's browser sits an hour ahead of UTC, so the 09:00Z booking reads 10:00 on the page. */
const TIME = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'Europe/Berlin',
});

/** A booking's hours as the page shows them: `10:00 – 10:30 AM`. */
export const formatTimeRange = (start: string, end: string) =>
  TIME.formatRange(new Date(start), new Date(end));
