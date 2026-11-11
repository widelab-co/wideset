// TODO(custom): how full the context is, as a ring the size of an icon with its figure, opening a short summary; ProgressBar's circle is 20px in the brand colour with its own label, and its bar has no neutral variant yet (#58).
import { Button, Popup, ProgressBar } from '@wideset/react';

const tokens = new Intl.NumberFormat('en-US', { notation: 'compact' });

/** The ring's circle in its 16px box: a 2px stroke, so the radius is 6. */
const RADIUS = 6;
const AROUND = 2 * Math.PI * RADIUS;

type ContextMeterProps = {
  /** Tokens in the context now, and how many it holds. */
  used: number;
  limit: number;
  /** What the context is made of, largest first. */
  parts: { label: string; tokens: number }[];
};

/**
 * The context meter in the composer: a small grey ring and the share used, quiet because 29% is
 * nothing to act on. It opens a short summary built as the billing block's usage meter is (the
 * amount, the limit beside it, a bar, one line of what happens next), then what the context is
 * made of and the one thing to do about it. The ring is neutral; the brand colour stays with Send.
 */
export function ContextMeter({ used, limit, parts }: ContextMeterProps) {
  const share = used / limit;
  const percent = `${Math.round(share * 100)}%`;

  return (
    <Popup>
      <Popup.Trigger asChild>
        <Button
          variant="secondary"
          preset="ghost"
          size="sm"
          aria-label={`Context: ${percent} used`}
          className="tabular-nums"
        >
          <svg aria-hidden viewBox="0 0 16 16" className="size-ws-9 shrink-0 -rotate-90 fill-none">
            <circle
              cx="8"
              cy="8"
              r={RADIUS}
              strokeWidth="2"
              className="stroke-(--border-color-ws-dynamic-secondary-default)"
            />
            <circle
              cx="8"
              cy="8"
              r={RADIUS}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={AROUND}
              strokeDashoffset={AROUND * (1 - share)}
              className="stroke-current"
            />
          </svg>
          {percent}
        </Button>
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
              Tandem compacts the conversation by itself when it is nearly full.
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
