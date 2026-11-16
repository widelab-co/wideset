// TODO(custom): the context in short, opened from its meter (the amount, the limit, a bar, what fills it, Compact); ProgressBar has no neutral variant yet (#58), and Wideset has no usage meter.
import { Button, Popup, ProgressBar } from '@wideset/react';

import { ContextMeter } from './context-meter';
import type { Context } from './model';

const tokens = new Intl.NumberFormat('en-US', { notation: 'compact' });

/**
 * The context meter and the short summary it opens: built as the billing block's usage meter is
 * (the amount, the limit beside it, a bar, one line of what happens next), then what the context
 * is made of and the one thing to do about it.
 */
export function ContextSummary({ used, limit, parts }: Context) {
  return (
    <Popup>
      <Popup.Trigger asChild>
        <ContextMeter share={used / limit} />
      </Popup.Trigger>
      <Popup.Container side="top" align="start" aria-label="Context" className="w-[18rem]">
        <Popup.Content contentClassName="gap-ws-9 flex flex-col">
          <div className="gap-ws-5 flex flex-col">
            <div className="gap-ws-3 flex flex-col">
              <h3 className="typography-label-sm text-ws-static-subtle">Context</h3>
              <p className="gap-ws-3 flex items-baseline tabular-nums">
                <span className="typography-subtitle-sm text-ws-static-strong">
                  {tokens.format(used)}
                </span>
                <span className="typography-body-md text-ws-static-subtle">
                  / {tokens.format(limit)} tokens
                </span>
              </p>
            </div>
            <ProgressBar
              value={used}
              max={limit}
              aria-label={`Context: ${tokens.format(used)} of ${tokens.format(limit)} tokens`}
            />
            <p className="typography-caption-md text-ws-static-subtle">
              The conversation is compacted by itself when it is nearly full.
            </p>
          </div>
          <dl className="typography-body-md gap-ws-3 flex flex-col">
            {parts.map((part) => (
              <div key={part.label} className="gap-ws-7 flex items-baseline justify-between">
                <dt className="text-ws-static-subtle">{part.label}</dt>
                <dd className="text-ws-static-base tabular-nums">{tokens.format(part.tokens)}</dd>
              </div>
            ))}
          </dl>
          <Popup.Close asChild>
            <Button variant="secondary" preset="border" size="sm" className="w-full">
              Compact now
            </Button>
          </Popup.Close>
        </Popup.Content>
      </Popup.Container>
    </Popup>
  );
}
