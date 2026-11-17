import { Button, FormField, Modal, TextInput } from '@wideset/react';
import { useId, useState } from 'react';

import { type Person, workspace } from './data';

/**
 * Declining and blocking a request: the dialog says what blocking does before anything happens,
 * takes an optional reason (shown on the Blocked tab, to admins only) and confirms with the one
 * danger button. Cancel comes first; Enter in the reason does not block.
 */
export function BlockDialog({
  person,
  open,
  onOpenChange,
  onBlock,
}: {
  /** Kept while the dialog closes, so its words do not vanish under the fade. */
  person: Person;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBlock: (reason: string) => void;
}) {
  const reasonId = useId();
  const [reason, setReason] = useState('');

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        if (next) setReason('');
        onOpenChange(next);
      }}
    >
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Decline and block {person.name}?</Modal.Title>
          <Modal.Description>
            {person.email} can no longer ask to join {workspace.name}, and nobody can invite that
            address until an admin unblocks it on the Blocked tab. {person.name} is not told.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <FormField
            label="Reason"
            suffix="(optional)"
            htmlFor={reasonId}
            helperText="Only admins see it, beside the name on the Blocked tab."
          >
            <TextInput
              id={reasonId}
              autoComplete="off"
              placeholder="Not part of Lumen Studio"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
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
            onClick={() => {
              onOpenChange(false);
              onBlock(reason.trim());
            }}
          >
            Decline and block
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
