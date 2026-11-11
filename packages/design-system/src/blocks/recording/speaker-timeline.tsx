// TODO(custom): speaker timeline (who spoke when, one row a person, the played part and the playhead) with a range input over it; Wideset has no audio player or timeline.
import { Avatar } from '@wideset/react';
import type { KeyboardEvent } from 'react';

import type { Line, Person } from './data';
import { formatSpoken } from './format';

/** Height of one person's row, in px: the SVG draws both rows at this pitch. */
const ROW = 32;

type SpeakerTimelineProps = {
  speakers: Person[];
  lines: Line[];
  time: number;
  duration: number;
  onSeek: (time: number) => void;
  onKeyDown: (event: KeyboardEvent) => void;
};

/**
 * Who spoke when: a row a person, their turns as 4px bars in one neutral tone, so the two read
 * apart by row and not by colour. The part already played turns the brand colour and a playhead
 * marks now. A native range input lies over the bars, so a click anywhere seeks there and the
 * keyboard works as it does on any slider.
 */
export function SpeakerTimeline({
  speakers,
  lines,
  time,
  duration,
  onSeek,
  onKeyDown,
}: SpeakerTimelineProps) {
  const at = (seconds: number) => `${(seconds / duration) * 100}%`;
  // A turn runs to the next line, less a hair so two turns in a row stay apart; a short one
  // ("And what do they work in today?") keeps a few pixels so it still shows.
  const turns = lines.map((line, index) => {
    const end = (lines[index + 1]?.at ?? duration) - duration * 0.002;
    return {
      speaker: line.speaker,
      start: line.at,
      end: Math.max(end, line.at + duration * 0.004),
    };
  });
  const height = speakers.length * ROW;

  return (
    <div className="gap-ws-9 grid grid-cols-[10rem_minmax(0,1fr)] items-stretch">
      <ul aria-label="Speakers" className="flex flex-col">
        {speakers.map((speaker) => (
          <li key={speaker.id} className="h-ws-14 gap-ws-5 flex items-center">
            <Avatar size="xs" initials={speaker.initials} color={speaker.color} aria-hidden />
            <span className="typography-label-sm text-ws-static-base truncate">{speaker.name}</span>
          </li>
        ))}
      </ul>

      <div className="relative">
        <input
          type="range"
          min={0}
          max={duration}
          step={1}
          value={Math.floor(time)}
          onChange={(event) => onSeek(Number(event.target.value))}
          onKeyDown={onKeyDown}
          aria-label="Seek"
          aria-valuetext={`${formatSpoken(time)} of ${formatSpoken(duration)}`}
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <span className="rounded-ws-control-sm peer-focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex">
          <svg aria-hidden="true" width="100%" height={height} className="overflow-visible">
            {speakers.map((speaker, row) => {
              const y = row * ROW + ROW / 2 - 2;
              return (
                <g key={speaker.id}>
                  {/* The person's lane, the track a ProgressBar draws, so silence reads as theirs. */}
                  <rect
                    y={y}
                    width="100%"
                    height="4"
                    rx="2"
                    className="fill-(--ws-dynamic-stroke-secondary-default)"
                  />
                  {turns
                    .filter((turn) => turn.speaker.id === speaker.id)
                    .map((turn) => (
                      <g key={turn.start}>
                        <rect
                          x={at(turn.start)}
                          y={y}
                          width={at(turn.end - turn.start)}
                          height="4"
                          rx="2"
                          className="fill-(--ws-semantic-stroke-neutral)"
                        />
                        {time > turn.start && (
                          <rect
                            x={at(turn.start)}
                            y={y}
                            width={at(Math.min(time, turn.end) - turn.start)}
                            height="4"
                            rx="2"
                            className="fill-ws-dynamic-primary-default"
                          />
                        )}
                      </g>
                    ))}
                </g>
              );
            })}
            <rect
              x={at(time)}
              width="2"
              height="100%"
              rx="1"
              transform="translate(-1 0)"
              className="fill-ws-dynamic-primary-default"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
