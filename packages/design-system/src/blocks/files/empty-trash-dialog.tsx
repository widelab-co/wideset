import { Button, StatusModal } from '@wideset/react';

import { formatFiles } from './format';

/**
 * The one step that cannot be undone, so it asks first: how many files go and that they go for
 * good. Cancel comes first; the danger button repeats the action's name.
 */
export function EmptyTrashDialog({
  count,
  open,
  onOpenChange,
  onConfirm,
}: {
  count: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <StatusModal status="notice" open={open} onOpenChange={onOpenChange}>
      <StatusModal.Content>
        <StatusModal.Title>Empty the trash?</StatusModal.Title>
        <StatusModal.Body>
          {formatFiles(count)} will be deleted for good, for everyone in the workspace. This can’t
          be undone.
        </StatusModal.Body>
        <StatusModal.Footer>
          <StatusModal.Close asChild>
            <Button variant="secondary" preset="border">
              Cancel
            </Button>
          </StatusModal.Close>
          <Button
            variant="danger"
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
          >
            Empty trash
          </Button>
        </StatusModal.Footer>
      </StatusModal.Content>
    </StatusModal>
  );
}
