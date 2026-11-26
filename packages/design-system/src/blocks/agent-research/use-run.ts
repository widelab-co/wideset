// TODO(custom): the clock a turn plays on (start, stop, a pause while it waits for you); Wideset has no agent or streaming parts.
import { useCallback, useEffect, useState } from 'react';

import type { Turn } from './model';
import { playTurn } from './run';

/** How often the clock moves on, in milliseconds. */
const TICK = 50;

/** Whether the device asks for less motion; where there is no `matchMedia` (a test), it does not. */
export const reducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Plays one of the thread's agent turns: `start` sets its clock going, from its beginning or from
 * a point in it, and `playback` is the turn as far as it has come, until it is all there or it
 * comes to something it waits for from you: then the run ends, and whoever answers starts it
 * again from that point. Reduced motion does not stop the clock: the agent takes the time it
 * takes; only the text arrives a line at a time and nothing animates. `at` is where the clock
 * stands; `stop` ends the run there. With `opening` the thread opens in the middle of a run.
 */
export function useRun(turns: Turn[], opening?: { id: string; at: number }) {
  const [run, setRun] = useState<{ id: string; at: number } | null>(opening ?? null);
  const turn = run && turns.find((item) => item.id === run.id);
  const playback = run && turn?.role === 'agent' ? playTurn(turn, run.at, reducedMotion()) : null;
  // A turn that has come to something it waits for from you is at rest, like one that is done:
  // the transcript holds it there, and answering sets it going again from that point.
  const done = Boolean(playback?.done || playback?.waiting);
  const ticking = playback !== null && !done;

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

  const start = useCallback((id: string, from = 0) => setRun({ id, at: from }), []);
  const stop = useCallback(() => setRun(null), []);

  return {
    playback: done ? null : playback,
    /** Milliseconds into the run. */
    at: run?.at ?? 0,
    start,
    stop,
  };
}
