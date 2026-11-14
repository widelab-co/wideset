// TODO(custom): person row with a Follow toggle (avatar, name, role, button); ListItem is a 32px menu row with its own hover and no place for a button.
import { RiCheckLine } from '@remixicon/react';
import { Button } from '@wideset/react';

import type { Person } from './data';
import { PersonAvatar } from './person-avatar';

type PersonRowProps = {
  person: Person;
  /** Whether the signed-in user follows them. */
  followed: boolean;
  /** The signed-in user's own row: no button, a quiet "You" in its place. */
  you?: boolean;
  onToggle: () => void;
};

/**
 * One person, then one button that follows them, as in the feed's "Who to follow". Followed, the
 * button goes quiet (ghost, a check, "Following") and a second press undoes it. It is a toggle
 * (`aria-pressed`); its accessible name starts with the visible label and adds the person's name.
 */
export function PersonRow({ person, followed, you, onToggle }: PersonRowProps) {
  return (
    <li className="gap-ws-5 flex items-center">
      <PersonAvatar
        name={person.name}
        initials={person.initials}
        color={person.color}
        aria-hidden
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="typography-label-strong-sm text-ws-static-strong truncate">
          {person.name}
        </span>
        <span className="typography-caption-md text-ws-static-subtle truncate">{person.role}</span>
      </div>
      {you ? (
        <span className="typography-label-sm text-ws-static-subtle px-ws-5">You</span>
      ) : (
        <Button
          size="sm"
          variant="secondary"
          preset={followed ? 'ghost' : 'border'}
          aria-label={`${followed ? 'Following' : 'Follow'} ${person.name}`}
          aria-pressed={followed}
          onClick={onToggle}
        >
          {followed && <Button.Icon icon={RiCheckLine} />}
          {followed ? 'Following' : 'Follow'}
        </Button>
      )}
    </li>
  );
}
