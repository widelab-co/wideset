/** A count with its noun: "1 failing check", "2 unresolved comments". */
export const formatCount = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? '' : 's'}`;
