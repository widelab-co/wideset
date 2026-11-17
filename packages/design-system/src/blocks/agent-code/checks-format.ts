/** How long a check ran, as a CI page writes it: "38s", "1m 12s", "4m 06s". */
export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes ? `${minutes}m ${String(rest).padStart(2, '0')}s` : `${rest}s`;
}

/** A count with its noun: "1 failing check", "2 unresolved comments". */
export const formatCount = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? '' : 's'}`;
