// TODO(custom): one tool call as a transcript row (how it went, what it did, what came of it, its detail under it); Wideset has no step, log or tool-call part.
import { cn } from '@wideset/react';
import { useState } from 'react';

import { ApprovalCard } from './approval-card';
import { Fold } from './fold';
import { Inline } from './inline';
import type { ApprovalAnswer, Step, StepStatus } from './model';
import { ARRIVE } from './motion';
import { Row } from './row';
import { StepDetail } from './step-detail';
import { StepMark } from './step-mark';

const ALLOWED: Record<ApprovalAnswer, string | undefined> = {
  once: 'Allowed once',
  always: 'Always allowed',
  denied: undefined,
};

/** The result takes colour only where the step needs a look. */
const TONE: Partial<Record<StepStatus, string>> = {
  failed: 'text-ws-semantic-negative',
  waiting: 'text-ws-semantic-notice',
};

/** What a step says at its end: nothing while it runs, then its result and how it was allowed. */
function resultOf({ status, result, approval }: Step) {
  if (status === 'running') return undefined;
  if (status === 'waiting') return 'Waiting for you';
  if (status === 'skipped') return result ?? 'Skipped';
  return [result, approval?.answer && ALLOWED[approval.answer]].filter(Boolean).join(' · ');
}

type StepRowProps = {
  step: Step;
  /** The Verbose view: the detail starts open. */
  defaultOpen: boolean;
  /** Its turn is running: the row arrives with a short rise and its spinner turns into a check. */
  live: boolean;
  /** Inside a group, which shows the approval itself. */
  nested?: boolean;
  onAnswer: (stepId: string, answer: ApprovalAnswer) => void;
};

/**
 * A step: the mark for how it went, the verb and its object, a quiet result. Once it has ended it
 * opens to its detail. While it waits for permission the approval sits under it, and folds away
 * when answered, leaving the row.
 */
export function StepRow({ step, defaultOpen, live, nested = false, onAnswer }: StepRowProps) {
  const [open, setOpen] = useState(defaultOpen);
  const ended = step.status === 'done' || step.status === 'failed';
  const detail = ended ? step.detail : undefined;
  const result = resultOf(step);

  return (
    <div className={cn(live && ARRIVE)}>
      <Row
        mark={<StepMark status={step.status} live={live} />}
        open={open}
        onToggle={detail ? () => setOpen(!open) : undefined}
      >
        <span
          className={cn(
            'min-w-0 truncate',
            step.status === 'skipped' ? 'text-ws-static-subtle' : 'text-ws-static-base',
          )}
        >
          <Inline text={step.status === 'running' ? (step.active ?? step.label) : step.label} />
        </span>
        {result && (
          <span
            className={cn('shrink-0 tabular-nums', TONE[step.status] ?? 'text-ws-static-subtle')}
          >
            {result}
          </span>
        )}
      </Row>
      {step.approval && !nested && (
        <Fold open={step.status === 'waiting'}>
          <ApprovalCard approval={step.approval} onAnswer={(answer) => onAnswer(step.id, answer)} />
        </Fold>
      )}
      {detail && (
        <Fold open={open}>
          <StepDetail detail={detail} />
        </Fold>
      )}
    </div>
  );
}
