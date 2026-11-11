// TODO(custom): the clock a turn plays on (start, stop, a pause while an approval waits); Wideset has no agent or streaming parts.
import { useCallback, useEffect, useState } from 'react';

import type { Turn } from './model';
import { playTurn } from './run';

/** How often the clock moves on, in milliseconds. */
const TICK = 50;

/** Whether the device asks for less motion; where there is no `matchMedia` (a test), it does not. */
const reducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Plays one of the thread's agent turns: `start` sets its clock going and `playback` is the turn
 * as far as it has come, until it is all there. The clock stands still while a step waits for an
 * approval and goes on once the turn's data says it was answered. When motion is reduced the turn
 * is there at once. `at` is where the clock stands; `stop` ends the run there.
 */
export function useRun(turns: Turn[]) {
  const [run, setRun] = useState<{ id: string; at: number } | null>(null);
  const turn = run && turns.find((item) => item.id === run.id);
  const playback = run && turn?.role === 'agent' ? playTurn(turn, run.at) : null;
  const done = playback?.done ?? false;
  const ticking = playback !== null && !done && !playback.waiting;

  // The clock reads real time, tick by tick, so a slow frame does not slow the run down.
  useEffect(() => {
    if (!ticking) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const passed = now - last;
      last = now;
      setRun((current) => current && { ...current, at: current.at + passed });
    }, TICK);
    return () => window.clearInterval(id);
  }, [ticking]);

  useEffect(() => {
    if (done) setRun(null);
  }, [done]);

  const start = useCallback(
    (id: string, from = 0) => setRun({ id, at: reducedMotion() ? Infinity : from }),
    [],
  );
  const stop = useCallback(() => setRun(null), []);

  return {
    playback: done ? null : playback,
    /** Milliseconds into the run; not finite when motion is reduced. */
    at: run?.at ?? 0,
    start,
    stop,
  };
}
