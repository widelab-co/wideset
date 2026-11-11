import { Button } from '@wideset/react';
import { useEffect, useState } from 'react';

import { failedNote, failedPush } from './data';
import { OpenStep } from './open-step';

type FailedStepProps = {
  /** The run still stands at this step: its ways out are offered. */
  live: boolean;
  /** Lets the agent deal with the cause and go on. */
  onFix: () => void;
};

/**
 * A command that exited 1, where the run stopped: the step open on its error lines, one sentence
 * on why and what Fix it will do, and the two ways out beside it. Fix it is the filled button,
 * since the run waits for it; Retry runs the same command again, for when you have dealt with
 * the cause yourself. Once the session has moved on, the step stays as the record, without them.
 */
export function FailedStep({ live, onFix }: FailedStepProps) {
  const [retrying, setRetrying] = useState(false);

  // ponytail: a timeout stands in for the command, which fails the same way again; a real one
  // shows whatever the new run returns.
  useEffect(() => {
    if (!retrying) return;
    const id = window.setTimeout(() => setRetrying(false), 1800);
    return () => window.clearTimeout(id);
  }, [retrying]);

  return (
    <OpenStep step={retrying ? { ...failedPush, status: 'running' } : failedPush}>
      {live && (
        <>
          <p className="typography-body-md text-ws-static-subtle">{failedNote}</p>
          <div className="gap-ws-3 flex">
            <Button size="sm" disabled={retrying} onClick={onFix}>
              Fix it
            </Button>
            <Button
              size="sm"
              variant="secondary"
              preset="border"
              disabled={retrying}
              onClick={() => setRetrying(true)}
            >
              Retry
            </Button>
          </div>
        </>
      )}
    </OpenStep>
  );
}
