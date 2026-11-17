// TODO(custom): non-interactive person row; ListItem always looks clickable.

import type { Contact } from './data';
import { PersonAvatar } from './person-avatar';

/** The people at the customer: who they are first, their role and address quieter under it. */
export function ContactsList({ contacts }: { contacts: Contact[] }) {
  return (
    <ul className="gap-ws-9 flex flex-col">
      {contacts.map((contact) => (
        <li key={contact.email} className="gap-ws-7 flex items-center">
          <PersonAvatar name={contact.name} initials={contact.initials} color={contact.color} />
          <div className="flex min-w-0 flex-col">
            <span className="typography-label-strong-sm text-ws-static-strong truncate">
              {contact.name}
            </span>
            <span className="typography-caption-md text-ws-static-subtle truncate">
              {contact.role} · {contact.email}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
