// TODO(custom): stage breakdown (label, count, amount, bar); no component in Wideset.
import { cn } from '@wideset/react';
import { useId } from 'react';

import { PIPELINE } from './data';
import { formatCount, formatUsd, formatUsdCompact } from './format';

/** Open pipeline by stage: each stage's amount as a bar against the largest stage, with its deals. */
export function PipelineByStage({ className }: { className?: string }) {
  const titleId = useId();
  const max = Math.max(...PIPELINE.map((stage) => stage.amount));
  const amount = PIPELINE.reduce((sum, stage) => sum + stage.amount, 0);
  const deals = PIPELINE.reduce((sum, stage) => sum + stage.deals, 0);

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'bg-ws-static-foreground rounded-ws-container-md p-ws-11 gap-ws-9 flex flex-col',
        className,
      )}
    >
      <div className="gap-ws-9 flex items-baseline justify-between">
        <h2 id={titleId} className="typography-subtitle-xs text-ws-static-strong">
          Pipeline by stage
        </h2>
        <p
          title={`${formatUsd(amount)} in ${formatCount(deals)} open deals`}
          className="typography-body-md text-ws-static-subtle tabular-nums"
        >
          {formatUsdCompact(amount)}
        </p>
      </div>
      <ul className="gap-ws-7 flex flex-col">
        {PIPELINE.map((stage) => (
          <li key={stage.stage} className="gap-ws-3 flex flex-col">
            <div className="typography-label-sm gap-ws-5 flex items-baseline">
              <span className="text-ws-static-base">{stage.stage}</span>
              <span className="text-ws-static-subtle tabular-nums">{stage.deals}</span>
              <span className="text-ws-static-strong ml-auto tabular-nums">
                {formatUsd(stage.amount)}
              </span>
            </div>
            <svg aria-hidden className="h-ws-4 w-full">
              <rect
                width={`${(stage.amount / max) * 100}%`}
                height="100%"
                rx="3"
                className="fill-ws-static-subtle"
              />
            </svg>
          </li>
        ))}
      </ul>
    </section>
  );
}
