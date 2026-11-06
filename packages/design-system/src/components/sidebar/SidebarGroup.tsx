import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useSidebarContext } from './Sidebar.context';
import type { SidebarGroupProps } from './Sidebar.types';
import {
  sidebarGroupActionVariants,
  sidebarGroupLabelVariants,
  sidebarGroupVariants,
} from './Sidebar.variants';

/**
 * A named run of items inside a section: Figma's Sidebar Item `Type=Group` heading above them.
 * The heading is text only, aligned with the item icons; collapsed, it stays as the group's
 * accessible name but is not drawn.
 */
const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ label, action, children, className, ...props }, ref) => {
    const { isCollapsed } = useSidebarContext();
    const labelId = React.useId();
    const showAction = action != null && !isCollapsed;
    const heading = (
      <div
        id={labelId}
        className={cn(
          sidebarGroupLabelVariants({ collapsed: isCollapsed }),
          showAction && 'min-w-0 flex-1',
        )}
      >
        {label}
      </div>
    );
    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={labelId}
        data-slot="sidebar-group"
        {...props}
        className={cn(sidebarGroupVariants(), className)}
      >
        {showAction ? (
          <div className="flex min-w-0 items-center">
            {heading}
            <div data-slot="sidebar-group-action" className={sidebarGroupActionVariants()}>
              {action}
            </div>
          </div>
        ) : (
          heading
        )}
        {children}
      </div>
    );
  },
);

SidebarGroup.displayName = 'Sidebar.Group';

export { SidebarGroup };
