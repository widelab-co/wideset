// TODO(custom): the invite row: several e-mails typed comma-separated (no token input in Wideset) and an error line under a field with no label (FormField needs a visible label, HelperText is not exported).
import { Button, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import { RoleMenu, type RoleOption } from './role-menu';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Inviting by e-mail: the address (or several, comma-separated), the role picked inside the
 * field, and the one primary action. Nothing is sent until every address is an e-mail address
 * and none of them has access already; the line under the field says which one is wrong.
 */
export function InviteForm<Role extends string>({
  roles,
  defaultRole,
  taken,
  onInvite,
}: {
  /** The roles a person can be invited with. */
  roles: RoleOption<Role>[];
  defaultRole: Role;
  /** Addresses that already have access or an invitation. */
  taken: string[];
  onInvite: (emails: string[], role: Role) => void;
}) {
  const errorId = useId();
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [error, setError] = useState('');

  const send = (event: FormEvent) => {
    event.preventDefault();
    const list = [
      ...new Set(
        emails
          .split(/[\s,;]+/)
          .map((email) => email.toLowerCase())
          .filter(Boolean),
      ),
    ];
    const invalid = list.find((email) => !EMAIL.test(email));
    const existing = list.find((email) => taken.includes(email));
    if (!list.length) setError('Enter an e-mail address.');
    else if (invalid) setError(`“${invalid}” is not an e-mail address.`);
    else if (existing) setError(`${existing} already has access or an invitation.`);
    else {
      onInvite(list, role);
      setEmails('');
    }
  };

  return (
    <form noValidate onSubmit={send} className="gap-ws-3 flex flex-col">
      <div className="gap-ws-5 flex">
        <TextInput
          className="min-w-0 flex-1"
          variant={error ? 'danger' : 'primary'}
          value={emails}
          onChange={(event) => {
            setEmails(event.target.value);
            setError('');
          }}
        >
          <TextInput.Input
            type="email"
            multiple
            placeholder="Enter e-mail address"
            aria-label="E-mail address"
            aria-describedby={error ? errorId : undefined}
          />
          {/* Figma's suffix holds a Button: the affix insets it like an icon button (4px). */}
          <TextInput.Suffix inner content="iconButton">
            <RoleMenu
              size="md"
              aria-label="Role"
              value={role}
              options={roles}
              onValueChange={setRole}
            />
          </TextInput.Suffix>
        </TextInput>
        <Button type="submit">Send invite</Button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="typography-body-sm text-ws-semantic-negative">
          {error}
        </p>
      )}
    </form>
  );
}
