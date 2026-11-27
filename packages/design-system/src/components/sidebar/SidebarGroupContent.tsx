import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useSidebarGroupContext } from './Sidebar.context';
import type { SidebarGroupContentProps } from './Sidebar.types';
import { sidebarGroupContentVariants } from './SidebarGroup.variants';

/**
 * The rows a `Sidebar.Group` folds. Closed, they stay mounted but `hidden`. Collapsed, a family's
 * members (a group headed by an item) are hidden too: the rail shows the head's icon alone and
 * the open state comes back when the sidebar expands. A collapsible section keeps its rows.
 */
const SidebarGroupContent = React.forwardRef<HTMLDivElement, SidebarGroupContentProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, contentId } = useSidebarGroupContext();

    return (
      <div
        ref={ref}
        data-slot="sidebar-group-content"
        data-state={isOpen ? 'open' : 'closed'}
        // `hidden` alone loses to `flex` where no preflight restores it; the class makes sure.
        className={cn(sidebarGroupContentVariants(), !isOpen && 'hidden', className)}
        {...props}
        id={contentId}
        hidden={!isOpen}
      >
        {children}
      </div>
    );
  },
);

SidebarGroupContent.displayName = 'Sidebar.GroupContent';

export { SidebarGroupContent };
