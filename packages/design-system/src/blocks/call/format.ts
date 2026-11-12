// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const twoDigits = new Intl.NumberFormat(LOCALE, { minimumIntegerDigits: 2 });
const time = new Intl.DateTimeFormat(LOCALE, { hour: 'numeric', minute: '2-digit' });

/** How long the call has run: "14:32", "1:02:05" past the hour. */
export function formatClock(seconds: number) {
  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const secs = twoDigits.format(whole % 60);
  return hours ? `${hours}:${twoDigits.format(minutes)}:${secs}` : `${minutes}:${secs}`;
}

/** When a chat message was sent, the same day: "11:17 AM". */
export const formatTime = (iso: string) => time.format(new Date(iso));
