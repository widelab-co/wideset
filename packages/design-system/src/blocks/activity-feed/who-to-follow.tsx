// TODO(custom): person row with a Follow toggle (avatar, name, role, button); ListItem is a 32px menu row with its own hover and no place for a button.
import { RiCheckLine } from '@remixicon/react';
import { Button, Card } from '@wideset/react';
import { useId } from 'react';

import type { Person } from './data';
import { PersonAvatar } from './person-avatar';

type WhoToFollowProps = {
  people: Person[];
  /** Ids of the people already followed. */
  following: string[];
  onToggle: (id: string) => void;
};

/**
 * Teammates worth following, in a card beside the feed: the person, then one button that follows
 * them. Followed, the button
 * goes quiet (ghost, a check, "Following") and a second press undoes it, so the row never needs a
 * menu. The label says the state; the name is in its accessible name.
 */
export function WhoToFollow({ people, following, onToggle }: WhoToFollowProps) {
  const titleId = useId();

  return (
    <Card role="region" aria-labelledby={titleId}>
      <Card.Header>
        <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
          Who to follow
        </h2>
      </Card.Header>
      <Card.Content contentClassName="pr-ws-6">
        <ul className="gap-ws-7 flex flex-col">
          {people.map((person) => {
            const followed = following.includes(person.id);
            return (
              <li key={person.id} className="gap-ws-5 flex items-center">
                <PersonAvatar name={person.name} initials={person.initials} aria-hidden />
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
      </Card.Content>
    </Card>
  );
}
