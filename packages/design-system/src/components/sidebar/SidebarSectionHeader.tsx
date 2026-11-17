import { RiArrowRightSLine } from '@remixicon/react';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { SidebarContext, useSidebarGroupContext } from './Sidebar.context';
import type { SidebarSectionHeaderProps } from './Sidebar.types';
import {
  sidebarGroupChevronVariants,
  sidebarGroupMotionVariants,
  sidebarSectionHeaderToggleVariants,
} from './SidebarGroup.variants';

/**
 * The toggle of a collapsible section: Figma's Sidebar Item `Type=Folder`, 48px tall. The chevron
 * follows the title, right beside it, so the title keeps the left edge of a plain section header
 * (a design decision ahead of Figma, which still draws it before the title). It takes the title's
 * colour (currentColor), so both strengthen together on hover. Collapsed, the rail shows the
 * chevron alone and the title stays the button's name.
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
      // contain-inline-size: the text never sets the rail's width (the scroll viewport sizes to
      // its widest child), so the label cuts short inside the column instead of widening it.
      className={cn(
        'flex min-w-0 items-end contain-inline-size',
        // Figma `Type=Folder` is 48px with the row's padding on its button; `Type=Group` is 40px.
        collapsible ? 'h-ws-18' : 'h-ws-16 px-ws-5 py-ws-3',
        className,
      )}
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
