// TODO(custom): your message in the transcript (a quiet filled bubble on the right, "Queued" while it waits); Wideset has no message component.
import { RiTimeLine } from '@remixicon/react';

import type { UserTurn } from './model';

/**
 * What you wrote: a quiet grey bubble on the right, no avatar and no name, since everything on
 * the left is the agent's. A message sent while the agent is still working waits its turn, and
 * says so under the bubble.
 */
export function UserMessage({ turn }: { turn: UserTurn }) {
  return (
    <div className="gap-ws-3 flex flex-col items-end">
      <p className="typography-body-md text-ws-static-strong bg-ws-static-alpha-base rounded-ws-container-md px-ws-7 py-ws-5 max-w-[85%] whitespace-pre-line">
        <span className="sr-only">You: </span>
        {turn.text}
      </p>
      {turn.queued && (
        <p className="typography-caption-md text-ws-static-subtle gap-ws-2 flex items-center">
          <RiTimeLine aria-hidden className="size-ws-8" />
          Queued
        </p>
      )}
    </div>
  );
}
