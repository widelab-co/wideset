// TODO(custom): person rows (avatar, name, what they do); Wideset has no person row (ListItem is a 32px menu row with its own hover).
import type { Attendee } from './data';
import { PersonAvatar } from './person-avatar';

/** Who will be there: a face, the name, and where they work. Nothing to click. */
export function PeopleList({ people, labelledBy }: { people: Attendee[]; labelledBy?: string }) {
  return (
    <ul aria-labelledby={labelledBy} className="gap-ws-7 flex flex-col">
      {people.map((person) => (
        <li key={person.name} className="gap-ws-5 flex items-center">
          <PersonAvatar
            name={person.name}
            initials={person.initials}
            color={person.color}
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="typography-label-strong-sm text-ws-static-strong truncate">
              {person.name}
            </span>
            <span className="typography-caption-md text-ws-static-subtle truncate">
              {person.detail}
            </span>
          </div>
          {person.you ? (
            <span className="typography-label-sm text-ws-static-subtle">You</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
