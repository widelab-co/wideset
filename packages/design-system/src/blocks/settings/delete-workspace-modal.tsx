import { Button, FormField, Modal, TextInput } from '@wideset/react';
import { useId, useState } from 'react';

import { workspace } from './data';

const count = (value: number) => value.toLocaleString('en');

/**
 * Deleting the workspace: a high-stakes delete, so the danger button stays disabled until the
 * workspace's name is typed. Cancel comes first and Enter never deletes.
 */
export function DeleteWorkspaceModal({
  workspaceName,
  onDelete,
}: {
  workspaceName: string;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const inputId = useId();
  const matches = typed.trim() === workspaceName;

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
          Delete workspace
        </Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Delete {workspaceName}?</Modal.Title>
          <Modal.Description>
            Its {count(workspace.customers)} customers, {count(workspace.deals)} deals and{' '}
            {count(workspace.invoices)} invoices are deleted for good, and all {workspace.members}{' '}
            members lose access at once.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <FormField label={`To confirm, type “${workspaceName}”`} htmlFor={inputId}>
            <TextInput
              id={inputId}
              size="sm"
              autoComplete="off"
              spellCheck={false}
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
            />
          </FormField>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button size="sm" variant="secondary" preset="border">
              Cancel
            </Button>
          </Modal.Close>
          <Button
            size="sm"
            variant="danger"
            disabled={!matches}
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            Delete workspace
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
