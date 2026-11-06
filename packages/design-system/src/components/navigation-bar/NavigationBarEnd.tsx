import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { NavigationBarEndProps } from './NavigationBar.types';

const NavigationBarEnd = React.forwardRef<HTMLDivElement, NavigationBarEndProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="navigation-bar-end"
      className={cn('gap-ws-9 ml-auto flex shrink-0 items-center', className)}
      {...props}
    />
  ),
);

NavigationBarEnd.displayName = 'NavigationBar.End';

export { NavigationBarEnd };
