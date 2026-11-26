import { Button } from '@wideset/react';
import { useState } from 'react';

import { SetupAccountModal } from './setup-account-modal';

/** Stepper modal: a setup in steps over the page, here over an empty page that reopens it. */
export default function ModalStepperBlock() {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-ws-static-foreground flex h-dvh items-center justify-center">
      <Button variant="secondary" preset="border" onClick={() => setOpen(true)}>
        Set up account
      </Button>
      <SetupAccountModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
