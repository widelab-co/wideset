import type { AccessPerson } from './access-list';
import type { RoleOption } from './role-menu';

export type Role = 'owner' | 'edit' | 'view';

/** Every role. Ownership is transferred, never given: it shows only on the owner. */
export const roles: RoleOption<Role>[] = [
  { value: 'owner', label: 'Owner', fixed: true },
  { value: 'view', label: 'Can view', hint: 'Reads and comments.' },
  { value: 'edit', label: 'Can edit', hint: 'Changes content and invites people.' },
];

/** Who can open the project when the modal opens, the owner first. */
export const people: AccessPerson<Role>[] = [
  {
    id: 'hana',
    name: 'Hana Kobayashi',
    initials: 'HK',
    email: 'hana@lumenstudio.co',
    role: 'owner',
    online: true,
  },
  {
    id: 'marcus',
    name: 'Marcus Bell',
    initials: 'MB',
    email: 'marcus@lumenstudio.co',
    role: 'view',
    online: true,
  },
  {
    id: 'priya',
    name: 'Priya Raman',
    initials: 'PR',
    email: 'priya@lumenstudio.co',
    role: 'view',
    online: true,
  },
];

/** The address people join the project by. */
export const link = 'join.orbit.so/r7c93kwp';
