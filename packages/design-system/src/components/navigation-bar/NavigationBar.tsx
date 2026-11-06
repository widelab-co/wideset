import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { NavigationBarProps, NavigationBarWithSubComponents } from './NavigationBar.types';
import { navigationBarVariants } from './NavigationBar.variants';
import { NavigationBarActions } from './NavigationBarActions';
import { NavigationBarEnd } from './NavigationBarEnd';
import { NavigationBarItem } from './NavigationBarItem';
import { NavigationBarNav } from './NavigationBarNav';
import { NavigationBarStart } from './NavigationBarStart';

const NavigationBar = React.forwardRef<HTMLElement, NavigationBarProps>(
  ({ divider = true, className, ...props }, ref) => (
    <header
      ref={ref}
      data-slot="navigation-bar"
      className={cn(navigationBarVariants({ divider }), className)}
      {...props}
    />
  ),
) as NavigationBarWithSubComponents;

NavigationBar.displayName = 'NavigationBar';
NavigationBar.Start = NavigationBarStart;
NavigationBar.Nav = NavigationBarNav;
NavigationBar.Item = NavigationBarItem;
NavigationBar.End = NavigationBarEnd;
NavigationBar.Actions = NavigationBarActions;

export { NavigationBar };
