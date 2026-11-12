// TODO(custom): one tool call as a transcript row (how it went, what it did, what came of it, its detail under it); Wideset has no step, log or tool-call part.
import { cn } from '@wideset/react';
import { type ReactNode, useEffect, useState } from 'react';

import { ApprovalCard } from './approval-card';
import { Fold } from './fold';
import { Inline } from './inline';
import type { ApprovalAnswer, CardBlock, Step, StepStatus } from './model';
import { ARRIVE } from './motion';
import { Row } from './row';
import { StepDetail } from './step-detail';
import { StepMark } from './step-mark';

/** Draws something of the block's own: a `card` block, or what a step carries under its detail. */
export type CardRender = (card: string, of: CardBlock | Step) => ReactNode;

const ALLOWED: Record<ApprovalAnswer, string | undefined> = {
  once: 'Allowed once',
  always: 'Always allowed',
  denied: 'Denied',
};

/** The result takes colour only where the step needs a look. */
const TONE: Partial<Record<StepStatus, string>> = {
  failed: 'text-ws-semantic-negative',
  waiting: 'text-ws-semantic-notice',
};

/** What a step says at its end: nothing while it runs, then its result and how it was allowed. */
function resultOf({ status, result, approval }: Step) {
  const allowed = approval?.answer && ALLOWED[approval.answer];
  if (status === 'running') return undefined;
  if (status === 'waiting') return 'Waiting for you';
  if (status === 'skipped') return allowed ?? result ?? 'Skipped';
  return [result, allowed].filter(Boolean).join(' · ');
}

/** A step's words for the state it is in: what it will do, is doing, or did. */
const labelOf = ({ status, label, active, pending }: Step) =>
  status === 'running' ? (active ?? label) : status === 'waiting' ? (pending ?? label) : label;

type StepRowProps = {
  step: Step;
  /** The Verbose view: the detail starts open. */
  defaultOpen: boolean;
  /** Its turn is running: the row arrives with a short rise and its spinner turns into a check. */
  live: boolean;
  /** Inside a group, which shows what the step waits for itself. */
  nested?: boolean;
  card?: CardRender;
  onAnswer: (stepId: string, answer: ApprovalAnswer) => void;
};

/**
 * A step: the mark for how it went, the verb and its object, a quiet result. Once it has ended it
 * opens to its detail and, under that, whatever the block hangs on it (what to do about it, the
 * way to its whole output). The step the turn stands at opens by itself, so what it needs from
 * you is in view. While it waits to be allowed it reads as what it will do ("Run", not "Ran")
 * and the approval sits under it; answered, that folds away and leaves the row.
 */
export function StepRow({ step, defaultOpen, live, nested = false, card, onAnswer }: StepRowProps) {
  const holding = Boolean(step.holding);
  const [open, setOpen] = useState(defaultOpen || holding);
  const ended = step.status === 'done' || step.status === 'failed';
  const detail = ended ? step.detail : undefined;
  // What the step waits with is the group's to show while it is inside one.
  const aside = step.card && !(nested && holding) ? card?.(step.card, step) : null;
  const result = resultOf(step);

  // The run has come to stand at this step: it opens.
  useEffect(() => {
    if (holding) setOpen(true);
  }, [holding]);

  return (
    <div className={cn(live && ARRIVE)}>
      <Row
        mark={<StepMark status={step.status} live={live} />}
        open={open}
        onToggle={detail || aside ? () => setOpen(!open) : undefined}
      >
        <span
          className={cn(
            'min-w-0 truncate',
            step.status === 'skipped' ? 'text-ws-static-subtle' : 'text-ws-static-base',
          )}
        >
          <Inline text={labelOf(step)} />
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
      {(detail || aside) && (
        <Fold open={open}>
          {detail && <StepDetail detail={detail} />}
          {aside && <div className="gap-ws-5 ml-ws-12 mt-ws-3 mb-ws-3 flex flex-col">{aside}</div>}
        </Fold>
      )}
    </div>
  );
}
