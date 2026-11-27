import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useAppShellContext } from './AppShell.context';
import type { AppShellPageBarProps } from './AppShell.types';
import { appShellPageBarVariants } from './AppShell.variants';

const AppShellPageBar = React.forwardRef<HTMLElement, AppShellPageBarProps>(
  ({ className, ...props }, ref) => {
    const { direction } = useAppShellContext();

    return (
      <header
        ref={ref}
        data-slot="app-shell-page-bar"
        className={cn(appShellPageBarVariants({ direction }), className)}
        {...props}
      />
    );
  },
);

AppShellPageBar.displayName = 'AppShell.PageBar';

export { AppShellPageBar };
