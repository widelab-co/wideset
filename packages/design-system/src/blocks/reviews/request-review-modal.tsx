import { Button, Modal } from '@wideset/react';
import { useId } from 'react';

import { type ReviewRequest, workspace } from './data';
import { RequestForm } from './request-form';

type RequestReviewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requests: ReviewRequest[];
  onSend: (request: ReviewRequest, message: string) => void;
};

/**
 * "Request a review": a short form over the page. The form lives in the body and the actions in
 * the footer, the submit button pointing at the form by id; the modal's one filled button names
 * what it does. The form is unmounted with the modal, so it opens empty every time.
 */
export function RequestReviewModal({
  open,
  onOpenChange,
  requests,
  onSend,
}: RequestReviewModalProps) {
  const formId = useId();

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Request a review</Modal.Title>
          <Modal.Description>
            Orbit e-mails the contact on the deal a link to rate {workspace.name} and write a few
            words.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <RequestForm id={formId} requests={requests} onSend={onSend} />
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="secondary" preset="border">
              Cancel
            </Button>
          </Modal.Close>
          <Button type="submit" form={formId}>
            Send request
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
