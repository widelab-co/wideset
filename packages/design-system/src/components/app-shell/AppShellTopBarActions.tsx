import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { AppShellTopBarActionsProps } from './AppShell.types';
import { appShellTopBarActionsVariants } from './AppShell.variants';

const AppShellTopBarActions = React.forwardRef<HTMLDivElement, AppShellTopBarActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="app-shell-top-bar-actions"
      className={cn(appShellTopBarActionsVariants(), className)}
      {...props}
    />
  ),
);

AppShellTopBarActions.displayName = 'AppShell.TopBarActions';

export { AppShellTopBarActions };
