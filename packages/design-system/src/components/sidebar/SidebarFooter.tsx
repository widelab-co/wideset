import * as React from 'react';
import { cn } from 'src/lib/utils';

import { SidebarContext } from './Sidebar.context';
import type { SidebarFooterProps } from './Sidebar.types';

/**
 * The bottom of the sidebar: an invite button, the account switcher. It never scrolls and keeps
 * the same inset as the sections above, so its edges line up with theirs.
 */
const SidebarFooter = ({ children, className, ...props }: SidebarFooterProps) => {
  // Collapsed, the account avatar sits on the rail's centre line like the items above it.
  const isCollapsed = React.useContext(SidebarContext)?.isCollapsed;
  return (
    <div
      data-slot="sidebar-footer"
      className={cn(
        'mt-auto w-full min-w-0 shrink-0 empty:hidden',
        isCollapsed && 'flex flex-col items-center',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

SidebarFooter.displayName = 'Sidebar.Footer';

export { SidebarFooter };
