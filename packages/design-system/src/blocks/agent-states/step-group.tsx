// TODO(custom): several steps in a row folded to one line ("Read 4 files") that opens to them; Wideset has no step, log or tool-call part.
import { cn } from '@wideset/react';
import { useState } from 'react';

import { ApprovalCard } from './approval-card';
import { Fold } from './fold';
import { Inline } from './inline';
import type { ApprovalAnswer, Block } from './model';
import { ARRIVE } from './motion';
import { Row } from './row';
import { StepMark } from './step-mark';
import { StepRow } from './step-row';

type StepGroupProps = {
  block: Extract<Block, { kind: 'steps' }>;
  /** The Verbose view: the group starts open, and so does each step's detail. */
  defaultOpen: boolean;
  live: boolean;
  onAnswer: (stepId: string, answer: ApprovalAnswer) => void;
};

/**
 * Steps that follow one another, as one line. While they run the line says what the current step
 * is doing, in place, so the transcript does not jump; when they are done it says what they came
 * to. It opens to the steps. An approval one of them waits for sits under the line, not inside
 * the fold, so it is never hidden.
 */
export function StepGroup({ block, defaultOpen, live, onAnswer }: StepGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const current = block.steps[block.steps.length - 1];
  const busy = current.status === 'running' || current.status === 'waiting';
  const status = busy
    ? current.status
    : block.steps.some((step) => step.status === 'failed')
      ? 'failed'
      : 'done';
  const label = !busy
    ? block.label
    : current.status === 'running'
      ? (current.active ?? current.label)
      : current.label;

  return (
    <div className={cn(live && ARRIVE)}>
      <Row
        mark={<StepMark status={status} live={live} />}
        open={open}
        onToggle={() => setOpen(!open)}
      >
        <span className="text-ws-static-base min-w-0 truncate">
          <Inline text={label} />
        </span>
        {current.status === 'waiting' && (
          <span className="text-ws-semantic-notice shrink-0">Waiting for you</span>
        )}
      </Row>
      {current.approval && (
        <Fold open={current.status === 'waiting'}>
          <ApprovalCard
            approval={current.approval}
            onAnswer={(answer) => onAnswer(current.id, answer)}
          />
        </Fold>
      )}
      <Fold open={open}>
        <div className="pl-ws-12">
          {block.steps.map((step) => (
            <StepRow
              key={step.id}
              step={step}
              defaultOpen={defaultOpen}
              live={live}
              nested
              onAnswer={onAnswer}
            />
          ))}
        </div>
      </Fold>
    </div>
  );
}
