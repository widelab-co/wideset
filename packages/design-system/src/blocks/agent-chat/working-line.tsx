// TODO(custom): the line over the composer while the agent works or was stopped (a mark, a few words, the time, the way to stop or go on); Wideset has no activity line, and ProgressBar has no mode without a value.
import { Button, cn } from '@wideset/react';

import { formatDuration } from './format';
import { Inline } from './inline';
import { Key } from './keyboard-key';
import { ARRIVE } from './motion';

type WorkingLineProps = {
  /** `working`: the agent is at it. `stopped`: you stopped it, and it can go on from there. */
  state: 'working' | 'stopped';
  /** What it says: "Working", "Stopped while writing". */
  label: string;
  /** Seconds since the turn began. */
  seconds?: number;
  /** Stopped: goes on from where it stopped. */
  onContinue?: () => void;
};

/**
 * One quiet line right where the next message is written. While the agent works it says only
 * that: the transcript above already shows the step as it happens, so the line does not repeat
 * its words. A small mark pulses for as long as the run does (the one loop on the screen), then
 * the time so far and the key that stops it. A turn that waits for you has no line: what it
 * waits for is in the transcript, with its own way out. Stopped, the mark is hollow, the line
 * says what the run was in the middle of, and Continue takes the place of the key: bordered,
 * since after a stop the next thing is as likely a new message, so Send keeps the fill.
 */
export function WorkingLine({ state, label, seconds, onContinue }: WorkingLineProps) {
  return (
    <div
      className={cn(
        'gap-ws-5 px-ws-3 typography-label-sm text-ws-static-subtle flex items-center',
        state !== 'stopped' && ARRIVE,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'size-ws-4 rounded-ws-control-full mx-ws-2 shrink-0',
          state === 'working'
            ? 'bg-ws-static-inverse-background motion-safe:animate-pulse'
            : 'border-ws-static-inverse-background border',
        )}
      />
      <span aria-live="polite" className="min-w-0 truncate">
        <Inline text={label} />
      </span>
      {state !== 'stopped' && seconds !== undefined && (
        <span className="shrink-0 tabular-nums">{formatDuration(seconds)}</span>
      )}
      {state === 'stopped' ? (
        <Button
          size="xs"
          variant="secondary"
          preset="border"
          className="ml-auto shrink-0"
          onClick={onContinue}
        >
          Continue
        </Button>
      ) : (
        <span className="gap-ws-3 ml-auto flex shrink-0 items-center">
          <Key>Esc</Key>
          to stop
        </span>
      )}
    </div>
  );
}
