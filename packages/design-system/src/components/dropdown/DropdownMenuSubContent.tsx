import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { type ComponentRef, forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import { useDropdownMenuContext } from './DropdownMenu.context';
import type { DropdownMenuSubContentProps } from './DropdownMenu.types';
import {
  dropdownMenuContentClassName,
  dropdownMenuContentMotionVariants,
} from './DropdownMenu.variants';

export const DropdownMenuSubContent = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  DropdownMenuSubContentProps
>(({ className, collisionPadding = 10, ...props }, ref) => {
  const { motion } = useDropdownMenuContext();

  return (
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
  );
});

DropdownMenuSubContent.displayName = 'DropdownMenu.SubContent';
