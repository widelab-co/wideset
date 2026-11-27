import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { type ComponentRef, forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import type { DropdownMenuLabelProps } from './DropdownMenu.types';
import { dropdownMenuLabelVariants } from './DropdownMenu.variants';

export const DropdownMenuLabel = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    data-slot="dropdown-menu-label"
    className={cn(dropdownMenuLabelVariants({ inset }), className)}
    {...props}
  />
));

DropdownMenuLabel.displayName = 'DropdownMenu.Label';
