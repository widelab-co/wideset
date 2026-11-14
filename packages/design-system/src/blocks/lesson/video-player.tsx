// TODO(custom): video player (a 16:9 stage, captions, a control bar); Wideset has no media player and no token for a media surface that stays dark in both themes.
import {
  RiClosedCaptioningFill,
  RiClosedCaptioningLine,
  RiFullscreenExitLine,
  RiFullscreenLine,
  RiPauseFill,
  RiPlayFill,
} from '@remixicon/react';
import { IconButton, Select } from '@wideset/react';
import { useEffect, useRef, useState } from 'react';

import type { Chapter, TranscriptLine } from './data';
import { formatClock } from './format';
import { Scrubber } from './scrubber';
import type { Playback } from './use-playback';

const SPEEDS = ['0.75', '1', '1.25', '1.5', '2'].map((value) => ({
  value,
  label: `${value}×`,
}));

type VideoPlayerProps = {
  /** The video's title, for the player's name. */
  title: string;
  playback: Playback;
  chapters: Chapter[];
  captions: TranscriptLine[];
};

/**
 * The lesson's video, drawn: a 16:9 stage that plays and pauses on a click, the captions over its
 * foot and the control bar along its bottom edge. It is a dark island (`dark` on its root), so
 * the stage stays dark in both themes, as a video does, and the Wideset controls on it take their
 * dark look. With focus on the stage or the scrubber, the arrows seek and Space plays.
 */
export function VideoPlayer({ title, playback, chapters, captions }: VideoPlayerProps) {
  const ref = useRef<HTMLElement>(null);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const { time, duration, playing, rate, setRate, seek, toggle, onPlayerKeyDown } = playback;

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === ref.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const chapter = chapters.findLast((item) => item.start <= time);
  // Before the first word there is nothing to caption.
  const caption = time > 0 ? captions.findLast((line) => line.at <= time) : undefined;

  return (
    <section
      ref={ref}
      aria-label={`Video: ${title}`}
      className="dark bg-ws-static-background rounded-ws-container-md text-ws-static-strong relative flex aspect-video flex-col overflow-hidden"
    >
      <button
        type="button"
        aria-label={playing ? 'Pause' : 'Play'}
        aria-keyshortcuts="Space ArrowLeft ArrowRight"
        onClick={toggle}
        onKeyDown={onPlayerKeyDown}
        className="group rounded-ws-container-md focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default p-ws-12 relative flex min-h-0 flex-1 cursor-pointer flex-col items-center justify-end focus-visible:-outline-offset-4"
      >
        {!playing && (
          <span
            aria-hidden="true"
            className="bg-ws-static-inverse-background group-hover:bg-ws-static-inverse-foreground text-ws-static-inverse-strong rounded-ws-control-full size-ws-20 inset-ws-0 absolute m-auto flex items-center justify-center"
          >
            <RiPlayFill className="size-ws-14" />
          </span>
        )}
        {captionsOn && caption && (
          <span
            aria-hidden="true"
            className="typography-body-lg text-ws-static-strong max-w-[40rem] text-center"
          >
            {caption.text}
          </span>
        )}
      </button>

      <div className="px-ws-9 pb-ws-5 flex flex-col">
        <Scrubber
          time={time}
          duration={duration}
          chapters={chapters}
          onSeek={seek}
          onKeyDown={onPlayerKeyDown}
        />
        <div className="gap-ws-3 flex items-center">
          <IconButton
            icon={playing ? RiPauseFill : RiPlayFill}
            variant="secondary"
            preset="ghost"
            size="sm"
            aria-label={playing ? 'Pause' : 'Play'}
            onClick={toggle}
            className="-ml-ws-3"
          />
          <p className="typography-label-sm gap-ws-5 px-ws-3 flex min-w-0 items-baseline">
            <span className="tabular-nums">
              {formatClock(time)}
              <span className="text-ws-static-subtle"> / {formatClock(duration)}</span>
            </span>
            <span className="text-ws-static-subtle truncate">{chapter?.title}</span>
          </p>
          <div className="gap-ws-3 ml-auto flex items-center">
            <Select
              size="sm"
              aria-label="Playback speed"
              options={SPEEDS}
              value={String(rate)}
              onValueChange={(value) => setRate(Number(value))}
              className="w-[5.5rem]"
            />
            <IconButton
              icon={captionsOn ? RiClosedCaptioningFill : RiClosedCaptioningLine}
              variant="secondary"
              preset="ghost"
              size="sm"
              aria-label="Captions"
              aria-pressed={captionsOn}
              onClick={() => setCaptionsOn(!captionsOn)}
            />
            <IconButton
              icon={fullscreen ? RiFullscreenExitLine : RiFullscreenLine}
              variant="secondary"
              preset="ghost"
              size="sm"
              aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
              onClick={() =>
                fullscreen ? document.exitFullscreen() : ref.current?.requestFullscreen()
              }
              className="-mr-ws-3"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
