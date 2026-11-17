import { RiArrowRightSLine } from '@remixicon/react';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useSidebarContext, useSidebarGroupContext } from './Sidebar.context';
import type { SidebarGroupTriggerProps } from './Sidebar.types';
import {
  sidebarGroupChevronVariants,
  sidebarGroupMotionVariants,
  sidebarGroupTriggerVariants,
} from './SidebarGroup.variants';

/**
 * The chevron at the head item's right end. Place it right after the head `Sidebar.Item`, as its
 * sibling: the item stays a link, the chevron is its own button. Collapsed, the sidebar has no
 * room for it and hides the group's rows, so it renders nothing.
 */
const SidebarGroupTrigger = React.forwardRef<HTMLButtonElement, SidebarGroupTriggerProps>(
  (
    {
      className,
      onClick,
      'aria-label': ariaLabelProp,
      expandLabel = 'Expand group',
      collapseLabel = 'Collapse group',
      ...props
    },
    ref,
  ) => {
    const { isCollapsed } = useSidebarContext();
    const { isOpen, toggle, motion, contentId } = useSidebarGroupContext();

    if (isCollapsed) return null;

    return (
      <button
        ref={ref}
        type="button"
        data-slot="sidebar-group-trigger"
        aria-label={ariaLabelProp || (isOpen ? collapseLabel : expandLabel)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className={cn(
          sidebarGroupTriggerVariants(),
          sidebarGroupMotionVariants({ enabled: motion }),
          className,
        )}
        onClick={(e) => {
          onClick?.(e);

          if (!e.defaultPrevented) toggle();
        }}
        {...props}
      >
        <RiArrowRightSLine
          aria-hidden="true"
          className={sidebarGroupChevronVariants({ open: isOpen, motion })}
        />
      </button>
    );
  },
);

SidebarGroupTrigger.displayName = 'Sidebar.GroupTrigger';

export { SidebarGroupTrigger };
