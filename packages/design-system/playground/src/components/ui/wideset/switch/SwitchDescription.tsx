'use client';

import * as React from 'react';
import { cn } from '@/lib/wideset/utils';

export const SwitchDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="switch-description"
    className={cn('text-ws-static-subtle typography-body-sm', className)}
    {...props}
  >
    {children}
  </div>
));

SwitchDescription.displayName = 'Switch.Description';
