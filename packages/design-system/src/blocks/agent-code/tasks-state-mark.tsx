// TODO(custom): how a task or a run stands, as one mark (to do, running, done, stopped); Wideset has no state mark and no spinner.
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
  RiLoader4Line,
  RiStopCircleLine,
} from '@remixicon/react';
import { cn } from '@wideset/react';

import type { RunState } from './tasks-data';

const MARK: Record<RunState, { Icon: typeof RiLoader4Line; className: string; label: string }> = {
  todo: { Icon: RiCheckboxBlankCircleLine, className: 'text-ws-static-subtle', label: 'To do' },
  running: {
    Icon: RiLoader4Line,
    className: 'text-ws-semantic-info motion-safe:animate-spin',
    label: 'Running',
  },
  done: { Icon: RiCheckboxCircleFill, className: 'text-ws-semantic-positive', label: 'Done' },
  stopped: { Icon: RiStopCircleLine, className: 'text-ws-static-subtle', label: 'Stopped' },
};

/**
 * A state as a mark at the head of a row, the size and family of the Checks pane's: an empty
 * circle to do, a check on a filled circle done, a loader that turns while the thing is really
 * still running (it stands still under reduced motion) and a stop sign once stopped by hand. The
 * colour is the meaning's: in progress, done; nothing to signal stays grey. It is a mark, not a
 * checkbox: the agent ticks its own tasks. The state is also said in words for screen readers.
 */
export function TasksStateMark({ state }: { state: RunState }) {
  const { Icon, className, label } = MARK[state];
  return (
    <>
      <Icon aria-hidden="true" className={cn('size-ws-11 shrink-0', className)} />
      <span className="sr-only">{label}:</span>
    </>
  );
}
