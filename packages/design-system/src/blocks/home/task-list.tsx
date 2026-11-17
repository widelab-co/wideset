// TODO(custom): task checklist (progress, rows that tick off into a Done group, an add row); Wideset has no checklist or task row.
import { RiAddLine } from '@remixicon/react';
import { Card, Checkbox, cn, ProgressBar, StatusBadge, TextInput } from '@wideset/react';
import { type FormEvent, useEffect, useId, useRef, useState } from 'react';

import type { Task } from './data';
import { formatTime } from './format';

/** A row of the list: 44px, a step taller than the table's under it, inset like the card's title. */
const ROW = 'h-ws-17 gap-ws-7 px-ws-11 flex items-center';
/** A line between rows; the card's header and border close the list, so no line doubles them. */
const DIVIDER = 'border-ws-static-base border-t first:border-t-0';

type TaskRowProps = {
  task: Task;
  done: boolean;
  /** Due before today and still open: the one judgement in the list, so the one colour. */
  overdue: boolean;
  checkboxId: string;
  onDoneChange: (done: boolean) => void;
};

/**
 * One task. The row does one thing, so the whole row is the checkbox's label: one target, the
 * hover across it. Done, it goes quiet and struck through.
 */
function TaskRow({ task, done, overdue, checkboxId, onDoneChange }: TaskRowProps) {
  const titleId = `${checkboxId}-title`;

  return (
    <li className={DIVIDER}>
      <label
        htmlFor={checkboxId}
        className={cn(ROW, 'hover:bg-ws-dynamic-secondary-alpha-hover cursor-pointer')}
      >
        <Checkbox
          id={checkboxId}
          checked={done}
          onCheckedChange={(checked) => onDoneChange(checked === true)}
          aria-labelledby={titleId}
        />
        <span
          id={titleId}
          className={cn(
            'min-w-0 flex-1 truncate',
            done
              ? 'typography-label-sm text-ws-static-subtle line-through'
              : 'typography-label-strong-sm text-ws-static-strong',
          )}
        >
          {task.title}
        </span>
        <span className="typography-label-sm text-ws-static-subtle w-[10rem] shrink-0 truncate">
          {task.customer}
        </span>
        <span className="flex w-[5rem] shrink-0 justify-end">
          {overdue ? (
            <StatusBadge size="sm" color="negative">
              Overdue
            </StatusBadge>
          ) : (
            <span className="typography-label-sm text-ws-static-subtle tabular-nums">
              {task.due ? formatTime(task.due) : 'Today'}
            </span>
          )}
        </span>
      </label>
    </li>
  );
}

type TaskListProps = {
  tasks: Task[];
  /** Ids of the tasks done, in the order they were ticked. */
  done: string[];
  /** The calendar day it is (`2026-11-10`). */
  today: string;
  onDoneChange: (id: string, done: boolean) => void;
  onAdd: (title: string) => void;
};

/**
 * Today's tasks, the page's main thing and its first container: what is left on top, an add row
 * under it, what is done below. Ticking a task moves it to Done and moves the progress; unticking
 * brings it back. The focus follows the task, so the keyboard can undo the tick it just made.
 */
export function TaskList({ tasks, done, today, onDoneChange, onAdd }: TaskListProps) {
  const id = useId();
  const [draft, setDraft] = useState('');
  const moved = useRef<string | null>(null);

  const open = tasks.filter((task) => !done.includes(task.id));
  const finished = done.flatMap((taskId) => tasks.find((task) => task.id === taskId) ?? []);
  const checkboxId = (task: Task) => `${id}-${task.id}`;

  // A ticked row leaves one list and is drawn again in the other, which drops the focus.
  useEffect(() => {
    if (moved.current) document.getElementById(moved.current)?.focus();
    moved.current = null;
  }, [done]);

  const row = (task: Task, isDone: boolean) => (
    <TaskRow
      key={task.id}
      task={task}
      done={isDone}
      overdue={!isDone && task.due !== undefined && task.due.slice(0, 10) < today}
      checkboxId={checkboxId(task)}
      onDoneChange={(value) => {
        moved.current = checkboxId(task);
        onDoneChange(task.id, value);
      }}
    />
  );

  const add = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft('');
  };

  return (
    <Card role="region" aria-labelledby={`${id}-title`}>
      <Card.Header>
        <div className="gap-ws-9 flex items-center justify-between">
          <h2 id={`${id}-title`} className="typography-label-strong-md text-ws-static-strong">
            Today’s tasks
          </h2>
          <div className="gap-ws-7 flex items-center">
            <p role="status" className="typography-label-sm text-ws-static-subtle tabular-nums">
              {finished.length} of {tasks.length} done
            </p>
            {/* The bar fills its container: the container sets how small it is. */}
            <div className="w-[6rem]">
              <ProgressBar
                value={finished.length}
                max={tasks.length}
                variant={open.length ? 'default' : 'success'}
                aria-label="Tasks done today"
                getValueLabel={(value, max) => `${value} of ${max} tasks done`}
              />
            </div>
          </div>
        </div>
      </Card.Header>

      <ul aria-label="To do">
        {open.map((task) => row(task, false))}
        <li className={DIVIDER}>
          {/* Enter adds the task; an empty line adds nothing. The field's own inset puts its
              icon on the checkboxes' line. */}
          <form onSubmit={add} className={cn(ROW, 'px-ws-8')}>
            <TextInput
              preset="ghost"
              size="sm"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            >
              <TextInput.Prefix inner>
                <TextInput.Icon icon={RiAddLine} />
              </TextInput.Prefix>
              <TextInput.Input placeholder="Add a task" aria-label="Add a task for today" />
            </TextInput>
          </form>
        </li>
      </ul>

      {finished.length > 0 && (
        <>
          <h3
            id={`${id}-done`}
            className="typography-label-sm text-ws-static-subtle border-ws-static-base px-ws-11 pt-ws-9 pb-ws-5 border-y"
          >
            Done
          </h3>
          <ul aria-labelledby={`${id}-done`}>{finished.map((task) => row(task, true))}</ul>
        </>
      )}
    </Card>
  );
}
