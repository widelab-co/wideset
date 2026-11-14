// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

// Days are calendar days (`2026-11-03`), parsed as UTC midnight: format them in UTC too.
const day = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long', timeZone: 'UTC' });

/** "November 3, 2026". */
export const formatDay = (iso: string) => day.format(new Date(iso));
