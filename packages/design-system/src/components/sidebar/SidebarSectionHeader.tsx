import { RiArrowRightSLine } from '@remixicon/react';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { SidebarContext, useSidebarGroupContext } from './Sidebar.context';
import type { SidebarSectionHeaderProps } from './Sidebar.types';
import {
  sidebarGroupChevronVariants,
  sidebarGroupMotionVariants,
  sidebarSectionHeaderToggleVariants,
  sidebarSectionHeaderVariants,
} from './SidebarGroup.variants';

/**
 * A collapsible section toggle places the chevron next to the title so the title keeps the
 * left edge of a plain section header. On the collapsed rail the title names the chevron button.
 */
const SectionHeaderToggle = ({ children }: { children: React.ReactNode }) => {
  const isCollapsed = !!React.useContext(SidebarContext)?.isCollapsed;
  const { isOpen, toggle, motion, contentId } = useSidebarGroupContext();

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={contentId}
      onClick={toggle}
      className={cn(
        sidebarSectionHeaderToggleVariants({ collapsed: isCollapsed }),
        sidebarGroupMotionVariants({ enabled: motion }),
      )}
    >
      <span
        className={cn('typography-caption-strong-md min-w-0 truncate', isCollapsed && 'sr-only')}
      >
        {children}
      </span>
      <RiArrowRightSLine
        aria-hidden="true"
        className={sidebarGroupChevronVariants({ open: isOpen, motion })}
      />
    </button>
  );
};

/**
 * The heading over a group of items: Figma's Sidebar Item `Type=Group`. It looks the same in both
 * modes; collapsed, the rail is narrow, so the label shortens to its first letters ("P…") and the
 * groups stay apart and named, as in Figma. `collapsible` turns it into the toggle of the
 * `Sidebar.Group` around it.
 */
const SidebarSectionHeader = React.forwardRef<HTMLDivElement, SidebarSectionHeaderProps>(
  ({ collapsible = false, children, className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-section-header"
      className={cn(sidebarSectionHeaderVariants({ collapsible }), className)}
      {...props}
    >
      {collapsible ? (
        <SectionHeaderToggle>{children}</SectionHeaderToggle>
      ) : (
        <span className="typography-caption-strong-md text-ws-static-subtle min-w-0 truncate">
          {children}
        </span>
      )}
    </div>
  ),
);

SidebarSectionHeader.displayName = 'Sidebar.SectionHeader';

export { SidebarSectionHeader };
