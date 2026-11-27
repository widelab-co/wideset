// TODO(custom): a pull request's checks summed in one mark (all passed, or some failed) with the count in a tooltip; Wideset has no check or status mark, and StatusBadge is a labelled badge.
import { RiCheckboxCircleFill, RiCloseCircleFill } from '@remixicon/react';
import { cn, Tooltip } from '@wideset/react';

import type { PullRequest } from './data';

/**
 * How a pull request's checks stand, as one 16px mark beside its number: the positive check when
 * every one passed, the negative cross as soon as one failed. The shapes differ, so the mark reads
 * without its colour, and it says the count on hover and to a screen reader.
 */
export function ChecksMark({ checks }: { checks: PullRequest['checks'] }) {
  const failed = checks.failed > 0;
  const Icon = failed ? RiCloseCircleFill : RiCheckboxCircleFill;
  const summary = failed
    ? `${checks.failed} of ${checks.total} checks failed`
    : `${checks.total} of ${checks.total} checks passed`;

  return (
    <Tooltip size="sm">
      <Tooltip.Trigger asChild>
        <span role="img" aria-label={summary} className="flex shrink-0">
          <Icon
            aria-hidden="true"
            className={cn(
              'size-ws-9',
              failed ? 'text-ws-semantic-negative' : 'text-ws-semantic-positive',
            )}
          />
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content side="top">
        <Tooltip.Label>{summary}</Tooltip.Label>
      </Tooltip.Content>
    </Tooltip>
  );
}
