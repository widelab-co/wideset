import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowUpSLine,
  RiMoreFill,
} from '@remixicon/react';
import { Button, IconButton, Modal, Switch, Tabs } from '@wideset/react';
import { useState } from 'react';

import { ActivityTimeline } from './activity-timeline';
import type { TaskDetail } from './data';
import { Hint, Key } from './keyboard-hint';
import { SubtaskList } from './subtask-list';
import { TaskProperties } from './task-properties';

type TaskModalProps = {
  task: TaskDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Figma's Modal `Type=Task`: a task opened over the page. The header and the keyboard hints stay
 * put and everything between them scrolls, so the modal never outgrows a short window. Ticking a
 * subtask moves the task's progress, which is the average of its subtasks.
 */
export function TaskModal({ task, open, onOpenChange }: TaskModalProps) {
  // Kept here, not in the switch: the modal's content unmounts when it closes.
  const [isPrivate, setIsPrivate] = useState(task.private);
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const progress = Math.round(
    subtasks.reduce((sum, subtask) => sum + (subtask.done ? 100 : (subtask.progress ?? 0)), 0) /
      subtasks.length,
  );

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      {/* The close button sits in the header row, beside the task's actions. */}
      <Modal.Content
        showCloseButton={false}
        // The dialog takes the focus, not its first control: a task is read from the top. It is
        // not a control, so it shows no ring (Popup's content does the same).
        className="outline-hidden"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          if (event.currentTarget instanceof HTMLElement) event.currentTarget.focus();
        }}
      >
        <div className="px-ws-12 py-ws-9 flex shrink-0 items-center justify-between">
          <Switch label="Private" checked={isPrivate} onCheckedChange={setIsPrivate} />
          <div className="gap-ws-5 flex items-center">
            <Button size="sm" variant="secondary" preset="border">
              Share
            </Button>
            <IconButton
              size="sm"
              variant="secondary"
              preset="border"
              icon={RiMoreFill}
              aria-label="More actions"
            />
            <Modal.Close />
          </div>
        </div>

        {/* The line over the footer is this region's, so it stays while the content scrolls. */}
        <div className="border-ws-static-base flex min-h-0 flex-1 flex-col overflow-y-auto border-b">
          <div className="px-ws-11 pt-ws-11 pb-ws-9 flex flex-col">
            <Modal.Title className="-mt-ws-2">{task.title}</Modal.Title>
            <Modal.Description className="mt-ws-4 pb-ws-0">{task.due}</Modal.Description>
          </div>

          <div className="px-ws-11 py-ws-8">
            <TaskProperties assignee={task.assignee} priority={task.priority} progress={progress} />
          </div>

          <div className="px-ws-11">
            <Button variant="primary" preset="border" size="sm">
              <Button.Icon icon={RiAddLine} />
              Complete
            </Button>
          </div>

          <div className="p-ws-11">
            <SubtaskList
              subtasks={subtasks}
              onToggle={(id, done) =>
                setSubtasks((list) =>
                  list.map((subtask) => (subtask.id === id ? { ...subtask, done } : subtask)),
                )
              }
            />
          </div>

          {/* Figma lays the grey (Static/Fill/Alpha/Subtle) straight over the modal's fill. */}
          <div className="bg-ws-static-alpha-subtle px-ws-11 py-ws-9 flex-1">
            <Tabs type="pills" size="sm" defaultValue="activity" className="gap-ws-11">
              <Tabs.List aria-label="Task sections">
                <Tabs.Item value="activity">
                  <Tabs.Label>Activity Log</Tabs.Label>
                </Tabs.Item>
                <Tabs.Item value="notes">
                  <Tabs.Label>Notes</Tabs.Label>
                </Tabs.Item>
              </Tabs.List>
              <Tabs.Content value="activity">
                <ActivityTimeline items={task.activity} />
              </Tabs.Content>
              <Tabs.Content value="notes">
                <p className="py-ws-5 typography-body-md text-ws-static-base">{task.notes}</p>
              </Tabs.Content>
            </Tabs>
          </div>
        </div>

        <Modal.Footer variant="extension">
          <div className="gap-ws-12 flex items-center">
            <Hint
              keys={
                <span className="gap-ws-3 flex">
                  <Key icon={RiArrowUpSLine} name="Up arrow" />
                  <Key icon={RiArrowDownSLine} name="Down arrow" />
                </span>
              }
            >
              Navigate
            </Hint>
            <Hint keys={<Key icon={RiArrowLeftLine} name="Left arrow" />}>Return to parent</Hint>
          </div>
          <Hint keys={<Key>esc</Key>}>Close</Hint>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
