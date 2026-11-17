// TODO(custom): speaker rows (avatar, name, role at company, one line); Wideset has no person or bio row.

import type { Speaker } from './data';
import { PersonAvatar } from './person-avatar';

/**
 * Who speaks, two to a row: the face, the name, their role where they work, and one line on why
 * they are worth hearing. No links: the agenda says when each one is on.
 */
export function SpeakerList({ speakers }: { speakers: Speaker[] }) {
  return (
    <ul className="gap-x-ws-12 gap-y-ws-11 grid grid-cols-1 md:grid-cols-2">
      {speakers.map((speaker) => (
        <li key={speaker.id} className="gap-ws-7 flex items-start">
          <PersonAvatar
            size="lg"
            name={speaker.name}
            initials={speaker.initials}
            color={speaker.color}
            aria-hidden="true"
          />
          <div className="gap-ws-2 flex min-w-0 flex-col">
            <div className="flex flex-col">
              <span className="typography-label-strong-sm text-ws-static-strong">
                {speaker.name}
              </span>
              <span className="typography-body-md text-ws-static-subtle">
                {speaker.role}, {speaker.company}
              </span>
            </div>
            <p className="typography-body-md text-ws-static-base">{speaker.line}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
