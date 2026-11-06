import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useSidebarContext } from './Sidebar.context';
import type { SidebarGroupProps } from './Sidebar.types';
import { sidebarGroupLabelVariants, sidebarGroupVariants } from './Sidebar.variants';

/**
 * A named run of items inside a section: Figma's Sidebar Item `Type=Group` heading above them.
 * The heading is text only, aligned with the item icons; collapsed, it stays as the group's
 * accessible name but is not drawn.
 */
const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ label, children, className, ...props }, ref) => {
    const { isCollapsed } = useSidebarContext();
    const labelId = React.useId();
    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={labelId}
        data-slot="sidebar-group"
        {...props}
        className={cn(sidebarGroupVariants(), className)}
      >
        <div id={labelId} className={sidebarGroupLabelVariants({ collapsed: isCollapsed })}>
          {label}
        </div>
        {children}
      </div>
    );
  },
);

SidebarGroup.displayName = 'Sidebar.Group';

export { SidebarGroup };
