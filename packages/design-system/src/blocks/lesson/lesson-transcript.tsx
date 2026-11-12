// TODO(custom): transcript rows (time, text, the row seeks the video); Wideset has no transcript or timed list.
import type { TranscriptLine } from './data';
import { formatClock } from './format';

type LessonTranscriptProps = {
  lines: TranscriptLine[];
  onSeek: (time: number) => void;
};

/**
 * What is said in the video, a line per paragraph with the time it starts. A line is one target
 * across its width: it moves the video to that moment.
 */
export function LessonTranscript({ lines, onSeek }: LessonTranscriptProps) {
  return (
    <ol aria-label="Transcript" className="-mx-ws-5 flex flex-col">
      {lines.map((line) => (
        <li key={line.at}>
          <button
            type="button"
            onClick={() => onSeek(line.at)}
            aria-label={`Play from ${formatClock(line.at)}: ${line.text}`}
            className="gap-ws-9 px-ws-5 py-ws-4 rounded-ws-control-lg hover:bg-ws-dynamic-tertiary-alpha-strong-default focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex w-full cursor-pointer items-baseline text-left"
          >
            <span className="typography-label-sm text-ws-static-subtle w-ws-16 shrink-0 tabular-nums">
              {formatClock(line.at)}
            </span>
            <span className="typography-body-md text-ws-static-base">{line.text}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}
