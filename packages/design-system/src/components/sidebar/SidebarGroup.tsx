import * as React from 'react';
import { cn } from 'src/lib/utils';

import { SidebarGroupContext, useSidebarContext } from './Sidebar.context';
import type { SidebarGroupProps } from './Sidebar.types';
import { sidebarGroupVariants } from './SidebarGroup.variants';

/**
 * A head row and the rows it folds: a family under its main page (an item plus a
 * `Sidebar.GroupTrigger`), or a section under a `collapsible` section header. Holds the open
 * state; the toggle and `Sidebar.GroupContent` read it.
 */
const SidebarGroup = React.forwardRef<HTMLDivElement, SidebarGroupProps>(
  ({ open, defaultOpen, onOpenChange, defaultMotion, className, children, ...props }, ref) => {
    const { isCollapsed, motion: inheritedMotion } = useSidebarContext();
    const motion = defaultMotion ?? inheritedMotion;
    const [internalOpen, setInternalOpen] = React.useState(!!defaultOpen);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? !!open : internalOpen;
    const contentId = React.useId();

    const toggle = React.useCallback(() => {
      const next = !isOpen;

      if (!isControlled) {
        setInternalOpen(next);
      }

      onOpenChange?.(next);
    }, [isControlled, isOpen, onOpenChange]);

    const contextValue = React.useMemo(
      () => ({ isOpen, toggle, motion, contentId }),
      [isOpen, toggle, motion, contentId],
    );

    return (
      <SidebarGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          data-slot="sidebar-group"
          data-state={isOpen ? 'open' : 'closed'}
          className={cn(sidebarGroupVariants(), className)}
          {...props}
          data-collapsed={isCollapsed ? '' : undefined}
        >
          {children}
        </div>
      </SidebarGroupContext.Provider>
    );
  },
);

SidebarGroup.displayName = 'Sidebar.Group';

export { SidebarGroup };
