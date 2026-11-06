import * as React from 'react';
import { cn } from 'src/lib/utils';

import { ScrollArea } from '../scroll-area/ScrollArea';
import { useSidebarContext } from './Sidebar.context';
import type { SidebarSectionProps } from './Sidebar.types';
import { SidebarCollapsed } from './SidebarCollapsed';
import { SidebarExpanded } from './SidebarExpanded';

const SidebarSection = ({ scrollable, children, className, ...props }: SidebarSectionProps) => {
  const { isCollapsed } = useSidebarContext();
  const childArray = React.Children.toArray(children);
  const hasExpanded = childArray.some(
    (child) => React.isValidElement(child) && child.type === SidebarExpanded,
  );
  const hasCollapsed = childArray.some(
    (child) => React.isValidElement(child) && child.type === SidebarCollapsed,
  );

  if (isCollapsed && !hasCollapsed) return null;
  if (!isCollapsed && !hasExpanded) return null;

  return (
    <div
      data-slot="sidebar-section"
      className={cn('w-full min-w-0', scrollable && 'min-h-0 flex-1', className)}
      {...props}
    >
      {scrollable ? (
        // Expanded, the bar and its gutter sit in the sidebar's right padding (-mr), so the items
        // end where the header and footer end. Collapsed, a gutter would pull the items off the
        // rail's centre line, so there is none and no bar; the rail still scrolls.
        <ScrollArea
          scrollbarGutter={!isCollapsed}
          scrollbarVisibility={isCollapsed ? 'never' : 'hover'}
          className={cn('h-full', !isCollapsed && '-mr-ws-6')}
        >
          {children}
        </ScrollArea>
      ) : (
        children
      )}
    </div>
  );
};

SidebarSection.displayName = 'Sidebar.Section';

export { SidebarSection };
