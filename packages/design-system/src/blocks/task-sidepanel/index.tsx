import { Button } from '@wideset/react';
import { useState } from 'react';

import { task } from './data';
import { TaskSidepanel } from './task-sidepanel';

/** Task side panel: a record's detail beside the page, here over an empty page that reopens it. */
export default function TaskSidepanelBlock() {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-ws-static-foreground flex h-dvh items-center justify-center">
      <Button variant="secondary" preset="border" onClick={() => setOpen(true)}>
        Open task
      </Button>
      <TaskSidepanel task={task} open={open} onOpenChange={setOpen} />
    </div>
  );
}
