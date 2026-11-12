// TODO(custom): what the session left running in the background, as rows (state mark, name, what it is, time, Stop); Wideset has no process or subagent row.
import { Button, Card } from '@wideset/react';
import { useId, useState } from 'react';

import type { BackgroundRun } from './tasks-data';
import { formatElapsed } from './tasks-format';
import { InlineCode } from './tasks-inline-code';
import { TasksStateMark } from './tasks-state-mark';

type TasksBackgroundProps = {
  runs: BackgroundRun[];
  /** Seconds since the pane opened: what the running times count on. */
  elapsed: number;
};

/**
 * What runs beside the plan, in a card like it: the dev server and the subagents, each with the
 * plan's state mark, its name, a line saying what it is and where it has got to, and its time
 * (still counting while it runs, the time it took once done). What is running can be stopped:
 * Stop is bordered, never filled, since the session's composer owns the screen's one filled
 * button. A stopped run stays in the list, grey, so the list does not jump; the stop is said
 * aloud.
 */
export function TasksBackground({ runs, elapsed }: TasksBackgroundProps) {
  const titleId = useId();
  const [stopped, setStopped] = useState<string[]>([]);
  // Plain text for a spoken name: the backticks only mark what is set as code.
  const nameOf = (run: BackgroundRun) => run.title.replaceAll('`', '');

  return (
    <Card role="region" aria-labelledby={titleId}>
      <Card.Header>
        <h3 id={titleId} className="typography-label-strong-md text-ws-static-strong">
          Background
        </h3>
      </Card.Header>
      <ul>
        {runs.map((run) => {
          const state = stopped.includes(run.id) ? 'stopped' : run.state;
          return (
            <li
              key={run.id}
              className="gap-ws-5 px-ws-11 py-ws-7 border-ws-static-base flex items-start border-b last:border-b-0"
            >
              <TasksStateMark state={state} />
              <div className="flex min-w-0 flex-1 flex-col">
                <span
                  className={
                    state === 'running'
                      ? 'typography-label-strong-sm text-ws-static-strong'
                      : 'typography-label-sm text-ws-static-base'
                  }
                >
                  <InlineCode text={run.title} />
                </span>
                <span className="typography-caption-md text-ws-static-subtle text-pretty">
                  <InlineCode text={run.detail} />
                </span>
              </div>
              <span className="typography-label-sm text-ws-static-subtle shrink-0 tabular-nums">
                {state === 'stopped' ? (
                  'Stopped'
                ) : (
                  <>
                    <span className="sr-only">
                      {state === 'running' ? 'Running for ' : 'Took '}
                    </span>
                    {formatElapsed(run.seconds + (state === 'running' ? elapsed : 0))}
                  </>
                )}
              </span>
              {state === 'running' && (
                <Button
                  variant="secondary"
                  preset="border"
                  size="sm"
                  aria-label={`Stop: ${nameOf(run)}`}
                  onClick={() => setStopped([...stopped, run.id])}
                  className="-my-ws-4 ml-ws-3 shrink-0"
                >
                  Stop
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      <p role="status" className="sr-only">
        {stopped.length > 0 &&
          `${nameOf(runs.find((run) => run.id === stopped.at(-1)) ?? runs[0])} stopped`}
      </p>
    </Card>
  );
}
