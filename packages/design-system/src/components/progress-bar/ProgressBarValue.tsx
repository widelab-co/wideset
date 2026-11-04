import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useProgressBarContext } from './ProgressBar.context';
import type { ProgressBarValueProps } from './ProgressBar.types';

const ProgressBarValue = React.forwardRef<HTMLSpanElement, ProgressBarValueProps>(
  ({ children, className, ...props }, ref) => {
    const { percent, type } = useProgressBarContext();
    const isDefault = children == null;

    return (
      <span
        ref={ref}
        data-slot="progress-bar-value"
        className={cn(
          'typography-label-sm text-ws-static-subtle tabular-nums',
          // The default percentage reserves room for "100%", so rings in a list line up and the
          // ring does not move while the value animates. Custom content is sized by the caller.
          type === 'circle' && isDefault && 'min-w-ws-14 text-end',
          className,
        )}
        {...props}
      >
        {isDefault ? `${percent}%` : children}
      </span>
    );
  },
);
ProgressBarValue.displayName = 'ProgressBar.Value';

export { ProgressBarValue };
