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
  const isModeSlot = (child: React.ReactNode, type: React.ElementType) =>
    React.isValidElement(child) && child.type === type;
  const hasOnlyModeSlots = childArray.every(
    (child) => isModeSlot(child, SidebarExpanded) || isModeSlot(child, SidebarCollapsed),
  );
  const hasCurrentModeSlot = childArray.some((child) =>
    isModeSlot(child, isCollapsed ? SidebarCollapsed : SidebarExpanded),
  );

  if (hasOnlyModeSlots && !hasCurrentModeSlot) return null;

  return (
    <div
      data-slot="sidebar-section"
      className={cn('w-full min-w-0', scrollable && 'min-h-0 flex-1', className)}
      {...props}
    >
      {scrollable ? (
        // Expanded, the bar sits in the sidebar's right padding (-mr), so the items end where the
        // header and footer end instead of 10px short of them. Collapsed, the rail keeps one
        // centre line: a bar's gutter would push every item 5px left of the trigger and the
        // footer, so the section reserves none and scrolls by wheel, touch and keyboard.
        <ScrollArea
          className={cn('h-full', !isCollapsed && '-mr-ws-6')}
          indicatorHidden={isCollapsed}
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
