import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { type ComponentRef, forwardRef } from 'react';

import type { DropdownMenuGroupProps } from './DropdownMenu.types';

export const DropdownMenuGroup = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Group>,
  DropdownMenuGroupProps
>((props, ref) => (
  <DropdownMenuPrimitive.Group ref={ref} data-slot="dropdown-menu-group" {...props} />
));

DropdownMenuGroup.displayName = 'DropdownMenu.Group';
