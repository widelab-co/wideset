import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { RiArrowRightSLine } from '@remixicon/react';
import { type ComponentRef, forwardRef } from 'react';
import { cn } from 'src/lib/utils';

import { ListItem } from '../list-item/ListItem';
import { useDropdownMenuContext } from './DropdownMenu.context';
import type { DropdownMenuSubTriggerProps } from './DropdownMenu.types';
import {
  dropdownMenuSubTriggerClassName,
  dropdownMenuSubTriggerIconClassName,
  dropdownMenuSubTriggerSuffixClassName,
} from './DropdownMenu.variants';

export const DropdownMenuSubTrigger = forwardRef<
  ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  DropdownMenuSubTriggerProps
>(({ asChild, className, children, ...props }, ref) => {
  const { motion } = useDropdownMenuContext();

  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      data-slot="dropdown-menu-sub-trigger"
      className={asChild ? className : cn(dropdownMenuSubTriggerClassName, className)}
      {...props}
      asChild
    >
      {asChild ? (
        children
      ) : (
        <ListItem defaultMotion={motion}>
          {children}
          <ListItem.Suffix className={dropdownMenuSubTriggerSuffixClassName}>
            <RiArrowRightSLine
              aria-hidden="true"
              focusable="false"
              className={dropdownMenuSubTriggerIconClassName}
            />
          </ListItem.Suffix>
        </ListItem>
      )}
    </DropdownMenuPrimitive.SubTrigger>
  );
});

DropdownMenuSubTrigger.displayName = 'DropdownMenu.SubTrigger';
