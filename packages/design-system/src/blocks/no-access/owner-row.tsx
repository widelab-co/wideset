// TODO(custom): non-interactive person row; ListItem always looks clickable.
import type { Person } from './data';
import { PersonAvatar } from './person-avatar';

/** Who decides on access: the person first, what they are to the page quieter under it. */
export function OwnerRow({ person, note }: { person: Person; note: string }) {
  return (
    <div className="gap-ws-7 flex items-center">
      <PersonAvatar name={person.name} initials={person.initials} color={person.color} />
      <div className="flex min-w-0 flex-col">
        <span className="typography-label-strong-sm text-ws-static-strong truncate">
          {person.name}
        </span>
        <span className="typography-caption-md text-ws-static-subtle truncate">{note}</span>
      </div>
    </div>
  );
}
