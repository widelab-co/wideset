// TODO(custom): voice note recorder (a pulsing dot, the time recorded, stop or discard); Wideset has no recorder.
import { RiMicLine, RiStopFill } from '@remixicon/react';
import { Button } from '@wideset/react';
import { useEffect, useState } from 'react';

import { formatClock } from './format';

type VoiceNoteRecorderProps = {
  /** The moment of the call the note will refer to, when recording starts. */
  at: number;
  onSave: (note: { at: number; duration: number }) => void;
};

/**
 * Recording a voice note, kept to one row. A small secondary button turns into the recording
 * row: a pulsing dot (still when the user asks for less motion), the time recorded, Discard and
 * Stop. Stop saves the note to the comments at the moment recording began. The block ships no
 * audio, so a timer stands in for the microphone.
 */
export function VoiceNoteRecorder({ at, onSave }: VoiceNoteRecorderProps) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (startedAt === null) return;
    const id = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(id);
  }, [startedAt]);

  const reset = () => {
    setStartedAt(null);
    setElapsed(0);
  };

  if (startedAt === null) {
    return (
      <Button
        size="sm"
        variant="secondary"
        preset="border"
        onClick={() => setStartedAt(at)}
        className="self-start"
      >
        <Button.Icon icon={RiMicLine} />
        Record a note
      </Button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Recording a voice note"
      className="h-ws-14 gap-ws-5 pl-ws-7 pr-ws-3 border-ws-static-base rounded-ws-control-lg flex items-center border"
    >
      <span
        aria-hidden="true"
        className="size-ws-5 rounded-ws-control-full bg-ws-semantic-inverse-negative shrink-0 motion-safe:animate-pulse"
      />
      <span className="typography-label-sm text-ws-static-strong">Recording</span>
      <span className="typography-label-sm text-ws-static-subtle tabular-nums">
        {formatClock(elapsed)}
      </span>
      <span className="gap-ws-3 ml-auto flex">
        <Button size="xs" variant="secondary" preset="ghost" onClick={reset}>
          Discard
        </Button>
        <Button
          size="xs"
          variant="secondary"
          preset="border"
          onClick={() => {
            if (elapsed > 0) onSave({ at: startedAt, duration: elapsed });
            reset();
          }}
        >
          <Button.Icon icon={RiStopFill} />
          Stop
        </Button>
      </span>
    </div>
  );
}
