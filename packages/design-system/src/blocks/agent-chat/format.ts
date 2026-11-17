/**
 * A length of time, the one way every agent screen writes it (a run, a thought, a check, a task):
 * "12s", "1m 4s", "24m 5s", then hours and minutes, "1h 5m". It keeps its seconds below an hour
 * so a running count never looks stopped.
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}
