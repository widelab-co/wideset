import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { type ComponentRef, forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import type { DropdownMenuTriggerProps } from './DropdownMenu.types';
import { dropdownMenuTriggerVariants } from './DropdownMenu.variants';

export const DropdownMenuTrigger = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Trigger>,
  DropdownMenuTriggerProps
>(({ className, asChild, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    data-slot="dropdown-menu-trigger"
    className={cn(dropdownMenuTriggerVariants({ focusOutline: !asChild }), className)}
    asChild={asChild}
    {...props}
  />
));

DropdownMenuTrigger.displayName = 'DropdownMenu.Trigger';
