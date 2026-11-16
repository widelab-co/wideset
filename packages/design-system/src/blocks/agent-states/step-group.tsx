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
import { type CardRender, StepRow } from './step-row';

type StepGroupProps = {
  block: Extract<Block, { kind: 'steps' }>;
  /** The Verbose view: the group starts open, and so does each step's detail. */
  defaultOpen: boolean;
  live: boolean;
  card?: CardRender;
  onAnswer: (stepId: string, answer: ApprovalAnswer) => void;
};

/**
 * How far a group came when it was cut short, in its own words: "Read 9 sources" stopped after
 * two reads "Read 2 of 9 sources".
 */
function partial(label: string, done: number, total: number) {
  // ponytail: the count is the first number in the label; a label without one gets it appended.
  const counted = label.replace(/\d+/, `${done} of ${total}`);
  return counted === label ? `${label} · ${done} of ${total}` : counted;
}

/**
 * Steps that follow one another, as one line. While they run the line says what the current step
 * is doing, in place, so the transcript does not jump; when they are done it says what they came
 * to, and stopped part-way it says how far they got. It opens to the steps. What one of them
 * waits for (an approval, something of the block's own) sits under the line, not inside the
 * fold, so it is never hidden.
 */
export function StepGroup({ block, defaultOpen, live, card, onAnswer }: StepGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const current = block.steps[block.steps.length - 1];
  const busy = current.status === 'running' || current.status === 'waiting';
  const finished = block.steps.filter(({ status }) => status === 'done' || status === 'failed');
  const status = busy
    ? current.status
    : block.steps.some((step) => step.status === 'failed')
      ? 'failed'
      : current.status === 'skipped'
        ? 'skipped'
        : 'done';
  const label =
    current.status === 'running'
      ? (current.active ?? current.label)
      : current.status === 'waiting'
        ? (current.pending ?? current.label)
        : block.total !== undefined && !current.holding
          ? partial(block.label, finished.length, block.total)
          : block.label;
  const aside = current.holding && current.card ? card?.(current.card, current) : null;

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
      {aside && <div className="gap-ws-5 ml-ws-12 mt-ws-3 mb-ws-3 flex flex-col">{aside}</div>}
      <Fold open={open}>
        <div className="pl-ws-12">
          {block.steps.map((step) => (
            <StepRow
              key={step.id}
              step={step}
              defaultOpen={defaultOpen}
              live={live}
              nested
              card={card}
              onAnswer={onAnswer}
            />
          ))}
        </div>
      </Fold>
    </div>
  );
}
