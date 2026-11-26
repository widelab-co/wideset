// TODO(custom): a plan the agent proposed, with how it was answered (its steps in order, Approved, the way to its tasks); Wideset has no plan or proposal part, and ProgressTracker draws progress, not a proposal.
import { StatusBadge } from '@wideset/react';
import type { ReactNode } from 'react';

import { Inline } from './inline';

type PlanCardProps = {
  /** The steps, in the order the agent means to take them. A name in backticks is code. */
  steps: string[];
  /** The way on, under the steps: the link to the Tasks pane. */
  children?: ReactNode;
};

/**
 * What Plan mode leaves in the transcript: the steps the agent proposed before it changed
 * anything, in a bordered card as an approval is, and the answer they got. Approved is a
 * decision made, so its badge is positive. The plan stays as it was approved; how far the work
 * has come since is the Tasks pane's to say, one click away.
 */
export function PlanCard({ steps, children }: PlanCardProps) {
  return (
    <section
      aria-label="Plan"
      className="border-ws-static-base rounded-ws-container-md p-ws-9 gap-ws-7 flex flex-col border"
    >
      <div className="gap-ws-5 flex items-center">
        <h3 className="typography-label-strong-sm text-ws-static-strong min-w-0 flex-1">Plan</h3>
        <StatusBadge size="sm" color="positive">
          Approved
        </StatusBadge>
      </div>
      <ol className="typography-body-md text-ws-static-base marker:text-ws-static-subtle gap-ws-3 pl-ws-11 flex list-decimal flex-col marker:tabular-nums">
        {steps.map((step) => (
          <li key={step}>
            <Inline text={step} />
          </li>
        ))}
      </ol>
      {children && <div className="-ml-ws-3 flex">{children}</div>}
    </section>
  );
}
