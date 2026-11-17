import { Button, Modal } from '@wideset/react';

import { workspace } from './data';

/**
 * Deactivating: it can be undone by signing in again and deletes nothing, so the dialog only
 * says what happens meanwhile and confirms with an ordinary filled button, not a red one.
 */
export function DeactivateAccountModal({ onDeactivate }: { onDeactivate: () => void }) {
  return (
    <Modal>
      <Modal.Trigger asChild>
        <Button size="sm" variant="secondary" preset="border">
          Deactivate
        </Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Deactivate your account?</Modal.Title>
          <Modal.Description>
            You are signed out on every device, Orbit stops e-mailing you and teammates in{' '}
            {workspace.name} see you as deactivated. Sign in again whenever you want to come back;
            nothing is deleted.
          </Modal.Description>
        </Modal.Header>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="secondary" preset="border">
              Cancel
            </Button>
          </Modal.Close>
          <Modal.Close asChild>
            <Button onClick={onDeactivate}>Deactivate account</Button>
          </Modal.Close>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
