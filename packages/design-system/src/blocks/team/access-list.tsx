// TODO(custom): a person row (avatar, name, e-mail, role); Figma uses List Item flush and without hover, Wideset's ListItem always insets and reads as clickable.
import { Avatar } from '@wideset/react';
import { useId } from 'react';

import { RoleMenu, type RoleOption } from './role-menu';

export type AccessPerson<Role extends string = string> = {
  id: string;
  email: string;
  /** Name and initials are left out for someone invited who has not joined yet. */
  name?: string;
  initials?: string;
  role: Role;
  online?: boolean;
};

/**
 * "Who has access": the people and their roles, each role changed in its own row; someone invited
 * shows by their address until they join. The rows are not clickable, so they are plain list
 * items on ListItem's measures (32px avatar, 8px gap, 4px above and below), not ListItem. Past
 * five rows the list scrolls on its own, so the invite field above it stays in reach; the part
 * of the sixth row left in view shows there is more.
 */
export function AccessList<Role extends string>({
  people,
  roles,
  onRoleChange,
}: {
  people: AccessPerson<Role>[];
  /** Every role; a `fixed` one (the owner's) is only shown on whoever holds it. */
  roles: RoleOption<Role>[];
  onRoleChange: (person: AccessPerson<Role>, role: Role) => void;
}) {
  const id = useId();
  const assignable = roles.filter((role) => !role.fixed);

  return (
    <section className="gap-ws-7 flex flex-col">
      <h3 id={id} className="typography-body-md text-ws-static-subtle">
        Who has access
      </h3>
      <ul aria-labelledby={id} className="gap-ws-5 flex max-h-[18rem] flex-col overflow-y-auto">
        {people.map((person) => (
          <li key={person.id} className="gap-ws-5 py-ws-3 flex items-center">
            {person.initials ? (
              <Avatar
                aria-hidden="true"
                initials={person.initials}
                status={person.online ? 'online' : undefined}
              />
            ) : (
              <Avatar aria-hidden="true" />
            )}
            <div className="min-w-0 flex-1">
              <p className="typography-label-sm text-ws-dynamic-secondary-default truncate">
                {person.name ?? person.email}
              </p>
              <p className="typography-body-sm text-ws-static-subtle truncate">
                {person.name ? person.email : 'Invitation sent'}
              </p>
            </div>
            <RoleMenu
              aria-label={`Role of ${person.name ?? person.email}`}
              value={person.role}
              options={
                assignable.some((role) => role.value === person.role)
                  ? assignable
                  : roles.filter((role) => role.value === person.role)
              }
              onValueChange={(role) => onRoleChange(person, role)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
