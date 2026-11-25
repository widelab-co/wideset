// TODO(custom): what a session waits for, answered from its row (an approval to allow or deny, a question with the answers offered); Wideset's InlineAlert is a message with one action.
import { Button } from '@wideset/react';
import type { MouseEvent } from 'react';

import type { SessionRequest as Request } from './data';

type SessionRequestProps = {
  /** The session's name, so each button says what it answers. */
  session: string;
  request: Request;
  /** The answer given: "allowed", "denied", or the option picked. */
  onAnswer: (answer: string) => void;
};

/**
 * What a session needs from you, in a sentence under its last step, with the answer one click
 * away so the list can be worked through without opening each session. An approval offers Allow
 * once, the screen's one filled button, and Deny; a question offers the answers the agent
 * proposed, none of them filled, because none is the recommended one. An answer is its own
 * click: it never selects the row.
 */
export function SessionRequest({ session, request, onAnswer }: SessionRequestProps) {
  const answer = (said: string) => (event: MouseEvent) => {
    event.stopPropagation();
    onAnswer(said);
  };

  return (
    <div
      role="group"
      aria-label={`${session} needs you`}
      className="gap-ws-5 pt-ws-3 pb-ws-3 flex flex-col items-start"
    >
      <p className="typography-body-sm text-ws-static-base text-pretty">
        {request.kind === 'approval' ? request.reason : request.text}
      </p>
      <div className="gap-ws-3 flex flex-wrap">
        {request.kind === 'approval' ? (
          <>
            <Button size="sm" onClick={answer('allowed')}>
              Allow once
            </Button>
            <Button size="sm" variant="secondary" preset="ghost" onClick={answer('denied')}>
              Deny
            </Button>
          </>
        ) : (
          request.options.map((option) => (
            <Button
              key={option}
              size="sm"
              variant="secondary"
              preset="border"
              onClick={answer(option)}
            >
              {option}
            </Button>
          ))
        )}
      </div>
    </div>
  );
}
