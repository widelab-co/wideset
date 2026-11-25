import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { type ComponentRef, forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import type { DropdownMenuSeparatorProps } from './DropdownMenu.types';
import { dropdownMenuSeparatorClassName } from './DropdownMenu.variants';

export const DropdownMenuSeparator = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    data-slot="dropdown-menu-separator"
    className={cn(dropdownMenuSeparatorClassName, className)}
    {...props}
  />
));

DropdownMenuSeparator.displayName = 'DropdownMenu.Separator';
