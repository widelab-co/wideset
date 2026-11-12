// TODO(custom): usage of a window as one meter with what fills it listed under it; ProgressBar's neutral variant arrives with #58, and Wideset has no usage meter.
import { Button, ProgressBar } from '@wideset/react';

import { formatShare, formatTokens } from './context-format';

type ContextUsageProps = {
  /** The size of the window, in tokens. */
  window: number;
  /** What fills it, largest first. */
  parts: { label: string; tokens: number }[];
  /** The conversation has been compacted: there is nothing more to free. */
  compacted: boolean;
  onCompact: () => void;
};

/**
 * How full the context is: the share as the figure, one bar for it, and under the bar what fills
 * it as plain rows of figures (the value has its one visual; the breakdown is read, not drawn).
 * The way to free space sits with the meter it changes: Compact, bordered, with one line saying
 * what it does and what it keeps. Once used, the figures drop and the line says so.
 */
export function ContextUsage({ window, parts, compacted, onCompact }: ContextUsageProps) {
  const used = parts.reduce((sum, part) => sum + part.tokens, 0);
  const share = formatShare(used / window);

  return (
    <div className="gap-ws-9 flex flex-col">
      <div className="gap-ws-5 flex flex-col">
        <p className="gap-ws-5 flex items-baseline justify-between tabular-nums">
          <span className="typography-label-strong-md text-ws-static-strong">
            {share} of the window used
          </span>
          <span className="typography-body-sm text-ws-static-subtle">
            {formatTokens(used)} of {formatTokens(window)} tokens
          </span>
        </p>
        <ProgressBar
          value={used}
          max={window}
          aria-label={`Context: ${share} of the window used`}
        />
        <dl className="gap-ws-2 pt-ws-2 flex flex-col">
          {parts.map((part) => (
            <div key={part.label} className="typography-body-sm flex justify-between">
              <dt className="text-ws-static-subtle">{part.label}</dt>
              <dd className="text-ws-static-base tabular-nums">{formatTokens(part.tokens)}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="gap-ws-5 flex flex-col items-start">
        <p role="status" className="typography-body-sm text-ws-static-subtle text-pretty">
          {compacted
            ? 'Compacted. The earlier turns are now a summary.'
            : 'Compacting replaces the earlier turns with a summary. Files and instructions stay.'}
        </p>
        <Button
          variant="secondary"
          preset="border"
          size="sm"
          disabled={compacted}
          onClick={onCompact}
        >
          Compact conversation
        </Button>
      </div>
    </div>
  );
}
