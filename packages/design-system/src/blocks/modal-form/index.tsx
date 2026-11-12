import { Button } from '@wideset/react';
import { useState } from 'react';

import { PaymentFormModal } from './payment-form-modal';

/** Form modal: a short form over the page, here over an empty page that reopens it. */
export default function ModalFormBlock() {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-ws-static-foreground flex h-dvh items-center justify-center">
      <Button variant="secondary" preset="border" onClick={() => setOpen(true)}>
        Add payment method
      </Button>
      <PaymentFormModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
