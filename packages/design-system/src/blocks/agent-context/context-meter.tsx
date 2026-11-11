// TODO(custom): the context meter in the composer (a small ring and the share used, as a button); ProgressBar's circle is not a control, and Button has no meter.
import { Button, type ButtonProps, ProgressBar } from '@wideset/react';
import { forwardRef } from 'react';

import { formatShare } from './context-format';

type ContextMeterProps = Omit<ButtonProps, 'children'> & {
  /** How full the context window is, from 0 to 1. */
  share: number;
};

/**
 * How full the context is, always in view among the composer's tools: the library's 20px ring
 * with the share beside it, in a ghost button that opens the session's environment. The ring is
 * the figure's picture, so it is hidden from screen readers and the button says the figure. It
 * forwards its ref and props, so `Popup.Trigger asChild` can drive it.
 */
export const ContextMeter = forwardRef<HTMLButtonElement, ContextMeterProps>(
  ({ share, ...props }, ref) => (
    <Button
      ref={ref}
      variant="secondary"
      preset="ghost"
      size="sm"
      aria-label={`Context: ${formatShare(share)} used. Show the session’s context`}
      {...props}
    >
      <ProgressBar
        type="circle"
        value={share}
        max={1}
        aria-hidden="true"
        className="gap-ws-3 flex-row-reverse tabular-nums"
      />
    </Button>
  ),
);

ContextMeter.displayName = 'ContextMeter';
