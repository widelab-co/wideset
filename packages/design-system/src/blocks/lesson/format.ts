// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const twoDigits = new Intl.NumberFormat(LOCALE, { minimumIntegerDigits: 2 });

/** A player's clock: "3:12", "12:05". */
export function formatClock(seconds: number) {
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${twoDigits.format(whole % 60)}`;
}

/** The same moment read aloud, for a scrubber's `aria-valuetext`: "3 min 12 s". */
export function formatSpoken(seconds: number) {
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  return minutes ? `${minutes} min ${whole % 60} s` : `${whole % 60} s`;
}

/** A lesson's length in the outline: "9 min". */
export const formatMinutes = (minutes: number) => `${minutes} min`;
