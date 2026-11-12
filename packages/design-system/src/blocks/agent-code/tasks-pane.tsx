import { TasksBackground } from './tasks-background';
import { BACKGROUND, TASKS } from './tasks-data';
import { TasksPlan } from './tasks-plan';
import { useSeconds } from './tasks-use-seconds';

/**
 * The Tasks pane: what the agent is doing. Two cards, as the Checks pane has, scrolling inside
 * the pane: the plan first, its task in progress open on what it has done so far, then what runs
 * in the background. Everything still running counts its time on one clock; nothing here is
 * ticked by hand, so the pane has no checkbox and no filled button.
 */
export function TasksPane() {
  const elapsed = useSeconds();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="gap-ws-9 p-ws-11 flex flex-col">
          <TasksPlan tasks={TASKS} elapsed={elapsed} />
          <TasksBackground runs={BACKGROUND} elapsed={elapsed} />
        </div>
      </div>
    </div>
  );
}
