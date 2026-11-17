/** A length of time as it is said beside a run: "12s", "1m 4s". */
export const formatDuration = (seconds: number) =>
  seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
