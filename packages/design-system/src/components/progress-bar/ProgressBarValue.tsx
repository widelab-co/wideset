import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useProgressBarContext } from './ProgressBar.context';
import type { ProgressBarValueProps } from './ProgressBar.types';

const ProgressBarValue = React.forwardRef<HTMLSpanElement, ProgressBarValueProps>(
  ({ formatValue, children, className, ...props }, ref) => {
    const { value, max, percent, type } = useProgressBarContext();
    const isDefault = children == null && !formatValue;

    return (
      <span
        ref={ref}
        data-slot="progress-bar-value"
        className={cn(
          'typography-label-sm text-ws-static-subtle tabular-nums',
          // Reserve room for "100%" so the ring does not shift as the value changes.
          type === 'circle' && isDefault && 'min-w-ws-14 text-end',
          className,
        )}
        {...props}
      >
        {children ?? (formatValue ? formatValue(value, max) : `${percent}%`)}
      </span>
    );
  },
);
ProgressBarValue.displayName = 'ProgressBar.Value';

export { ProgressBarValue };
