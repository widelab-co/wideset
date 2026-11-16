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
import { AppShellSidebarTrigger } from './AppShellSidebarTrigger';
import { AppShellTopBar } from './AppShellTopBar';
import { AppShellTopBarActions } from './AppShellTopBarActions';

const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  ({ direction = 'inset', className, children, ...props }, ref) => {
    // The `Sidebar` inside owns its collapsed state and reports it here, so a trigger in the page
    // (`AppShell.SidebarTrigger`) can toggle it from outside the sidebar.
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
AppShell.TopBar = AppShellTopBar;
AppShell.TopBarActions = AppShellTopBarActions;
AppShell.SidebarTrigger = AppShellSidebarTrigger;

export { AppShell };
