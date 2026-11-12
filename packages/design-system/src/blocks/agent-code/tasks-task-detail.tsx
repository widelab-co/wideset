// TODO(custom): what a task did, as step rows (icon, verb and object, a quiet result) and the files it touched; Wideset has no step row or file reference.
import {
  RiFileAddLine,
  RiFileTextLine,
  RiPencilLine,
  RiRobot2Line,
  RiTerminalLine,
} from '@remixicon/react';
import { cn } from '@wideset/react';

import type { StepKind, Task, TouchedFile } from './tasks-data';
import { InlineCode } from './tasks-inline-code';

const ICON: Record<StepKind, typeof RiFileTextLine> = {
  read: RiFileTextLine,
  write: RiFileAddLine,
  edit: RiPencilLine,
  run: RiTerminalLine,
  agent: RiRobot2Line,
};

/** Git's letter for a change, in the colour of its meaning, as the Files pane marks its tree. */
const LETTER: Record<TouchedFile['change'], { letter: string; label: string; className: string }> =
  {
    added: { letter: 'A', label: 'added', className: 'text-ws-semantic-positive' },
    modified: { letter: 'M', label: 'modified', className: 'text-ws-semantic-info' },
  };

/**
 * A task opened: the steps taken for it so far, in the transcript's grammar (an icon for the kind
 * of step, the verb and its object, a quiet result at the end, in the failure's colour when it
 * is one), then the files it wrote or changed, each with git's letter. It hangs under the task's
 * title, and arrives a few pixels down with a fade, on the motion tokens.
 */
export function TasksTaskDetail({ id, task }: { id: string; task: Task }) {
  return (
    <div
      id={id}
      className="gap-ws-7 pt-ws-3 pb-ws-9 pl-ws-18 pr-ws-11 animate-in fade-in-0 ws-slide-in-from-top-3 flex flex-col duration-(--ws-motion-duration-fast) ease-(--ws-motion-ease-smooth-out)"
    >
      <ul aria-label="Steps" className="gap-ws-3 flex flex-col">
        {task.steps.map((step, index) => {
          const Icon = ICON[step.kind];
          return (
            <li key={index} className="gap-ws-5 typography-label-sm flex items-center">
              <Icon aria-hidden="true" className="size-ws-9 text-ws-static-subtle shrink-0" />
              <span className="text-ws-static-base min-w-0 flex-1 truncate">
                <InlineCode text={step.label} />
              </span>
              {step.result && (
                <span
                  className={cn(
                    'shrink-0 tabular-nums',
                    step.failed ? 'text-ws-semantic-negative' : 'text-ws-static-subtle',
                  )}
                >
                  {step.result}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {task.files.length > 0 && (
        <div className="gap-ws-3 flex flex-col">
          <h4 className="typography-caption-md text-ws-static-subtle">Files</h4>
          <ul className="gap-ws-3 flex flex-col">
            {task.files.map(({ path, change }) => {
              const at = path.lastIndexOf('/') + 1;
              const { letter, label, className } = LETTER[change];
              return (
                <li
                  key={path}
                  className="typography-body-sm tracking-ws-normal font-ws-mono flex items-center"
                >
                  {/* The folder gives way first: the name is what the eye looks for. */}
                  <span className="text-ws-static-subtle truncate">{path.slice(0, at)}</span>
                  <span className="text-ws-static-strong shrink-0">{path.slice(at)}</span>
                  <span
                    className={cn(
                      'typography-caption-strong-md font-ws-body pl-ws-5 ml-auto shrink-0',
                      className,
                    )}
                  >
                    <span aria-hidden="true">{letter}</span>
                    <span className="sr-only">, {label}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
