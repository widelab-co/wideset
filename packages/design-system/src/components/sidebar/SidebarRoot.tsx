import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { AppShellContext } from '../app-shell/AppShell.context';
import type { AppShellSidebarState } from '../app-shell/AppShell.types';
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
      surface: surfaceProp,
      defaultMotion,
      id: idProp,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const motion = useDefaultMotion(defaultMotion);
    // Inside an AppShell the sidebar takes the surface of the app's direction; its own
    // `surface` prop wins.
    const shell = React.useContext(AppShellContext);
    const direction = shell?.direction;
    const surface = surfaceProp ?? (direction ? sidebarSurfaceByDirection[direction] : 'page');
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

    // Lets AppShell.SidebarTrigger toggle this sidebar.
    const registerSidebar = shell?.registerSidebar;
    React.useLayoutEffect(() => {
      if (!registerSidebar) return;

      const isOwn = (current: AppShellSidebarState | null) => current?.sidebarId === sidebarId;
      registerSidebar((current) =>
        current && !isOwn(current) ? current : { isCollapsed, toggle, sidebarId, motion },
      );

      return () => registerSidebar((current) => (isOwn(current) ? null : current));
    }, [registerSidebar, isCollapsed, toggle, sidebarId, motion]);

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
              surface,
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
