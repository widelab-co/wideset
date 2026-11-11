// TODO(custom): person row with a Follow toggle (avatar, name, role, button); ListItem is a 32px menu row with its own hover and no place for a button.
import { RiCheckLine } from '@remixicon/react';
import { Avatar, Button } from '@wideset/react';
import { useId } from 'react';

import type { Person } from './data';

type WhoToFollowProps = {
  people: Person[];
  /** Ids of the people already followed. */
  following: string[];
  onToggle: (id: string) => void;
};

/**
 * Teammates worth following: the person, then one button that follows them. Followed, the button
 * goes quiet (ghost, a check, "Following") and a second press undoes it, so the row never needs a
 * menu. The label says the state; the name is in its accessible name.
 */
export function WhoToFollow({ people, following, onToggle }: WhoToFollowProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="gap-ws-7 flex flex-col">
      <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
        Who to follow
      </h2>
      <ul className="gap-ws-7 flex flex-col">
        {people.map((person) => {
          const followed = following.includes(person.id);
          return (
            <li key={person.id} className="gap-ws-5 flex items-center">
              <Avatar initials={person.initials} aria-hidden />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="typography-label-strong-sm text-ws-static-strong truncate">
                  {person.name}
                </span>
                <span className="typography-caption-md text-ws-static-subtle truncate">
                  {person.role}
                </span>
              </div>
              <Button
                size="sm"
                variant="secondary"
                preset={followed ? 'ghost' : 'border'}
                aria-label={`${followed ? 'Unfollow' : 'Follow'} ${person.name}`}
                onClick={() => onToggle(person.id)}
              >
                {followed && <Button.Icon icon={RiCheckLine} />}
                {followed ? 'Following' : 'Follow'}
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
