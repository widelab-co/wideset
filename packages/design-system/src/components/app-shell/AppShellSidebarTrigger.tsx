import { RiSideBarLine } from '@remixicon/react';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { IconButton } from '../button/IconButton';
import { useAppShellContext } from './AppShell.context';
import type { AppShellSidebarTriggerProps } from './AppShell.types';
import { appShellSidebarTriggerVariants } from './AppShell.variants';

const AppShellSidebarTrigger = React.forwardRef<HTMLButtonElement, AppShellSidebarTriggerProps>(
  (
    {
      className,
      onClick,
      'aria-label': ariaLabelProp,
      expandLabel = 'Expand sidebar',
      collapseLabel = 'Collapse sidebar',
      defaultMotion,
      ...props
    },
    ref,
  ) => {
    // The Sidebar registers before paint in the browser and never on the server.
    const { sidebar } = useAppShellContext();

    if (!sidebar) return null;

    const isCollapsed = sidebar.isCollapsed;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (!event.defaultPrevented) sidebar.toggle();
    };

    return (
      <IconButton
        data-slot="app-shell-sidebar-trigger"
        {...props}
        ref={ref}
        icon={RiSideBarLine}
        variant="secondary"
        preset="ghost"
        size="sm"
        iconClassName="text-ws-static-subtle size-ws-9"
        onClick={handleClick}
        defaultMotion={defaultMotion ?? sidebar.motion}
        aria-label={ariaLabelProp || (isCollapsed ? expandLabel : collapseLabel)}
        aria-expanded={!isCollapsed}
        aria-controls={sidebar.sidebarId}
        className={cn(appShellSidebarTriggerVariants(), className)}
      />
    );
  },
);

AppShellSidebarTrigger.displayName = 'AppShell.SidebarTrigger';

export { AppShellSidebarTrigger };
