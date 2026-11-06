import * as React from 'react';
import { cn } from 'src/lib/utils';

import { SidebarContext } from './Sidebar.context';
import type { SidebarHeaderProps } from './Sidebar.types';

const SidebarHeader = ({ children, className, ...props }: SidebarHeaderProps) => {
  // Collapsed, the header's mark and trigger sit on the rail's centre line like the items.
  const isCollapsed = React.useContext(SidebarContext)?.isCollapsed;
  return (
    <div
      data-slot="sidebar-header"
      className={cn(
        'w-full min-w-0 shrink-0 empty:hidden',
        isCollapsed && 'flex flex-col items-center',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

SidebarHeader.displayName = 'Sidebar.Header';

export { SidebarHeader };
