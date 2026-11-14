import { Button, Modal } from '@wideset/react';

type DeleteDialogProps = {
  /** Kept while the dialog closes, so its words do not change under the fade. */
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

/**
 * Deleting a customer, the one action in the menu that cannot be undone: it asks once, says what
 * goes with the record, and points to Archive, which can. The red button names what it deletes.
 */
export function DeleteDialog({ name, open, onOpenChange, onConfirm }: DeleteDialogProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{`Delete ${name}?`}</Modal.Title>
          <Modal.Description>
            Its contacts, deals, notes and activity are deleted with it, for everyone in the
            workspace. To keep them but take it off the list, archive it instead.
          </Modal.Description>
        </Modal.Header>
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
              onConfirm();
            }}
          >
            Delete customer
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
