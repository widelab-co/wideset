// TODO(custom): the lines that join steps on a canvas (straight, and the elbow where a condition splits); Wideset has no flow connector.
import { cn } from '@wideset/react';

import type { StepKind } from './data';
import { InsertMenu } from './insert-menu';

/** A vertical piece of line, as tall as its class makes it. The stroke stays 1px at any zoom. */
export function Line({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 2 10"
      preserveAspectRatio="none"
      className={cn('w-ws-2 shrink-0 overflow-visible', className)}
    >
      <line
        x1="1"
        y1="0"
        x2="1"
        y2="10"
        vectorEffect="non-scaling-stroke"
        className="stroke-ws-static-strong"
      />
    </svg>
  );
}

/**
 * Where a condition splits: half of the bar across the two branches and the drop into this one.
 * The two branch columns touch, so their halves meet under the condition.
 */
export function Elbow({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
      className="h-ws-7 w-full shrink-0 overflow-visible"
    >
      <path
        d={side === 'left' ? 'M50 10 V0 H100' : 'M0 0 H50 V10'}
        fill="none"
        vectorEffect="non-scaling-stroke"
        className="stroke-ws-static-strong"
      />
    </svg>
  );
}

/**
 * The line into a step with its "+" in the middle. At the end of a line (`end`) it stops at the
 * "+", which then adds the line's last step.
 */
export function Connector({
  label,
  end = false,
  onInsert,
}: {
  label: string;
  end?: boolean;
  onInsert: (kind: StepKind) => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <Line className="h-ws-9" />
      <InsertMenu label={label} onInsert={onInsert} />
      {!end && <Line className="h-ws-9" />}
    </div>
  );
}
