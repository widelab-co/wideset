import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useAppShellContext } from './AppShell.context';
import type { AppShellTopBarProps } from './AppShell.types';
import { appShellTopBarVariants } from './AppShell.variants';

const AppShellTopBar = React.forwardRef<HTMLElement, AppShellTopBarProps>(
  ({ className, ...props }, ref) => {
    const { direction } = useAppShellContext();

    return (
      <header
        ref={ref}
        data-slot="app-shell-top-bar"
        className={cn(appShellTopBarVariants({ direction }), className)}
        {...props}
      />
    );
  },
);

AppShellTopBar.displayName = 'AppShell.TopBar';

export { AppShellTopBar };
