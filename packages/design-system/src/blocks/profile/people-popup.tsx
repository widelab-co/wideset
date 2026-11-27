import { RiCloseLine } from '@remixicon/react';
import { IconButton, Popup } from '@wideset/react';
import type { ReactNode } from 'react';

import { me, type Person } from './data';
import { PersonRow } from './person-row';

type PeoplePopupProps = {
  /** The popup's title: `Followers`, `Following`. */
  title: string;
  people: Person[];
  /** Ids of the people the signed-in user follows. */
  following: string[];
  onToggle: (id: string) => void;
  /** The figure that opens it. */
  children: ReactNode;
};

/**
 * A short list of people anchored to the figure that counts them, so the profile stays in view:
 * each person with their own Follow button, the signed-in user marked "You". No footer: following
 * applies as it is pressed.
 */
export function PeoplePopup({ title, people, following, onToggle, children }: PeoplePopupProps) {
  return (
    <Popup>
      <Popup.Trigger asChild>{children}</Popup.Trigger>
      <Popup.Container side="bottom" align="start" className="w-[22rem]">
        <Popup.Header>
          <div className="gap-ws-5 flex items-center justify-between">
            <Popup.Title>{title}</Popup.Title>
            <Popup.Close asChild>
              <IconButton
                aria-label="Close"
                icon={RiCloseLine}
                preset="border"
                variant="secondary"
                size="sm"
              />
            </Popup.Close>
          </div>
        </Popup.Header>
        <Popup.Content>
          <ul className="gap-ws-7 flex flex-col">
            {people.map((person) => (
              <PersonRow
                key={person.id}
                person={person}
                you={person.id === me.id}
                followed={following.includes(person.id)}
                onToggle={() => onToggle(person.id)}
              />
            ))}
          </ul>
        </Popup.Content>
      </Popup.Container>
    </Popup>
  );
}
