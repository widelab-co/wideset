import { Avatar, Button } from '@wideset/react';
import { useState } from 'react';

import { GanttChart } from './chart';
import { campaign, viewers } from './data';
import { type TaskDetail, TaskSidepanel } from './task-sidepanel';
import { TopBar } from './top-bar';

/**
 * Gantt, a takeover in the Flat direction: a window over the app with a top bar to leave by,
 * people's work on a timeline, and the task side panel open beside it.
 */
export default function Gantt() {
  const [open, setOpen] = useState(true);
  const [task, setTask] = useState<TaskDetail>(campaign);

  const openTask = (title: string) => {
    setTask({ ...campaign, title });
    setOpen(true);
  };

  return (
    <div className="bg-ws-static-foreground flex h-dvh flex-col">
      <TopBar />
      <main className="flex min-h-0 flex-1 flex-col">
        <div className="px-ws-11 pt-ws-13 pb-ws-11 flex shrink-0 items-center justify-between">
          <h1 className="typography-subtitle-md text-ws-static-strong">Marketing</h1>
          <div className="gap-ws-12 flex items-center">
            <Avatar.Group size="md" className="w-auto">
              {viewers.map((viewer) => (
                <Avatar key={viewer.name} initials={viewer.initials} color={viewer.color} />
              ))}
              <Avatar />
            </Avatar.Group>
            <div className="gap-ws-5 flex items-center">
              <Button variant="secondary" preset="border" size="sm">
                Today
              </Button>
              <Button variant="secondary" size="sm">
                Publish
              </Button>
            </div>
          </div>
        </div>
        <GanttChart onOpenTask={openTask} />
      </main>
      <TaskSidepanel task={task} open={open} onOpenChange={setOpen} />
    </div>
  );
}
