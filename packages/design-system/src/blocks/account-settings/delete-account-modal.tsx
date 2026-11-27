import { Button, FormField, Modal, TextInput } from '@wideset/react';
import { useId, useState } from 'react';

import { workspace } from './data';

/**
 * Deleting the account: it cannot be undone, so the danger button stays disabled until the
 * account's e-mail address is typed. Cancel comes first and Enter never deletes.
 */
export function DeleteAccountModal({
  email,
  onDelete,
}: {
  /** The address to type: the one Maya signs in with. */
  email: string;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const inputId = useId();
  const matches = typed.trim().toLowerCase() === email;

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (next) setTyped('');
        setOpen(next);
      }}
    >
      <Modal.Trigger asChild>
        <Button size="sm" variant="danger" preset="border">
          Delete account
        </Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Delete your account?</Modal.Title>
          <Modal.Description>
            Your profile, notes and saved views are deleted for good, and you lose access to{' '}
            {workspace.name} at once. Deals and customers you own stay in the workspace for an admin
            to hand on.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <FormField label={`To confirm, type “${email}”`} htmlFor={inputId}>
            <TextInput
              id={inputId}
              type="email"
              autoComplete="off"
              spellCheck={false}
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
            />
          </FormField>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="secondary" preset="border">
              Cancel
            </Button>
          </Modal.Close>
          <Button
            variant="danger"
            disabled={!matches}
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            Delete account
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
