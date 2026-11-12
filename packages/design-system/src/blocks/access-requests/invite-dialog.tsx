import { Button, FormField, Modal, Select, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import { type Role, ROLES, workspace } from './data';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Inviting one person: the address, the role (Member unless changed, with what it may do under
 * it) and Send. It is a form, so Enter sends; nothing goes out until the address is an e-mail
 * address that has no invitation yet and is not blocked. The error waits for the first send.
 */
export function InviteDialog({
  open,
  onOpenChange,
  invited,
  blocked,
  onInvite,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Addresses with an invitation already. */
  invited: string[];
  /** Addresses nobody may invite until they are unblocked. */
  blocked: string[];
  onInvite: (email: string, role: Role) => void;
}) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('member');
  const [tried, setTried] = useState(false);

  const address = email.trim().toLowerCase();
  const error = !address
    ? 'Enter an e-mail address.'
    : !EMAIL.test(address)
      ? 'Enter an e-mail address like name@company.com.'
      : invited.includes(address)
        ? `${address} has an invitation already. Resend it from the Invitations tab.`
        : blocked.includes(address)
          ? `${address} is blocked. Unblock it on the Blocked tab first.`
          : undefined;

  const send = (event: FormEvent) => {
    event.preventDefault();
    setTried(true);
    if (error) {
      document.getElementById(`${id}-email`)?.focus();
      return;
    }
    onInvite(address, role);
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setEmail('');
          setRole('member');
          setTried(false);
        }
        onOpenChange(next);
      }}
    >
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Invite to {workspace.name}</Modal.Title>
          <Modal.Description>
            They get an e-mail with a link to join. It works for 7 days.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <form id={id} noValidate onSubmit={send} className="gap-ws-11 flex flex-col">
            <FormField label="E-mail" htmlFor={`${id}-email`} errorText={tried ? error : undefined}>
              <TextInput
                id={`${id}-email`}
                type="email"
                autoComplete="off"
                placeholder="name@lumenstudio.co"
                variant={tried && error ? 'danger' : 'primary'}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormField>
            <FormField
              label="Role"
              htmlFor={`${id}-role`}
              helperText={ROLES.find((option) => option.value === role)!.hint}
            >
              <Select
                id={`${id}-role`}
                className="w-full"
                options={ROLES}
                value={role}
                onValueChange={(value) => setRole(value as Role)}
              />
            </FormField>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="secondary" preset="border">
              Cancel
            </Button>
          </Modal.Close>
          <Button type="submit" form={id}>
            Send invitation
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
