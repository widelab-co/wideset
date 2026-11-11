// TODO(custom): person rows and a text-style button that opens the full list; Wideset has no person row (ListItem is a 32px menu row) and no text-style button.
import { RiCloseLine } from '@remixicon/react';
import { Avatar, IconButton, Popup } from '@wideset/react';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';

import type { Person } from './data';

/** How many people the column shows before "and N others". */
const FIRST = 5;

/** One person: the face, the name, where they work; the signed-in user marked "You". */
function PersonRow({ person, you }: { person: Person; you: boolean }) {
  return (
    <li className="gap-ws-5 flex items-center">
      <Avatar initials={person.initials} color={person.color} aria-hidden="true" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="typography-label-strong-sm text-ws-static-strong truncate">
          {person.name}
        </span>
        <span className="typography-caption-md text-ws-static-subtle truncate">
          {person.company}
        </span>
      </div>
      {you ? <span className="typography-label-sm text-ws-static-subtle">You</span> : null}
    </li>
  );
}

/** "and 34 others": an action read as part of the list, in the link colour, underlined. */
const OthersButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  (props, ref) => (
    <button
      ref={ref}
      type="button"
      className="typography-label-sm text-ws-dynamic-primary-default hover:text-ws-dynamic-primary-hover active:text-ws-dynamic-primary-pressed rounded-ws-control-sm focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default cursor-pointer self-start decoration-from-font hover:underline"
      {...props}
    />
  ),
);
OthersButton.displayName = 'OthersButton';

/**
 * Who is going: the first few as faces and names, then "and N others", which opens everyone in a
 * popup beside it so the event stays in view. The signed-in user joins the top of the list the
 * moment they answer Going.
 */
export function AttendeeList({ people, meId }: { people: Person[]; meId: string }) {
  const others = people.length - FIRST;

  return (
    <div className="gap-ws-7 flex flex-col">
      <ul className="gap-ws-7 flex flex-col">
        {people.slice(0, FIRST).map((person) => (
          <PersonRow key={person.id} person={person} you={person.id === meId} />
        ))}
      </ul>
      {others > 0 ? (
        <Popup>
          <Popup.Trigger asChild>
            <OthersButton>and {others} others</OthersButton>
          </Popup.Trigger>
          <Popup.Container side="left" align="start" className="max-h-[30rem] w-[22rem]">
            <Popup.Header>
              <div className="gap-ws-5 flex items-center justify-between">
                <Popup.Title>Going</Popup.Title>
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
            <Popup.Content className="min-h-0">
              <ul className="gap-ws-7 flex flex-col">
                {people.map((person) => (
                  <PersonRow key={person.id} person={person} you={person.id === meId} />
                ))}
              </ul>
            </Popup.Content>
          </Popup.Container>
        </Popup>
      ) : null}
    </div>
  );
}
