import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { useDefaultMotion } from '../../motion/MotionProvider';
import { DropdownMenuContext, DropdownMenuPortalContext } from './DropdownMenu.context';
import type { DropdownMenuContentProps } from './DropdownMenu.types';
import {
  dropdownMenuContentClassName,
  dropdownMenuContentMotionVariants,
} from './DropdownMenu.variants';

export const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(
  (
    {
      className,
      sideOffset = 4,
      // Radix Select's margin: a menu cut to fit the window still ends visibly short of its edge.
      collisionPadding = 10,
      onCloseAutoFocus,
      onPointerDown,
      portalContainer,
      defaultMotion,
      ...props
    },
    ref,
  ) => {
    const motion = useDefaultMotion(defaultMotion);
    const insidePortal = React.useContext(DropdownMenuPortalContext);
    // Prevent focus return to trigger after closing with mouse click, to not show the outline on the trigger
    const lastPointerTime = React.useRef(0);

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      lastPointerTime.current = Date.now();
      onPointerDown?.(event);
    };

    const handleCloseAutoFocus = (event: Event) => {
      if (Date.now() - lastPointerTime.current < 300) {
        event.preventDefault();
      }

      onCloseAutoFocus?.(event);
    };

    const content = (
      // Reset for descendants (a Select inside the menu): the flag only applies to the Content
      // placed directly in a Portal.
      <DropdownMenuPortalContext.Provider value={false}>
        <DropdownMenuPrimitive.Content
          ref={ref}
          data-slot="dropdown-menu-content"
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          onCloseAutoFocus={handleCloseAutoFocus}
          onPointerDown={handlePointerDown}
          className={cn(
            dropdownMenuContentClassName,
            dropdownMenuContentMotionVariants({ enabled: motion }),
            className,
          )}
          {...props}
        />
      </DropdownMenuPortalContext.Provider>
    );

    // Portals to document.body by default, like Select.Content: rendered in place the menu is
    // clipped by a Modal / Sidepanel and trapped in their stacking context, below z-ws-popout.
    // Inside DropdownMenu.Portal it renders into that one, so the wrapper's container and
    // forceMount win. The Portal gates mounting on its own forceMount, so Content forceMount
    // must reach it too.
    return (
      <DropdownMenuContext.Provider value={{ motion }}>
        {insidePortal ? (
          content
        ) : (
          <DropdownMenuPrimitive.Portal
            container={portalContainer ?? undefined}
            forceMount={props.forceMount}
          >
            {content}
          </DropdownMenuPrimitive.Portal>
        )}
      </DropdownMenuContext.Provider>
    );
  },
);

DropdownMenuContent.displayName = 'DropdownMenu.Content';
