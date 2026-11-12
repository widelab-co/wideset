import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { SidebarFooterProps } from './Sidebar.types';

/**
 * The bottom of the sidebar: an invite button, the account switcher. It never scrolls and keeps
 * the same inset as the sections above, so its edges line up with theirs.
 */
const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-footer"
      className={cn('mt-auto w-full min-w-0 shrink-0 empty:hidden', className)}
      {...props}
    >
      {children}
    </div>
  ),
);

SidebarFooter.displayName = 'Sidebar.Footer';

export { SidebarFooter };
