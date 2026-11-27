import * as React from 'react';
import { cn } from 'src/lib/utils';

import { AppShellContext } from './AppShell.context';
import type {
  AppShellProps,
  AppShellSidebarState,
  AppShellWithSubComponents,
} from './AppShell.types';
import { appShellVariants } from './AppShell.variants';
import { AppShellMain } from './AppShellMain';
import { AppShellPageBar } from './AppShellPageBar';
import { AppShellPageBarActions } from './AppShellPageBarActions';
import { AppShellSidebarTrigger } from './AppShellSidebarTrigger';

const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  ({ direction = 'inset', className, children, ...props }, ref) => {
    // Filled in by the Sidebar, which keeps its own collapsed state.
    const [sidebar, registerSidebar] = React.useState<AppShellSidebarState | null>(null);
    const contextValue = React.useMemo(
      () => ({ direction, sidebar, registerSidebar }),
      [direction, sidebar],
    );

    return (
      <AppShellContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="app-shell"
          data-direction={direction}
          className={cn(appShellVariants({ direction }), className)}
          {...props}
        >
          {children}
        </div>
      </AppShellContext.Provider>
    );
  },
) as AppShellWithSubComponents;

AppShell.displayName = 'AppShell';
AppShell.Main = AppShellMain;
AppShell.PageBar = AppShellPageBar;
AppShell.PageBarActions = AppShellPageBarActions;
AppShell.SidebarTrigger = AppShellSidebarTrigger;

export { AppShell };
