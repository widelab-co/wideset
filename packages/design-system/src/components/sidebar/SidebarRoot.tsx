import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { AppShellContext } from '../app-shell/AppShell.context';
import { SidebarContext } from './Sidebar.context';
import type { SidebarProps } from './Sidebar.types';
import {
  sidebarMotionVariants,
  sidebarSurfaceByDirection,
  sidebarVariants,
} from './Sidebar.variants';

const SidebarRoot = React.forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      defaultCollapsed,
      collapsed,
      onCollapsedChange,
      defaultMotion,
      id: idProp,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const motion = useDefaultMotion(defaultMotion);
    // Inside an AppShell the sidebar takes the surface of the app's direction.
    const direction = React.useContext(AppShellContext)?.direction ?? 'flat';
    const [internalCollapsed, setInternalCollapsed] = React.useState(!!defaultCollapsed);
    const isControlled = collapsed !== undefined;
    const isCollapsed = isControlled ? !!collapsed : internalCollapsed;
    const generatedId = React.useId();
    const sidebarId = idProp ?? generatedId;

    const toggle = React.useCallback(() => {
      const next = !isCollapsed;

      if (!isControlled) {
        setInternalCollapsed(next);
      }

      onCollapsedChange?.(next);
    }, [isControlled, onCollapsedChange, isCollapsed]);

    const contextValue = React.useMemo(
      () => ({ isCollapsed, toggle, motion, sidebarId }),
      [isCollapsed, toggle, motion, sidebarId],
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          ref={ref}
          id={sidebarId}
          data-slot="sidebar"
          data-state={isCollapsed ? 'collapsed' : 'expanded'}
          className={cn(
            sidebarVariants({
              collapsed: isCollapsed,
              surface: sidebarSurfaceByDirection[direction],
            }),
            sidebarMotionVariants({ enabled: motion }),
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  },
);

SidebarRoot.displayName = 'Sidebar';

export { SidebarRoot };
