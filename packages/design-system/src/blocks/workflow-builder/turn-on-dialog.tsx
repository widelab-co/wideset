import { Button, StatusModal } from '@wideset/react';
import type { RefObject } from 'react';

/**
 * Asked once, the first time the workflow is turned on: what will start happening, and that
 * deals already in the stage are left alone. Later the switch applies at once. It opens from the
 * switch, not a trigger, so on close focus goes back to `returnFocusRef`.
 */
export function TurnOnDialog({
  stage,
  open,
  onOpenChange,
  onConfirm,
  returnFocusRef,
}: {
  stage: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}) {
  return (
    <StatusModal status="information" open={open} onOpenChange={onOpenChange}>
      <StatusModal.Content
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocusRef.current?.focus();
        }}
      >
        <StatusModal.Title>Turn on this workflow?</StatusModal.Title>
        <StatusModal.Body>
          From now on, every deal that moves to {stage} runs its steps: messages and e-mails go out
          and tasks are created. Deals already in {stage} are left alone.
        </StatusModal.Body>
        <StatusModal.Footer>
          <StatusModal.Close asChild>
            <Button variant="secondary" preset="border">
              Cancel
            </Button>
          </StatusModal.Close>
          <Button
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
          >
            Turn on
          </Button>
        </StatusModal.Footer>
      </StatusModal.Content>
    </StatusModal>
  );
}
