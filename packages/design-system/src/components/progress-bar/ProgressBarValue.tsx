import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useProgressBarContext } from './ProgressBar.context';
import type { ProgressBarValueProps } from './ProgressBar.types';
import { progressBarValueVariants } from './ProgressBar.variants';

export const ProgressBarValue = React.forwardRef<HTMLSpanElement, ProgressBarValueProps>(
  ({ className, formatValue, children, ...props }, ref) => {
    const { value, max, percent, type, fixedWidth } = useProgressBarContext();

    return (
      <span
        ref={ref}
        data-slot="progress-bar-value"
        className={cn(
          progressBarValueVariants({ fixedWidth: fixedWidth && type === 'circle' }),
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
