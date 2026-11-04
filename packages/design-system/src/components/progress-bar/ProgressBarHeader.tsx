import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useProgressBarContext } from './ProgressBar.context';
import type { ProgressBarHeaderProps } from './ProgressBar.types';

export const ProgressBarHeader = React.forwardRef<HTMLDivElement, ProgressBarHeaderProps>(
  ({ className, ...props }, ref) => {
    useProgressBarContext();

    return (
      <div
        ref={ref}
        data-slot="progress-bar-header"
        className={cn('gap-ws-3 flex items-center justify-between', className)}
        {...props}
      />
    );
  },
);
ProgressBarHeader.displayName = 'ProgressBar.Header';
