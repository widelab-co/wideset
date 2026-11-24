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
      ...props
    },
    ref,
  ) => {
    // Expanded until the Sidebar mounts (server render).
    const { sidebar } = useAppShellContext();
    const isCollapsed = sidebar?.isCollapsed ?? false;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (!event.defaultPrevented) sidebar?.toggle();
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
        aria-label={ariaLabelProp || (isCollapsed ? expandLabel : collapseLabel)}
        aria-expanded={!isCollapsed}
        aria-controls={sidebar?.sidebarId}
        className={cn(appShellSidebarTriggerVariants(), className)}
      />
    );
  },
);

AppShellSidebarTrigger.displayName = 'AppShell.SidebarTrigger';

export { AppShellSidebarTrigger };
