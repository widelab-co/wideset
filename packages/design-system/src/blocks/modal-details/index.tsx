import { Button } from '@wideset/react';
import { useState } from 'react';

import { orders } from './data';
import { OrderDetailsModal } from './order-details-modal';

/** Details modal: a record read over the page, here over an empty page that reopens it. */
export default function ModalDetailsBlock() {
  const [open, setOpen] = useState(true);
  // The middle order of three, so both steps in the footer have somewhere to go.
  const [index, setIndex] = useState(1);

  return (
    <div className="bg-ws-static-foreground flex h-dvh items-center justify-center">
      <Button variant="secondary" preset="border" onClick={() => setOpen(true)}>
        Open order
      </Button>
      <OrderDetailsModal
        order={orders[index]}
        open={open}
        onOpenChange={setOpen}
        onPrevious={index > 0 ? () => setIndex(index - 1) : undefined}
        onNext={index < orders.length - 1 ? () => setIndex(index + 1) : undefined}
      />
    </div>
  );
}
