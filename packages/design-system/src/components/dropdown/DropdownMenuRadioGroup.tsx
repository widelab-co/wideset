import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { type ComponentRef, forwardRef } from 'react';

import type { DropdownMenuRadioGroupProps } from './DropdownMenu.types';

export const DropdownMenuRadioGroup = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.RadioGroup>,
  DropdownMenuRadioGroupProps
>((props, ref) => (
  <DropdownMenuPrimitive.RadioGroup ref={ref} data-slot="dropdown-menu-radio-group" {...props} />
));

DropdownMenuRadioGroup.displayName = 'DropdownMenu.RadioGroup';
