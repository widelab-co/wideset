import { Button } from '@wideset/react';

import { failedNote } from './data';

type FailedStepProps = {
  /** Lets the agent deal with the cause and go on. */
  onFix: () => void;
  /** Runs the same command again. */
  onRetry: () => void;
};

/**
 * What to do about a command that exited 1, under the step the run stopped at (the kit opens it
 * on its error lines): one sentence on why it failed and what Fix it will do, and the two ways
 * out. Fix it is the filled button, since the run waits for it; Retry runs the same command
 * again, for when you have dealt with the cause yourself. Once the session has moved on, the
 * step stays as the record, without them.
 */
export function FailedStep({ onFix, onRetry }: FailedStepProps) {
  return (
    <>
      <p className="typography-body-md text-ws-static-subtle">{failedNote}</p>
      <div className="gap-ws-3 flex">
        <Button size="sm" onClick={onFix}>
          Fix it
        </Button>
        <Button size="sm" variant="secondary" preset="border" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </>
  );
}
