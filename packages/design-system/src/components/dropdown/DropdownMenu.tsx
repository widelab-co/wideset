import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { RiArrowRightSLine } from '@remixicon/react';
import * as React from 'react';
import { cn } from 'src/lib/utils';

import { ListItem } from '../list-item/ListItem';
import { useDropdownMenuContext } from './DropdownMenu.context';
import {
  dropdownMenuContentClassName,
  dropdownMenuContentMotionVariants,
  dropdownMenuItemClassName,
} from './DropdownMenu.variants';
import { DropdownMenuContent } from './DropdownMenuContent';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuLabel } from './DropdownMenuLabel';
import { DropdownMenuPortal } from './DropdownMenuPortal';
import { DropdownMenuSeparator } from './DropdownMenuSeparator';
import { DropdownMenuTrigger } from './DropdownMenuTrigger';

const DropdownMenu = ((props: DropdownMenuPrimitive.DropdownMenuProps) => (
  <DropdownMenuPrimitive.Root {...props} />
)) as React.FC<DropdownMenuPrimitive.DropdownMenuProps> & {
  Content: typeof DropdownMenuContent;
  Group: typeof DropdownMenuGroup;
  Item: typeof DropdownMenuItem;
  Label: typeof DropdownMenuLabel;
  Portal: typeof DropdownMenuPortal;
  RadioGroup: typeof DropdownMenuRadioGroup;
  Separator: typeof DropdownMenuSeparator;
  Trigger: typeof DropdownMenuTrigger;
  CheckboxItem: typeof DropdownMenuCheckboxItem;
  ItemIndicator: typeof DropdownMenuItemIndicator;
  Sub: typeof DropdownMenuPrimitive.Sub;
  SubTrigger: typeof DropdownMenuSubTrigger;
  SubContent: typeof DropdownMenuSubContent;
  RadioItem: typeof DropdownMenuRadioItem;
};

DropdownMenu.Content = DropdownMenuContent;
export const DropdownMenuGroup = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>
>((props, ref) => (
  <DropdownMenuPrimitive.Group ref={ref} data-slot="dropdown-menu-group" {...props} />
));
DropdownMenuGroup.displayName = 'DropdownMenu.Group';
DropdownMenu.Group = DropdownMenuGroup;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Label = DropdownMenuLabel;
DropdownMenu.Portal = DropdownMenuPortal;
export const DropdownMenuRadioGroup = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.RadioGroup>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioGroup>
>((props, ref) => (
  <DropdownMenuPrimitive.RadioGroup ref={ref} data-slot="dropdown-menu-radio-group" {...props} />
));
DropdownMenuRadioGroup.displayName = 'DropdownMenu.RadioGroup';
DropdownMenu.RadioGroup = DropdownMenuRadioGroup;
DropdownMenu.Separator = DropdownMenuSeparator;
DropdownMenu.Trigger = DropdownMenuTrigger;
export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>((props, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    data-slot="dropdown-menu-checkbox-item"
    {...props}
  />
));
DropdownMenuCheckboxItem.displayName = 'DropdownMenu.CheckboxItem';
DropdownMenu.CheckboxItem = DropdownMenuCheckboxItem;
export const DropdownMenuItemIndicator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.ItemIndicator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.ItemIndicator>
>((props, ref) => (
  <DropdownMenuPrimitive.ItemIndicator
    ref={ref}
    data-slot="dropdown-menu-item-indicator"
    {...props}
  />
));
DropdownMenuItemIndicator.displayName = 'DropdownMenu.ItemIndicator';
DropdownMenu.ItemIndicator = DropdownMenuItemIndicator;
export const DropdownMenuSub = DropdownMenuPrimitive.Sub;
DropdownMenu.Sub = DropdownMenuSub;
// A Single Select row with Figma's Suffix chevron (arrow-right-s-line, 16px in a 24px box); it
// keeps the hover fill while its submenu is open.
export const DropdownMenuSubTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => {
  const { motion } = useDropdownMenuContext();

  return (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      data-slot="dropdown-menu-sub-trigger"
      className={cn(
        dropdownMenuItemClassName,
        'data-[state=open]:bg-ws-dynamic-secondary-alpha-hover',
        className,
      )}
      {...props}
      asChild
    >
      <ListItem defaultMotion={motion}>
        {children}
        <ListItem.Suffix className="size-ws-12 justify-center">
          <RiArrowRightSLine aria-hidden="true" focusable="false" className="size-ws-9" />
        </ListItem.Suffix>
      </ListItem>
    </DropdownMenuPrimitive.SubTrigger>
  );
});
DropdownMenuSubTrigger.displayName = 'DropdownMenu.SubTrigger';
DropdownMenu.SubTrigger = DropdownMenuSubTrigger;
export const DropdownMenuSubContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => {
  const { motion } = useDropdownMenuContext();

  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      data-slot="dropdown-menu-sub-content"
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
DropdownMenu.SubContent = DropdownMenuSubContent;
// Figma's Single Select row: ListItem paints the checked fill and the check from Radix's
// `data-state`, so no ItemIndicator is needed.
export const DropdownMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => {
  const { motion } = useDropdownMenuContext();

  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      data-slot="dropdown-menu-radio-item"
      className={cn(dropdownMenuItemClassName, className)}
      {...props}
      asChild
    >
      <ListItem defaultMotion={motion}>{children}</ListItem>
    </DropdownMenuPrimitive.RadioItem>
  );
});
DropdownMenuRadioItem.displayName = 'DropdownMenu.RadioItem';
DropdownMenu.RadioItem = DropdownMenuRadioItem;

DropdownMenu.displayName = 'DropdownMenu';

export { DropdownMenu, DropdownMenuPortal };
