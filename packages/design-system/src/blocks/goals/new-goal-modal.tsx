import { Button, Modal } from '@wideset/react';
import { useId } from 'react';

import { type Goal, QUARTER } from './data';
import { NewGoalForm } from './new-goal-form';

type NewGoalModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (goal: Omit<Goal, 'id'>) => void;
};

/**
 * "New goal": a short form over the page. The form lives in the body and the actions in the
 * footer, the submit button pointing at the form by id; the modal's one filled button names what
 * it does. The form is unmounted with the modal, so it opens empty every time, focus in the name.
 */
export function NewGoalModal({ open, onOpenChange, onAdd }: NewGoalModalProps) {
  const formId = useId();

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById(`${formId}-name`)?.focus();
        }}
      >
        <Modal.Header>
          <Modal.Title>New goal</Modal.Title>
          <Modal.Description>
            A goal for the team in {QUARTER.label}. Orbit counts it from the deals and activity
            logged against it.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <NewGoalForm id={formId} onAdd={onAdd} />
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="secondary" preset="border">
              Cancel
            </Button>
          </Modal.Close>
          <Button type="submit" form={formId}>
            Add goal
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
