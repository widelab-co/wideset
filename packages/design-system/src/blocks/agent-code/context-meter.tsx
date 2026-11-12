// TODO(custom): how full the context is, as a ring the size of an icon with its figure, in a button; ProgressBar's circle is 20px in the brand colour with its own label and is not a control.
import { Button, type ButtonProps } from '@wideset/react';
import { forwardRef } from 'react';

/** The ring's circle in its 16px box: a 2px stroke, so the radius is 6. */
const RADIUS = 6;
const AROUND = 2 * Math.PI * RADIUS;

type ContextMeterProps = Omit<ButtonProps, 'children'> & {
  /** How full the context window is, from 0 to 1. */
  share: number;
};

/**
 * The context meter among the composer's tools in Code: a small grey ring and the share used,
 * quiet because 29% is nothing to act on. The ring is neutral; the brand colour stays with Send.
 * It is a ghost button that forwards its ref and props, so a `Popup.Trigger asChild` can open
 * whatever the block has to say about the context: the short summary, or the whole environment.
 */
export const ContextMeter = forwardRef<HTMLButtonElement, ContextMeterProps>(
  ({ share, ...props }, ref) => {
    const percent = `${Math.round(share * 100)}%`;
    return (
      <Button
        ref={ref}
        variant="secondary"
        preset="ghost"
        size="sm"
        aria-label={`Context: ${percent} used`}
        className="tabular-nums"
        {...props}
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
    );
  },
);

ContextMeter.displayName = 'ContextMeter';
