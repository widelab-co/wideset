import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { type ComponentRef, forwardRef, useContext } from 'react';
import { cn } from 'src/lib/utils';

import { DropdownMenuPortalContext, useDropdownMenuContext } from './DropdownMenu.context';
import type { DropdownMenuSubContentProps } from './DropdownMenu.types';
import {
  dropdownMenuCollisionPadding,
  dropdownMenuContentClassName,
  dropdownMenuContentMotionVariants,
} from './DropdownMenu.variants';

export const DropdownMenuSubContent = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownMenuSubContentProps
>(({ className, collisionPadding = dropdownMenuCollisionPadding, ...props }, ref) => {
  const { motion } = useDropdownMenuContext();
  const { container, hasExplicitPortal } = useContext(DropdownMenuPortalContext);

  const content = (
    <DropdownMenuPortalContext.Provider value={{ container, hasExplicitPortal: false }}>
      <DropdownMenuPrimitive.SubContent
        ref={ref}
        data-slot="dropdown-menu-sub-content"
        collisionPadding={collisionPadding}
        className={cn(
          dropdownMenuContentClassName,
          dropdownMenuContentMotionVariants({ enabled: motion }),
          className,
        )}
        {...props}
      />
    </DropdownMenuPortalContext.Provider>
  );

  return hasExplicitPortal ? (
    content
  ) : (
    <DropdownMenuPrimitive.Portal container={container} forceMount={props.forceMount}>
      {content}
    </DropdownMenuPrimitive.Portal>
  );
});

DropdownMenuSubContent.displayName = 'DropdownMenu.SubContent';
