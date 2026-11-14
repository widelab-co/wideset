import { Button, Modal } from '@wideset/react';

import { type Member, workspace } from './data';

/** Asks once before a member loses access; the safe way out comes first. */
export function RemoveMemberModal({
  member,
  open,
  onOpenChange,
  onRemove,
}: {
  /** Kept after closing, so the title does not empty while the dialog fades out. */
  member?: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: (member: Member) => void;
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            Remove {member?.name} from {workspace.name}?
          </Modal.Title>
          <Modal.Description>
            They lose access right away. The customers, deals and notes they own stay in the
            workspace.
          </Modal.Description>
        </Modal.Header>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button size="sm" variant="secondary" preset="border">
              Cancel
            </Button>
          </Modal.Close>
          <Modal.Close asChild>
            <Button size="sm" variant="danger" onClick={() => member && onRemove(member)}>
              Remove member
            </Button>
          </Modal.Close>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
