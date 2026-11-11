// TODO(custom): the line over the composer while the agent works (a pulsing mark, what it is doing, the time, how to stop); Wideset has no activity or progress line without a value.
import { cn } from '@wideset/react';

import { formatDuration } from './format';
import { Inline } from './inline';
import { Key } from './keyboard-key';
import { ARRIVE } from './motion';

type WorkingLineProps = {
  /** What the agent is doing now: "Thinking", "Reading `bookings-table.tsx`". */
  activity: string;
  /** Seconds since the turn began; left out when it is not a finite number. */
  seconds: number;
  /** It waits for you: the mark stands still in the notice colour. */
  waiting: boolean;
};

/**
 * Says the agent is still at it, right where the next message is written: a small mark that
 * pulses for as long as it works, the current activity (announced when it changes), the time so
 * far, and the key that stops it. It is all in the subtle colour: the transcript above shows the
 * same step as it happens, and this line is only its footer. The pulse loops for as long as the
 * run does, and ends with it.
 */
export function WorkingLine({ activity, seconds, waiting }: WorkingLineProps) {
  return (
    <div
      className={cn(
        'gap-ws-5 px-ws-3 typography-label-sm text-ws-static-subtle flex items-center',
        ARRIVE,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'size-ws-4 rounded-ws-control-full mx-ws-2 shrink-0',
          waiting
            ? 'bg-ws-semantic-inverse-notice'
            : 'bg-ws-static-inverse-background motion-safe:animate-pulse',
        )}
      />
      <span aria-live="polite" className="min-w-0 truncate">
        <Inline text={activity} />
      </span>
      {Number.isFinite(seconds) && (
        <span className="shrink-0 tabular-nums">{formatDuration(seconds)}</span>
      )}
      <span className="gap-ws-3 ml-auto flex shrink-0 items-center">
        <Key>Esc</Key>
        to stop
      </span>
    </div>
  );
}
