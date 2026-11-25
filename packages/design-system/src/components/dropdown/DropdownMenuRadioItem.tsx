import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { type ComponentRef, forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import { ListItem } from '../list-item/ListItem';
import { useDropdownMenuContext } from './DropdownMenu.context';
import type { DropdownMenuRadioItemProps } from './DropdownMenu.types';
import { dropdownMenuItemClassName } from './DropdownMenu.variants';

export const DropdownMenuRadioItem = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(({ asChild, className, children, ...props }, ref) => {
  const { motion } = useDropdownMenuContext();

  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      data-slot="dropdown-menu-radio-item"
      className={asChild ? className : cn(dropdownMenuItemClassName, className)}
      {...props}
      asChild
    >
      {asChild ? children : <ListItem defaultMotion={motion}>{children}</ListItem>}
    </DropdownMenuPrimitive.RadioItem>
  );
});

DropdownMenuRadioItem.displayName = 'DropdownMenu.RadioItem';
