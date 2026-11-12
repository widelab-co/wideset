import { Slot } from '@radix-ui/react-slot';
import { RiSidebarFoldLine } from '@remixicon/react';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { MotionProvider } from '../../motion/MotionProvider';
import { IconButton } from '../button/IconButton';
import { useSidebarContext } from './Sidebar.context';
import type { SidebarTriggerProps } from './Sidebar.types';

const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  (
    {
      children,
      asChild,
      className,
      onClick,
      'aria-label': ariaLabelProp,
      expandLabel = 'Expand sidebar',
      collapseLabel = 'Collapse sidebar',
      defaultMotion,
      ...restProps
    },
    ref,
  ) => {
    const { toggle, isCollapsed, motion, sidebarId } = useSidebarContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);

      if (!e.defaultPrevented) toggle();
    };

    const ariaLabel = ariaLabelProp || (isCollapsed ? expandLabel : collapseLabel);

    if (asChild) {
      return (
        <MotionProvider enabled={defaultMotion ?? motion}>
          <Slot
            data-slot="sidebar-trigger"
            aria-label={ariaLabel}
            {...restProps}
            ref={ref}
            onClick={handleClick}
            aria-expanded={!isCollapsed}
            aria-controls={sidebarId}
            className={cn(isCollapsed ? 'size-ws-15 mx-auto rotate-180' : 'ml-auto', className)}
          >
            {children}
          </Slot>
        </MotionProvider>
      );
    }

    return (
      <IconButton
        data-slot="sidebar-trigger"
        {...restProps}
        icon={RiSidebarFoldLine}
        variant="secondary"
        preset="ghost"
        size="sm"
        iconClassName="text-ws-static-subtle size-ws-9"
        defaultMotion={defaultMotion ?? motion}
        ref={ref}
        onClick={handleClick}
        aria-label={ariaLabel}
        aria-expanded={!isCollapsed}
        aria-controls={sidebarId}
        className={cn(isCollapsed ? 'size-ws-15 mx-auto rotate-180' : 'ml-auto', className)}
      >
        {children}
      </IconButton>
    );
  },
);

SidebarTrigger.displayName = 'Sidebar.Trigger';

export { SidebarTrigger };
