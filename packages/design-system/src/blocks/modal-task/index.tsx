import { Button } from '@wideset/react';
import { useState } from 'react';

import { task } from './data';
import { TaskModal } from './task-modal';

/** Task modal: a task opened over the page, here over an empty page that reopens it. */
export default function ModalTaskBlock() {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-ws-static-foreground flex h-dvh items-center justify-center">
      <Button variant="secondary" preset="border" onClick={() => setOpen(true)}>
        Open task
      </Button>
      <TaskModal task={task} open={open} onOpenChange={setOpen} />
    </div>
  );
}
