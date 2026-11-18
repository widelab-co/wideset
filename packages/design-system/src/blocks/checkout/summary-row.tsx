// TODO(custom): summary row (label, a detail under it, the amount on the right); no DescriptionList in Wideset.
import { cn } from '@wideset/react';
import type { ReactNode } from 'react';

type SummaryRowProps = {
  label: ReactNode;
  /** What the amount is made of, under the label. */
  detail?: string;
  amount: string;
  /** The figure the reader is after: the total. */
  strong?: boolean;
};

/**
 * A label and its amount on one row of the summary, with room for a line of detail. Label and
 * amount share a baseline, so a column of rows reads as a column of figures. Render inside a `dl`.
 */
export function SummaryRow({ label, detail, amount, strong }: SummaryRowProps) {
  return (
    <div className="gap-ws-9 flex items-baseline justify-between">
      <dt className="flex min-w-0 flex-col">
        <span
          className={cn(
            'gap-ws-5 flex flex-wrap items-center',
            strong
              ? 'typography-label-strong-md text-ws-static-strong'
              : 'typography-body-md text-ws-static-base',
          )}
        >
          {label}
        </span>
        {detail && (
          <span className="typography-caption-md text-ws-static-subtle tabular-nums">{detail}</span>
        )}
      </dt>
      <dd
        className={cn(
          'shrink-0 tabular-nums',
          strong
            ? 'typography-title-sm text-ws-static-strong'
            : 'typography-body-md text-ws-static-base',
        )}
      >
        {amount}
      </dd>
    </div>
  );
}
