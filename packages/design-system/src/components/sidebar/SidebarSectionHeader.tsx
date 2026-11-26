import * as React from 'react';
import { cn } from 'src/lib/utils';

import type { SidebarSectionHeaderProps } from './Sidebar.types';

/**
 * The heading over a group of items: Figma's Sidebar Item `Type=Group`. It looks the same in both
 * modes; collapsed, the rail is narrow, so the label shortens to its first letters ("P…") and the
 * groups stay apart and named, as in Figma.
 */
const SidebarSectionHeader = React.forwardRef<HTMLDivElement, SidebarSectionHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="sidebar-section-header"
      // contain-inline-size: the text never sets the rail's width (the scroll viewport sizes to
      // its widest child), so the label cuts short inside the column instead of widening it.
      className={cn(
        'h-ws-16 px-ws-5 py-ws-3 flex min-w-0 items-end contain-inline-size',
        className,
      )}
      {...props}
    >
      <span className="typography-caption-strong-md text-ws-static-subtle min-w-0 truncate">
        {children}
      </span>
    </div>
  ),
);

SidebarSectionHeader.displayName = 'Sidebar.SectionHeader';

export { SidebarSectionHeader };
