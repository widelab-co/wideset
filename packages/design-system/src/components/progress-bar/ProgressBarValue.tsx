import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useProgressBarContext } from './ProgressBar.context';
import type { ProgressBarValueProps } from './ProgressBar.types';

const ProgressBarValue = React.forwardRef<HTMLSpanElement, ProgressBarValueProps>(
  ({ formatValue, className, ...props }, ref) => {
    const { value, max, percent, type } = useProgressBarContext();

    return (
      <span
        ref={ref}
        data-slot="progress-bar-value"
        className={cn(
          'typography-label-sm text-ws-static-subtle tabular-nums',
          // The default percentage reserves room for "100%", so rings in a list line up and the
          // ring does not move while the value animates. A custom format is sized by the caller.
          type === 'circle' && !formatValue && 'min-w-ws-14 text-end',
          className,
        )}
        {...props}
      >
        {formatValue ? formatValue(value, max) : `${percent}%`}
      </span>
    );
  },
);
ProgressBarValue.displayName = 'ProgressBar.Value';

export { ProgressBarValue };
