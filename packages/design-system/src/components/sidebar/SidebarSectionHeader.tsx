import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useSidebarContext } from './Sidebar.context';
import type { SidebarSectionHeaderProps } from './Sidebar.types';

const SidebarSectionHeader = React.forwardRef<HTMLDivElement, SidebarSectionHeaderProps>(
  ({ children, className, ...props }, ref) => {
    const { isCollapsed } = useSidebarContext();

    return (
      <div
        ref={ref}
        data-slot="sidebar-section-header"
        className={cn('h-ws-16 flex items-end', !isCollapsed && 'px-ws-5 py-ws-3', className)}
        {...props}
      >
        <span
          className={
            isCollapsed
              ? 'sr-only'
              : 'typography-caption-strong-md text-ws-static-subtle min-w-0 truncate'
          }
        >
          {children}
        </span>
      </div>
    );
  },
);

SidebarSectionHeader.displayName = 'Sidebar.SectionHeader';

export { SidebarSectionHeader };
