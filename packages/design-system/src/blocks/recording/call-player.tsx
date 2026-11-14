// TODO(custom): audio player controls around the speaker timeline; Wideset has no media player.
import { RiForward15Line, RiPauseFill, RiPlayFill, RiReplay15Line } from '@remixicon/react';
import { IconButton, Select } from '@wideset/react';

import type { Line, Person } from './data';
import { formatClock } from './format';
import { SpeakerTimeline } from './speaker-timeline';
import type { Playback } from './use-playback';

const SPEEDS = ['0.75', '1', '1.25', '1.5', '2'].map((value) => ({
  value,
  label: `${value}×`,
}));

type CallPlayerProps = {
  playback: Playback;
  speakers: Person[];
  lines: Line[];
};

/**
 * The recording's player: who spoke when, then the controls under it. Play is the one filled
 * button on the page, since listening is what the page is for; the skips and the speed stay
 * quiet. With focus on the timeline, the arrows seek and Space plays.
 */
export function CallPlayer({ playback, speakers, lines }: CallPlayerProps) {
  const { time, duration, playing, rate, setRate, seek, toggle, onPlayerKeyDown } = playback;

  return (
    <section aria-label="Recording" className="gap-ws-7 flex flex-col">
      <SpeakerTimeline
        speakers={speakers}
        lines={lines}
        time={time}
        duration={duration}
        onSeek={seek}
        onKeyDown={onPlayerKeyDown}
      />
      <div className="gap-ws-3 flex items-center">
        <IconButton
          icon={playing ? RiPauseFill : RiPlayFill}
          size="sm"
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={toggle}
        />
        <IconButton
          icon={RiReplay15Line}
          variant="secondary"
          preset="ghost"
          size="sm"
          aria-label="Back 15 seconds"
          onClick={() => seek(time - 15)}
        />
        <IconButton
          icon={RiForward15Line}
          variant="secondary"
          preset="ghost"
          size="sm"
          aria-label="Forward 15 seconds"
          onClick={() => seek(time + 15)}
        />
        <p className="typography-label-sm px-ws-3 text-ws-static-strong tabular-nums">
          {formatClock(time)}
          <span className="text-ws-static-subtle"> / {formatClock(duration)}</span>
        </p>
        <Select
          size="sm"
          aria-label="Playback speed"
          options={SPEEDS}
          value={String(rate)}
          onValueChange={(value) => setRate(Number(value))}
          className="ml-auto w-[5.5rem]"
        />
      </div>
    </section>
  );
}
