import { RiErrorWarningLine } from '@remixicon/react';
import { cn, ProgressBar } from '@wideset/react';

import { NEAR_LIMIT } from './data';

type UsageMeterProps = {
  label: string;
  used: number;
  limit: number;
  /** The amount as read: `38`, `41.3K`, `63.4`. */
  usedText: string;
  /** The limit as read, with its unit: `40`, `50K`, `100 GB`. */
  limitText: string;
  /** One line under the bar: what is left, or when it resets. */
  note: string;
};

/**
 * Usage against a limit: the amount large, the limit beside it, a bar, one line of context. Close
 * to the limit (90%), the line turns to a warning; the colour sits on that line, not the whole
 * meter.
 */
export function UsageMeter({ label, used, limit, usedText, limitText, note }: UsageMeterProps) {
  const near = used / limit >= NEAR_LIMIT;

  return (
    <div className="gap-ws-5 flex min-w-0 flex-col">
      <div className="gap-ws-3 flex flex-col">
        <span className="typography-label-sm text-ws-static-subtle">{label}</span>
        <p className="gap-ws-3 flex items-baseline tabular-nums">
          <span className="typography-subtitle-sm text-ws-static-strong">{usedText}</span>
          <span className="typography-body-md text-ws-static-subtle">/ {limitText}</span>
        </p>
      </div>
      {/* The bar takes the brand colour until ProgressBar has `neutral` and `warning` variants;
          then: variant={near ? 'warning' : 'neutral'}. */}
      <ProgressBar value={used} max={limit} aria-label={`${label}: ${usedText} of ${limitText}`} />
      <p
        className={cn(
          'typography-caption-md gap-ws-3 flex items-center',
          near ? 'text-ws-semantic-notice' : 'text-ws-static-subtle',
        )}
      >
        {near && <RiErrorWarningLine aria-hidden="true" className="size-ws-8 shrink-0" />}
        {note}
      </p>
    </div>
  );
}
