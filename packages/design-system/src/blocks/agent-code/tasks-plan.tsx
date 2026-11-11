// TODO(custom): the agent's plan as rows that open onto what each task did (state mark, title, what it is doing now, time); Wideset has no task list, and Accordion has no state mark or row fill.
import { RiArrowRightSLine } from '@remixicon/react';
import { Card, cn } from '@wideset/react';
import { useId, useState } from 'react';

import type { Task } from './tasks-data';
import { formatElapsed } from './tasks-format';
import { InlineCode } from './tasks-inline-code';
import { TasksStateMark } from './tasks-state-mark';
import { TasksTaskDetail } from './tasks-task-detail';

type TaskRowProps = {
  task: Task;
  /** Seconds since the pane opened: what the running task's time counts on. */
  elapsed: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * One task: its state's mark, its title and, while it runs, what it is doing right now under the
 * title and for how long at the end. A task with something to show opens onto it: its title is a
 * button stretched over the whole row, the hover runs across it and the chevron turns. The one in
 * progress is the only strong title, so the eye lands on what is happening now. A task not yet
 * started has nothing to open, so it is a plain row.
 */
function TaskRow({ task, elapsed, open, onOpenChange }: TaskRowProps) {
  const detailId = useId();
  const opens = task.steps.length > 0;
  const title =
    task.state === 'running'
      ? 'typography-label-strong-sm text-ws-static-strong'
      : 'typography-label-sm text-ws-static-base';

  return (
    <li className="border-ws-static-base border-b last:border-b-0">
      <div
        className={cn(
          'gap-ws-5 px-ws-11 py-ws-7 relative flex items-start',
          opens && 'hover:bg-ws-dynamic-secondary-alpha-hover',
        )}
      >
        <TasksStateMark state={task.state} />
        <div className="flex min-w-0 flex-1 flex-col">
          {opens ? (
            <button
              type="button"
              aria-expanded={open}
              aria-controls={detailId}
              onClick={() => onOpenChange(!open)}
              className={cn(
                title,
                'focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default after:inset-ws-0 w-fit cursor-pointer text-left after:absolute',
              )}
            >
              <InlineCode text={task.title} />
            </button>
          ) : (
            <span className={title}>
              <InlineCode text={task.title} />
            </span>
          )}
          {task.now && (
            <span className="typography-caption-md text-ws-static-subtle text-pretty">
              <InlineCode text={task.now} />
            </span>
          )}
        </div>
        {task.seconds !== undefined && (
          <span className="typography-label-sm text-ws-static-subtle shrink-0 tabular-nums">
            <span className="sr-only">Running for </span>
            {formatElapsed(task.seconds + elapsed)}
          </span>
        )}
        {/* Rows that do not open keep the chevron's room, so the times stand in one column. */}
        <span className="size-ws-9 my-ws-2 shrink-0">
          {opens && (
            <RiArrowRightSLine
              aria-hidden="true"
              className={cn(
                'size-ws-9 text-ws-dynamic-secondary-default transition-transform duration-(--ws-motion-duration-quick) ease-(--ws-motion-ease-smooth-out)',
                open && 'rotate-90',
              )}
            />
          )}
        </span>
      </div>

      {opens && open && <TasksTaskDetail id={detailId} task={task} />}
    </li>
  );
}

type TasksPlanProps = {
  tasks: Task[];
  /** Seconds since the pane opened. */
  elapsed: number;
};

/**
 * The plan, the pane's main thing, in a card: a quiet count of what is done beside its title,
 * then the tasks in the agent's order, split by lines that run edge to edge. The marks down the
 * left already draw the progress, so the count is words, not a bar. The task in progress opens on
 * load; any number may be open at once.
 */
export function TasksPlan({ tasks, elapsed }: TasksPlanProps) {
  const titleId = useId();
  const [open, setOpen] = useState(() =>
    tasks.filter((task) => task.state === 'running').map((task) => task.id),
  );
  const done = tasks.filter((task) => task.state === 'done').length;

  return (
    <Card role="region" aria-labelledby={titleId}>
      <Card.Header>
        <div className="gap-ws-9 flex items-baseline justify-between">
          <h3 id={titleId} className="typography-label-strong-md text-ws-static-strong">
            Plan
          </h3>
          <p className="typography-label-sm text-ws-static-subtle tabular-nums">
            {done} of {tasks.length} done
          </p>
        </div>
      </Card.Header>
      <ol>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            elapsed={elapsed}
            open={open.includes(task.id)}
            onOpenChange={(next) =>
              setOpen(next ? [...open, task.id] : open.filter((id) => id !== task.id))
            }
          />
        ))}
      </ol>
    </Card>
  );
}
