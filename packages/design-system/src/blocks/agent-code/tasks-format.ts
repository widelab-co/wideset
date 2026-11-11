/**
 * A running time, as exact as it is useful: to the second while it is short, to the minute from
 * ten minutes on: `52s`, `2m 14s`, `24m`, `1h 5m`.
 */
export function formatElapsed(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  if (minutes >= 10) return `${minutes}m`;
  return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}
