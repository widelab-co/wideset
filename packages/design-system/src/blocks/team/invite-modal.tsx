// TODO(custom): e-mails typed into a TextInput, comma-separated; no token/chip input in Wideset.
import { Button, FormField, Modal, Select, Textarea, TextInput } from '@wideset/react';
import { type FormEvent, useId, useState } from 'react';

import { type Invitation, ROLE_HINT, ROLE_OPTIONS, workspace } from './data';

type InviteRole = Invitation['role'];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Inviting people: their e-mail addresses, the role they join with and an optional note. The
 * form checks the addresses before anything is sent, and says which one is wrong.
 */
export function InviteModal({
  open,
  onOpenChange,
  taken,
  onInvite,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Addresses already in the workspace or invited. */
  taken: string[];
  onInvite: (emails: string[], role: InviteRole) => void;
}) {
  const id = useId();
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState<InviteRole>('member');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const close = (next: boolean) => {
    onOpenChange(next);
    if (next) return;
    setEmails('');
    setRole('member');
    setMessage('');
    setError('');
  };

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
    if (!list.length) setError('Enter at least one e-mail address.');
    else if (invalid) setError(`“${invalid}” is not an e-mail address.`);
    else if (existing) setError(`${existing} is already in ${workspace.name} or invited.`);
    else {
      onInvite(list, role);
      close(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={close}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Invite people to {workspace.name}</Modal.Title>
          <Modal.Description>
            Each person gets an e-mail with a link to join. The link works for 7 days.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <form id={`${id}-form`} noValidate onSubmit={send} className="gap-ws-11 flex flex-col">
            <FormField
              label="E-mail addresses"
              htmlFor={`${id}-emails`}
              helperText="Separate several addresses with commas."
              errorText={error}
            >
              <TextInput
                id={`${id}-emails`}
                size="sm"
                variant={error ? 'danger' : 'primary'}
                placeholder="name@lumen.studio"
                value={emails}
                onChange={(event) => {
                  setEmails(event.target.value);
                  setError('');
                }}
              />
            </FormField>
            <FormField label="Role" htmlFor={`${id}-role`} helperText={ROLE_HINT[role]}>
              <Select
                id={`${id}-role`}
                size="sm"
                className="w-full"
                options={ROLE_OPTIONS}
                value={role}
                onValueChange={(value) => setRole(value as InviteRole)}
              />
            </FormField>
            <FormField label="Message" suffix="Optional" htmlFor={`${id}-message`}>
              <Textarea
                id={`${id}-message`}
                rows={3}
                placeholder="A line to go with the invitation"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </FormField>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button size="sm" variant="secondary" preset="border">
              Cancel
            </Button>
          </Modal.Close>
          <Button size="sm" type="submit" form={`${id}-form`}>
            Send invitations
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
