import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { type ComponentRef, forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import { ListItem } from '../list-item/ListItem';
import { useDropdownMenuContext } from './DropdownMenu.context';
import type { DropdownMenuItemProps } from './DropdownMenu.types';
import { dropdownMenuItemClassName } from './DropdownMenu.variants';

export const DropdownMenuItem = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, children, onSelect, variant, defaultMotion, ...props }, ref) => {
  const { motion } = useDropdownMenuContext();

  return (
    <DropdownMenuPrimitive.Item
      ref={ref}
      data-slot="dropdown-menu-item"
      className={cn(dropdownMenuItemClassName, className)}
      {...props}
      asChild
      onSelect={onSelect}
    >
      <ListItem variant={variant} defaultMotion={defaultMotion ?? motion}>
        {children}
      </ListItem>
    </DropdownMenuPrimitive.Item>
  );
});

DropdownMenuItem.displayName = 'DropdownMenu.Item';
