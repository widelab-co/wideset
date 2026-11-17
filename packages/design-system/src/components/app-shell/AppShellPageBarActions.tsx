import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { AppShellPageBarActionsProps } from './AppShell.types';
import { appShellPageBarActionsVariants } from './AppShell.variants';

const AppShellPageBarActions = React.forwardRef<HTMLDivElement, AppShellPageBarActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="app-shell-page-bar-actions"
      className={cn(appShellPageBarActionsVariants(), className)}
      {...props}
    />
  ),
);

AppShellPageBarActions.displayName = 'AppShell.PageBarActions';

export { AppShellPageBarActions };
