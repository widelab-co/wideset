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
 * sibling and a direct DOM child of the group. A custom component can return this button directly.
 * The sidebar hides the button and the group's rows on the collapsed rail.
 */
const SidebarGroupTrigger = React.forwardRef<HTMLButtonElement, SidebarGroupTriggerProps>(
  (
    {
      className,
      onClick,
      hidden,
      'aria-label': ariaLabelProp,
      expandLabel = 'Expand group',
      collapseLabel = 'Collapse group',
      ...props
    },
    ref,
  ) => {
    const { isCollapsed } = useSidebarContext();
    const { isOpen, toggle, motion, contentId } = useSidebarGroupContext();

    const effectiveHidden = isCollapsed ? true : hidden;

    return (
      <button
        ref={ref}
        type="button"
        data-slot="sidebar-group-trigger"
        aria-label={ariaLabelProp || (isOpen ? collapseLabel : expandLabel)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        hidden={effectiveHidden}
        className={cn(
          sidebarGroupTriggerVariants(),
          sidebarGroupMotionVariants({ enabled: motion }),
          className,
          effectiveHidden === true && 'hidden',
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
