import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { NavigationBarNavProps } from './NavigationBar.types';

const NavigationBarNav = React.forwardRef<HTMLElement, NavigationBarNavProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      data-slot="navigation-bar-nav"
      aria-label="Main"
      className={cn('gap-ws-3 flex min-w-0 items-center', className)}
      {...props}
    />
  ),
);

NavigationBarNav.displayName = 'NavigationBar.Nav';

export { NavigationBarNav };
