import { StatusBadge } from '@wideset/react';

/**
 * Where the run was paused, in the transcript, after the last step that finished: a badge and a
 * few quiet words. It only marks the place; what happened and what to do are said once, in the
 * notice over the composer.
 */
export function PausedMark({ reason }: { reason: string }) {
  return (
    <div className="gap-ws-5 typography-body-md text-ws-static-subtle flex items-center">
      <StatusBadge color="notice">Paused</StatusBadge>
      {reason}
    </div>
  );
}
