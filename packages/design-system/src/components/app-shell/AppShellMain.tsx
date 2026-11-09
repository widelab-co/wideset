import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useAppShellContext } from './AppShell.context';
import type { AppShellMainProps } from './AppShell.types';
import { appShellMainVariants } from './AppShell.variants';

const AppShellMain = React.forwardRef<HTMLElement, AppShellMainProps>(
  ({ className, ...props }, ref) => {
    const { direction } = useAppShellContext();

    return (
      <main
        ref={ref}
        data-slot="app-shell-main"
        className={cn(appShellMainVariants({ direction }), className)}
        {...props}
      />
    );
  },
);

AppShellMain.displayName = 'AppShell.Main';

export { AppShellMain };
