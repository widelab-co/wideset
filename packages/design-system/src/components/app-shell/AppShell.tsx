import * as React from 'react';
import { cn } from 'src/lib/utils';

import { AppShellContext } from './AppShell.context';
import type { AppShellProps, AppShellWithSubComponents } from './AppShell.types';
import { appShellVariants } from './AppShell.variants';
import { AppShellMain } from './AppShellMain';

const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  ({ direction = 'inset', className, children, ...props }, ref) => {
    const contextValue = React.useMemo(() => ({ direction }), [direction]);

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

export { AppShell };
