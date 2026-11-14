import { Fragment } from 'react';

import { Connector, Elbow, Line } from './connector';
import { type Step, STEP_TYPES, type StepKind } from './data';
import type { SequenceKey } from './flow';
import { FlowNode } from './flow-node';

type SequenceProps = {
  steps: Step[];
  sequence: SequenceKey;
  /** A branch opens with a "+" too, so a step can go first on it. */
  leading?: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  onInsert: (sequence: SequenceKey, index: number, kind: StepKind) => void;
  /** Delete or Backspace on a node: removes the selected step. */
  onDeleteKey: () => void;
};

/**
 * One line of steps, top to bottom, with a "+" between each two and one at the end. A condition
 * ends its line and splits it in two branches, each a line of its own, so the flow is drawn by
 * laying it out, not by measuring it.
 */
export function FlowSequence({
  steps,
  sequence,
  leading = false,
  selectedId,
  onSelect,
  onInsert,
  onDeleteKey,
}: SequenceProps) {
  const last = steps.at(-1);
  const insertAt = (index: number) => (kind: StepKind) => onInsert(sequence, index, kind);
  const after = (index: number) =>
    index === 0
      ? 'Add the first step on this branch'
      : `Add a step after ${STEP_TYPES[steps[index - 1].kind].label}`;

  return (
    <div className="flex flex-col items-center">
      {steps.map((step, index) => (
        <Fragment key={step.id}>
          {(index > 0 || leading) && <Connector label={after(index)} onInsert={insertAt(index)} />}
          <FlowNode
            step={step}
            selected={step.id === selectedId}
            onSelect={() => onSelect(step.id)}
            onDeleteKey={onDeleteKey}
          />
          {step.kind === 'condition' && (
            <>
              <Line className="h-ws-7" />
              {/* Two columns of the same width, touching, so the split sits under the node. */}
              <div className="grid grid-cols-2">
                {(['yes', 'no'] as const).map((branch) => (
                  <div key={branch} className="flex flex-col items-center">
                    <Elbow side={branch === 'yes' ? 'left' : 'right'} />
                    <span className="typography-caption-strong-md text-ws-static-subtle py-ws-2">
                      {branch === 'yes' ? 'Yes' : 'No'}
                    </span>
                    <div className="px-ws-9">
                      <FlowSequence
                        steps={step[branch] ?? []}
                        sequence={`${step.id}:${branch}`}
                        leading
                        selectedId={selectedId}
                        onSelect={onSelect}
                        onInsert={onInsert}
                        onDeleteKey={onDeleteKey}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Fragment>
      ))}
      {/* An empty branch is only this "+". */}
      {last?.kind !== 'condition' && (
        <Connector label={after(steps.length)} end onInsert={insertAt(steps.length)} />
      )}
    </div>
  );
}
