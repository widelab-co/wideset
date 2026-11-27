import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { NavigationBarStartProps } from './NavigationBar.types';

const NavigationBarStart = React.forwardRef<HTMLDivElement, NavigationBarStartProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="navigation-bar-start"
      className={cn('gap-ws-5 flex shrink-0 items-center', className)}
      {...props}
    />
  ),
);

NavigationBarStart.displayName = 'NavigationBar.Start';

export { NavigationBarStart };
