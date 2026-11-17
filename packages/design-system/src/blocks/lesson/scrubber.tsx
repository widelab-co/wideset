// TODO(custom): video scrubber with chapter marks; Wideset's Slider has no segments, no aria-valuetext for a time, and a form thumb too heavy for a player.
import type { KeyboardEvent } from 'react';

import type { Chapter } from './data';
import { formatSpoken } from './format';

type ScrubberProps = {
  time: number;
  duration: number;
  chapters: Chapter[];
  onSeek: (time: number) => void;
  onKeyDown: (event: KeyboardEvent) => void;
};

/**
 * Where the video is, and the way to move it: a 4px track, the watched part in the brand colour,
 * a gap where each chapter starts. A native range input lies over the track at full height, so
 * the pointer and the keyboard work as they do on any slider and the time is read aloud as
 * a time ("3 min 12 s of 9 min 40 s, Research the company").
 */
export function Scrubber({ time, duration, chapters, onSeek, onKeyDown }: ScrubberProps) {
  const at = (seconds: number) => `${(seconds / duration) * 100}%`;
  const chapter = chapters.findLast((item) => item.start <= time);

  return (
    <div className="h-ws-12 relative flex items-center">
      <input
        type="range"
        min={0}
        max={duration}
        step={1}
        value={Math.floor(time)}
        onChange={(event) => onSeek(Number(event.target.value))}
        onKeyDown={onKeyDown}
        aria-label="Seek"
        aria-valuetext={`${formatSpoken(time)} of ${formatSpoken(duration)}, ${chapter?.title}`}
        className="peer inset-ws-0 absolute w-full cursor-pointer opacity-0"
      />
      <span className="rounded-ws-control-sm peer-focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full">
        <svg aria-hidden="true" className="h-ws-3 w-full overflow-visible">
          <rect
            width="100%"
            height="100%"
            rx="2"
            className="fill-(--ws-dynamic-stroke-secondary-default)"
          />
          <rect width={at(time)} height="100%" rx="2" className="fill-ws-dynamic-primary-default" />
          {/* A chapter starts where the track breaks: a 2px cut in the frame's own colour. */}
          {chapters.slice(1).map(({ start }) => (
            <rect
              key={start}
              x={at(start)}
              width="2"
              height="100%"
              transform="translate(-1 0)"
              className="fill-(--ws-static-fill-background)"
            />
          ))}
          <circle cx={at(time)} cy="50%" r="6" className="fill-ws-static-strong" />
        </svg>
      </span>
    </div>
  );
}
