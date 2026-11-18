import { useEffect, useState } from 'react';

/**
 * Whole seconds since the pane opened, for the times of what is still running to count on. Read
 * from the clock on every tick, so a tab left in the background catches up when it comes back.
 */
export function useSeconds(): number {
  const [start] = useState(() => Date.now());
  const [now, setNow] = useState(start);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return Math.floor((now - start) / 1000);
}
