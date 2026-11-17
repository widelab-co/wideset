import { type KeyboardEvent, useEffect, useState } from 'react';

/** How often the clock moves, in milliseconds. */
const TICK = 250;
/** How far each arrow key seeks, in seconds. */
const SEEK_KEYS: Record<string, number> = {
  ArrowLeft: -5,
  ArrowDown: -5,
  ArrowRight: 5,
  ArrowUp: 5,
};

export type Playback = ReturnType<typeof usePlayback>;

/**
 * The clock of a drawn player. A block ships no media, so a timer moves `time` while `playing`,
 * at `rate`, and stops at the end the way a player does. `seek` clamps to the length.
 */
export function usePlayback(duration: number, start = 0) {
  const [time, setTime] = useState(start);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const ended = time >= duration;

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(
      () => setTime((now) => Math.min(duration, now + (TICK / 1000) * rate)),
      TICK,
    );
    return () => window.clearInterval(id);
  }, [playing, rate, duration]);

  useEffect(() => {
    if (ended) setPlaying(false);
  }, [ended]);

  const seek = (to: number) => setTime(Math.min(duration, Math.max(0, to)));
  const play = () => {
    // From the end, play starts over.
    if (ended) setTime(0);
    setPlaying(true);
  };
  const pause = () => setPlaying(false);
  const toggle = () => (playing ? pause() : play());

  /**
   * The player's keys, for the stage and the scrubber: the arrows seek five seconds, Space plays
   * and pauses. A button already plays on Space through its click, so it is left to do that.
   */
  const onPlayerKeyDown = (event: KeyboardEvent) => {
    const delta = SEEK_KEYS[event.key];
    if (delta) {
      event.preventDefault();
      seek(time + delta);
    } else if (event.key === ' ' && !(event.target instanceof HTMLButtonElement)) {
      event.preventDefault();
      toggle();
    }
  };

  return {
    time,
    duration,
    playing,
    ended,
    rate,
    setRate,
    seek,
    play,
    pause,
    toggle,
    onPlayerKeyDown,
  };
}
