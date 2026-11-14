// TODO(custom): page header (an editable title with its state, a line of description, the actions on the right); no PageHeader in Wideset.
import { RiPlayLine } from '@remixicon/react';
import { Button, StatusBadge, Switch } from '@wideset/react';
import { useId } from 'react';

import { WorkflowName } from './workflow-name';

export type WorkflowState = 'draft' | 'on' | 'off';

const BADGE = {
  draft: { label: 'Draft', color: 'neutral' },
  on: { label: 'On', color: 'positive' },
  off: { label: 'Off', color: 'notice' },
} as const;

/**
 * The workflow's header, across the canvas and the panel: its name (edited in place) with its
 * state, what starts it, and on the right the switch that turns it on, the page's one primary
 * control, then Test run. While a step is unfinished the switch is locked and says why beside it.
 */
export function WorkflowHeader({
  name,
  onNameChange,
  description,
  state,
  unfinished,
  onSwitch,
  onTestRun,
}: {
  name: string;
  onNameChange: (name: string) => void;
  /** One line: what starts the workflow. */
  description: string;
  state: WorkflowState;
  /** Steps that cannot run yet. */
  unfinished: number;
  onSwitch: (on: boolean) => void;
  onTestRun: () => void;
}) {
  const reasonId = useId();
  const badge = BADGE[state];
  // A workflow that is on can always be turned off.
  const locked = unfinished > 0 && state !== 'on';

  return (
    <header className="gap-ws-12 px-ws-11 py-ws-9 border-ws-static-subtle flex shrink-0 flex-wrap items-center justify-between border-b">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <div className="gap-ws-5 flex min-w-0 items-center">
          <WorkflowName value={name} onChange={onNameChange} />
          <StatusBadge size="lg" color={badge.color}>
            {badge.label}
          </StatusBadge>
        </div>
        <p className="typography-body-md text-ws-static-subtle">{description}</p>
      </div>

      <div className="gap-ws-9 flex items-center">
        {unfinished > 0 && (
          <p id={reasonId} className="typography-body-sm text-ws-static-subtle">
            {/* Locked, it says what unlocks it; on, what will not run yet. */}
            {locked
              ? `Finish ${unfinished === 1 ? '1 step' : `${unfinished} steps`} to turn it on`
              : `${unfinished === 1 ? '1 step' : `${unfinished} steps`} to finish`}
          </p>
        )}
        <Switch
          label="Workflow on"
          labelPosition="left"
          checked={state === 'on'}
          disabled={locked}
          aria-describedby={unfinished > 0 ? reasonId : undefined}
          onCheckedChange={onSwitch}
        />
        <Button variant="secondary" preset="border" size="sm" onClick={onTestRun}>
          <Button.Icon icon={RiPlayLine} />
          Test run
        </Button>
      </div>
    </header>
  );
}
