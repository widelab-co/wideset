// TODO(custom): the call stage (a surface that stays dark in both themes, the people as tiles, a shared screen in the large spot); Wideset has no call or media surface.
import { RiPhoneLine } from '@remixicon/react';
import { Button, cn } from '@wideset/react';

import type { Participant } from './data';
import { ParticipantTile } from './participant-tile';
import { SharedScreen } from './shared-screen';

export type CallPhase = 'connecting' | 'live' | 'left';

type CallStageProps = {
  phase: CallPhase;
  people: Participant[];
  /** Whose voice is on now, if anyone's. */
  speakerId?: string;
  sharing: boolean;
  onRejoin: () => void;
};

/**
 * The call itself, the heaviest thing on the page: a dark island (`dark` on its root), as a video
 * is dark in both themes. Four people share it as a two-by-two grid; while a screen is shared it
 * takes the large spot and the people move to a strip under it. Before the call connects, and
 * after leaving it, the stage says so in one line.
 */
export function CallStage({ phase, people, speakerId, sharing, onRejoin }: CallStageProps) {
  return (
    <section
      aria-label="Call"
      className="dark bg-ws-static-background rounded-ws-container-md p-ws-5 text-ws-static-strong flex min-h-0 flex-1 flex-col"
    >
      {phase === 'live' ? (
        <div
          className={cn(
            'gap-ws-5 grid min-h-0 flex-1',
            sharing && 'grid-rows-[minmax(0,1fr)_8rem]',
          )}
        >
          {sharing && <SharedScreen />}
          <ul
            aria-label="People on the call"
            className={cn(
              'gap-ws-5 grid min-h-0',
              sharing ? 'grid-cols-4' : 'grid-cols-2 grid-rows-2',
            )}
          >
            {people.map((person) => (
              <ParticipantTile
                key={person.id}
                person={person}
                speaking={person.id === speakerId}
                compact={sharing}
              />
            ))}
          </ul>
        </div>
      ) : (
        <div
          role="status"
          className="gap-ws-9 flex flex-1 flex-col items-center justify-center text-center"
        >
          {phase === 'connecting' ? (
            <p className="typography-label-md text-ws-static-subtle">Connecting…</p>
          ) : (
            <>
              <p className="typography-label-strong-md text-ws-static-strong">You left the call</p>
              <Button variant="secondary" preset="border" size="sm" onClick={onRejoin}>
                <Button.Icon icon={RiPhoneLine} />
                Rejoin
              </Button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
