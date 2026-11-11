// TODO(custom): the line over the composer once a run was stopped (what it was doing, and Continue); it takes the place and the shape of the kit's working line, which has no stopped state.
import { Button } from '@wideset/react';

import { Inline } from './inline';

type StoppedLineProps = {
  /** What the agent was doing when it was stopped: "Writing", "Running `pnpm typecheck`". */
  activity: string;
  /** Goes on from where it stopped. */
  onContinue: () => void;
};

/**
 * Where "Esc to stop" was a moment ago: the same line, its mark now still and hollow, saying
 * what the run was in the middle of, with Continue at the end where the key hint sat. The
 * transcript already marks the answer Stopped and keeps what was written, so this line does not
 * say it again. Continue is bordered: after stopping, the next thing is as likely a new message,
 * so Send keeps the fill.
 */
export function StoppedLine({ activity, onContinue }: StoppedLineProps) {
  return (
    <div className="gap-ws-5 pl-ws-3 typography-label-sm text-ws-static-subtle flex items-center">
      <span
        aria-hidden
        className="size-ws-4 rounded-ws-control-full mx-ws-2 border-ws-static-inverse-background shrink-0 border"
      />
      <span className="min-w-0 truncate">
        <Inline
          text={activity ? `Stopped while ${activity[0].toLowerCase()}${activity.slice(1)}` : ''}
        />
      </span>
      <Button
        size="xs"
        variant="secondary"
        preset="border"
        className="ml-auto shrink-0"
        onClick={onContinue}
      >
        Continue
      </Button>
    </div>
  );
}
