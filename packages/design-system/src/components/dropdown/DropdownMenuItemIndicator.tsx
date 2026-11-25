import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { type ComponentRef, forwardRef } from 'react';

import type { DropdownMenuItemIndicatorProps } from './DropdownMenu.types';

export const DropdownMenuItemIndicator = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.ItemIndicator>,
  DropdownMenuItemIndicatorProps
>((props, ref) => (
  <DropdownMenuPrimitive.ItemIndicator
    ref={ref}
    data-slot="dropdown-menu-item-indicator"
    {...props}
  />
));

DropdownMenuItemIndicator.displayName = 'DropdownMenu.ItemIndicator';
