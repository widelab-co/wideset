// One locale for the whole screen; swap it for the user's.
const LOCALE = 'en-US';

const number = new Intl.NumberFormat(LOCALE);
const list = new Intl.ListFormat(LOCALE, { style: 'long', type: 'conjunction' });

/** "4,820 teams", "1 team". */
export const formatTeams = (count: number) =>
  `${number.format(count)} ${count === 1 ? 'team' : 'teams'}`;

/** "Jonas Weber, Tom Becker and Nina Alvarez". */
export const formatList = (items: string[]) => list.format(items);
