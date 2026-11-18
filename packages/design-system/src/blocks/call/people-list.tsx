// TODO(custom): a person row on a call (avatar, name, company, microphone state, Mute); Wideset's ListItem always reads as clickable.
import { RiMicLine, RiMicOffLine } from '@remixicon/react';
import { Button } from '@wideset/react';
import { useId } from 'react';

import type { Participant } from './data';
import { PersonAvatar } from './person-avatar';

type PeopleListProps = {
  people: Participant[];
  onMute: (id: string) => void;
  onMuteAll: () => void;
};

/**
 * Who is on the call and whether they can be heard. Maya hosts, so she can turn anyone's
 * microphone off, one by one or all at once; turning it back on is theirs to do, so a muted row
 * only says so. The rows do nothing on click, so they are plain list items, not ListItem.
 */
export function PeopleList({ people, onMute, onMuteAll }: PeopleListProps) {
  const id = useId();
  const others = people.filter((person) => !person.you);

  return (
    <section aria-labelledby={id} className="gap-ws-7 p-ws-9 flex flex-col">
      <div className="gap-ws-5 flex items-center justify-between">
        <h2 id={id} className="typography-label-strong-md text-ws-static-strong">
          On the call
        </h2>
        <Button
          variant="secondary"
          preset="border"
          size="sm"
          disabled={others.every((person) => person.muted)}
          onClick={onMuteAll}
        >
          Mute all
        </Button>
      </div>
      <ul aria-labelledby={id} className="gap-ws-5 flex flex-col">
        {people.map((person) => (
          <li key={person.id} className="gap-ws-5 py-ws-3 flex items-center">
            <PersonAvatar
              name={person.name}
              initials={person.initials}
              color={person.color}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="typography-label-sm text-ws-static-strong truncate">
                {person.you ? `${person.name} (you)` : person.name}
              </p>
              <p className="typography-body-sm text-ws-static-subtle truncate">
                {person.you ? `${person.company}, host` : person.company}
              </p>
            </div>
            {person.muted || person.you ? (
              <span className="typography-label-sm text-ws-static-subtle gap-ws-3 flex items-center">
                {person.muted ? (
                  <>
                    <RiMicOffLine aria-hidden className="size-ws-9" />
                    Muted
                  </>
                ) : (
                  <RiMicLine role="img" aria-label="Microphone on" className="size-ws-9" />
                )}
              </span>
            ) : (
              <Button
                variant="secondary"
                preset="ghost"
                size="sm"
                aria-label={`Mute ${person.name}`}
                onClick={() => onMute(person.id)}
                className="-mr-ws-6"
              >
                Mute
              </Button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
