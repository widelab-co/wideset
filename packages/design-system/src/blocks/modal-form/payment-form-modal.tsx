import { RiArrowLeftLine } from '@remixicon/react';
import { Button, IconButton, Modal } from '@wideset/react';
import { useId } from 'react';

import { PRODUCT, WORKSPACE } from './data';
import { KeyboardHints } from './keyboard-hints';
import { PaymentForm } from './payment-form';

type PaymentFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Figma's Modal `Type=Form`: a short form that only makes sense on its own, here adding a card.
 * The header leads back to where the modal was opened from, the form scrolls between the header
 * and the footer when the window is short, and the actions stay in the footer: the submit button
 * points at the form by id. Focus starts in the first field; Esc, Cancel and the X close it.
 */
export function PaymentFormModal({ open, onOpenChange }: PaymentFormModalProps) {
  const id = useId();

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById(`${id}-number`)?.focus();
        }}
      >
        <Modal.Header className="gap-ws-9 flex-row">
          <Modal.Close asChild>
            <IconButton
              variant="secondary"
              preset="border"
              size="sm"
              icon={RiArrowLeftLine}
              aria-label="Back to billing"
            />
          </Modal.Close>
          <div className="min-w-0 flex-1">
            <Modal.Title>Add payment method</Modal.Title>
            <Modal.Description>Pays for {WORKSPACE}’s plan.</Modal.Description>
          </div>
        </Modal.Header>
        <Modal.Body className="gap-ws-11 flex flex-col">
          <p className="typography-body-md text-ws-static-subtle">
            By providing your card information, you allow {PRODUCT} to charge your card for future
            payments in accordance with their terms.
          </p>
          <PaymentForm id={id} onSubmit={() => onOpenChange(false)} />
        </Modal.Body>
        <Modal.Footer className="items-center">
          <p className="typography-body-md text-ws-static-subtle mr-ws-9 min-w-0 flex-1">
            Charged monthly, cancel any time.
          </p>
          <Modal.Close asChild>
            <Button variant="secondary" preset="border">
              Cancel
            </Button>
          </Modal.Close>
          <Button type="submit" form={id}>
            Save card
          </Button>
        </Modal.Footer>
        <Modal.Footer variant="extension" className="items-center">
          <KeyboardHints />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
