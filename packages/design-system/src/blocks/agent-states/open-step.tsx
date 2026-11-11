// TODO(custom): a step that needs you, drawn open (its row, its output, and what to do about it under that); the kit's StepRow opens only on a click or in the Verbose view and has no place for actions.
import { cn } from '@wideset/react';
import type { ReactNode } from 'react';

import { Inline } from './inline';
import type { Step, StepStatus } from './model';
import { Row } from './row';
import { StepDetail } from './step-detail';
import { StepMark } from './step-mark';

/** As in the kit's step row: the result takes colour only where the step needs a look. */
const TONE: Partial<Record<StepStatus, string>> = {
  failed: 'text-ws-semantic-negative',
  waiting: 'text-ws-semantic-notice',
};

/**
 * The step the run stopped at, made of the kit's row, mark and detail so it reads as one of the
 * steps above it, but open from the start: the lines that matter are in view, and what to do
 * about them sits right under, in line with the output. It undoes the padding the transcript
 * gives a card, so its mark lines up with the other steps'.
 */
export function OpenStep({ step, children }: { step: Step; children?: ReactNode }) {
  const running = step.status === 'running';
  return (
    <div className="-mx-ws-3 -my-ws-3">
      <Row mark={<StepMark status={step.status} />}>
        <span className="text-ws-static-base min-w-0 truncate">
          <Inline text={running ? (step.active ?? step.label) : step.label} />
        </span>
        {!running && step.result && (
          <span
            className={cn('shrink-0 tabular-nums', TONE[step.status] ?? 'text-ws-static-subtle')}
          >
            {step.result}
          </span>
        )}
      </Row>
      {step.detail && <StepDetail detail={step.detail} />}
      {children && (
        <div className="gap-ws-5 ml-ws-12 mt-ws-3 mb-ws-3 flex flex-col">{children}</div>
      )}
    </div>
  );
}
