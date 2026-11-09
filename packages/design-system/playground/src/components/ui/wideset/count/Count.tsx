'use client';

import React from 'react';
import { cn } from '@/lib/wideset/utils';

import type { CountProps } from './Count.types';

const Count = React.forwardRef<HTMLSpanElement, CountProps>(
  ({ children, className, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="count"
      className={cn(
        'h-ws-11 min-w-ws-11 px-ws-4 inline-flex shrink-0 items-center justify-center',
        'rounded-ws-control-full border-ws-static-base border bg-transparent',
        'typography-caption-strong-md text-ws-static-subtle whitespace-nowrap tabular-nums',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  ),
);

Count.displayName = 'Count';

export { Count };
