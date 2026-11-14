import { Button, Modal } from '@wideset/react';

import { PEOPLE, type Version } from './data';
import { formatWhen } from './format';

type RestoreDialogProps = {
  /** The older version to bring back; the dialog is open while there is one. */
  version?: Version;
  current: number;
  /** Unsaved edits in the editor, which restoring replaces. */
  unsaved: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (version: Version) => void;
};

/**
 * Asks before an older version comes back: whose version it is and when it was saved, that it
 * becomes a new version so the current one stays in the history, and, only when there are any,
 * that unsaved edits are lost. Nothing is deleted, so the button is the plain primary.
 */
export function RestoreDialog({
  version,
  current,
  unsaved,
  onOpenChange,
  onConfirm,
}: RestoreDialogProps) {
  return (
    <Modal open={version !== undefined} onOpenChange={onOpenChange}>
      {version && (
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Restore version {version.number}?</Modal.Title>
            <Modal.Description>
              {`The script goes back to how ${PEOPLE[version.by].name} saved it ${formatWhen(version.savedAt)}.`}
            </Modal.Description>
          </Modal.Header>
          <Modal.Body>
            {`It is saved as a new version, so version ${current} stays in the history and you can come back to it.`}
            {unsaved && ' Your unsaved changes will be lost.'}
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="secondary" preset="border">
                Cancel
              </Button>
            </Modal.Close>
            <Button
              onClick={() => {
                onOpenChange(false);
                onConfirm(version);
              }}
            >
              Restore version
            </Button>
          </Modal.Footer>
        </Modal.Content>
      )}
    </Modal>
  );
}
