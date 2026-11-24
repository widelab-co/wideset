import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { NavigationBarActionsProps } from './NavigationBar.types';

const NavigationBarActions = React.forwardRef<HTMLDivElement, NavigationBarActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="navigation-bar-actions"
      className={cn('gap-ws-3 flex items-center', className)}
      {...props}
    />
  ),
);

NavigationBarActions.displayName = 'NavigationBar.Actions';

export { NavigationBarActions };
