// TODO(custom): setup checklist (progress header, step rows: checkbox, title, why, one action); Wideset has no checklist.
import { Button, Card, Checkbox, cn, ProgressBar } from '@wideset/react';
import { useId } from 'react';

import type { Step } from './data';

type StepRowProps = {
  step: Step;
  done: boolean;
  /** The first step not done: the one place on the page with the filled button. */
  next: boolean;
  onDoneChange: (done: boolean) => void;
  onStart: () => void;
  className?: string;
};

/**
 * One step. To do, it says why and offers its one action; done, it shrinks to a quiet line with
 * what the step left behind. The checkbox ticks a step off by hand, in either direction.
 */
function StepRow({ step, done, next, onDoneChange, onStart, className }: StepRowProps) {
  const titleId = useId();
  const noteId = useId();

  return (
    <li className={cn('gap-ws-7 px-ws-11 py-ws-11 flex items-start', className)}>
      <Checkbox
        checked={done}
        onCheckedChange={(checked) => onDoneChange(checked === true)}
        aria-labelledby={titleId}
        aria-describedby={noteId}
      />
      <div className="gap-ws-2 flex min-w-0 flex-1 flex-col">
        <p
          id={titleId}
          className={cn(
            'typography-label-strong-sm',
            done ? 'text-ws-static-subtle' : 'text-ws-static-strong',
          )}
        >
          {step.title}
        </p>
        <p
          id={noteId}
          className={cn(
            done
              ? 'typography-label-sm text-ws-static-subtle'
              : 'typography-body-md text-ws-static-base',
          )}
        >
          {done ? step.result : step.why}
        </p>
      </div>
      {!done && (
        <Button
          size="sm"
          variant={next ? 'primary' : 'secondary'}
          preset={next ? 'filled' : 'border'}
          onClick={onStart}
          className="self-center"
        >
          {step.action}
        </Button>
      )}
    </li>
  );
}

type SetupChecklistProps = {
  workspaceName: string;
  steps: Step[];
  /** Ids of the steps done. */
  done: string[];
  onDoneChange: (id: string, done: boolean) => void;
  /** Opens the step's own flow (an import, the invite dialog, settings). */
  onStart: (id: string) => void;
};

/**
 * The setup checklist: how far the workspace is, then the steps in the order they pay off. The
 * first one not done is the next step and carries the page's one filled button.
 */
export function SetupChecklist({
  workspaceName,
  steps,
  done,
  onDoneChange,
  onStart,
}: SetupChecklistProps) {
  const count = steps.filter((step) => done.includes(step.id)).length;
  const next = steps.find((step) => !done.includes(step.id));

  return (
    <Card>
      <Card.Header>
        <div className="gap-ws-7 flex flex-col">
          <div className="gap-ws-9 flex items-baseline justify-between">
            <h2 className="typography-subtitle-xs text-ws-static-strong">
              {next ? `Set up ${workspaceName}` : `${workspaceName} is set up`}
            </h2>
            <p className="typography-label-sm text-ws-static-subtle tabular-nums">
              {count} of {steps.length} done
            </p>
          </div>
          <ProgressBar
            value={count}
            max={steps.length}
            variant={next ? 'default' : 'success'}
            aria-label="Setup progress"
            getValueLabel={(value, max) => `${value} of ${max} steps done`}
          />
        </div>
      </Card.Header>
      <ol aria-label="Setup steps">
        {steps.map((step, index) => (
          <StepRow
            key={step.id}
            step={step}
            done={done.includes(step.id)}
            next={step.id === next?.id}
            onDoneChange={(value) => onDoneChange(step.id, value)}
            onStart={() => onStart(step.id)}
            className={cn(index > 0 && 'border-ws-static-base border-t')}
          />
        ))}
      </ol>
    </Card>
  );
}
