import type * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type { ComponentPropsWithoutRef, FC } from 'react';

import type { MotionProps } from '../../motion/Motion.types';
import type { ListItemProps } from '../list-item/ListItem.types';
import type {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuItemIndicator,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from './DropdownMenu.parts';
import type { DropdownMenuContent } from './DropdownMenuContent';
import type { DropdownMenuItem } from './DropdownMenuItem';
import type { DropdownMenuLabel } from './DropdownMenuLabel';
import type { DropdownMenuSeparator } from './DropdownMenuSeparator';
import type { DropdownMenuTrigger } from './DropdownMenuTrigger';

/** An anchored menu of contextual actions. */
export type DropdownMenuProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>;

/** The control that opens or toggles the associated content. */
export type DropdownMenuTriggerProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Trigger
>;

/** The content surface rendered within `DropdownMenu`. */
export type DropdownMenuContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
> &
  MotionProps & {
    /** DOM node to portal the content into. Defaults to `document.body`. */
    portalContainer?: Element | DocumentFragment | null;
  };

/** An individual item within `DropdownMenu`. */
export type DropdownMenuItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> &
  ListItemProps;

/** The text label associated with `DropdownMenu`. */
export type DropdownMenuLabelProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Label
> & {
  /** Indents the label so it aligns with item text in menus that have a leading icon or checkmark slot. */
  inset?: boolean;
};

/** A visual separator between groups of items. */
export type DropdownMenuSeparatorProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Separator
>;

/** A container grouping related items. */
export type DropdownMenuGroupProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>;

/** The portal destination for floating content. */
export type DropdownMenuPortalProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Portal>;

/** A group of mutually exclusive radio options. */
export type DropdownMenuRadioGroupProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.RadioGroup
>;

/** A toggleable choice within the menu. */
export type DropdownMenuCheckboxItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.CheckboxItem
>;

/** An indicator shown for a checked menu item. */
export type DropdownMenuItemIndicatorProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.ItemIndicator
>;

/** A choice within a radio group. */
export type DropdownMenuRadioItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.RadioItem
>;

/** The panel that displays a submenu's items. */
export type DropdownMenuSubContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.SubContent
>;

/** The menu row that opens a submenu. */
export type DropdownMenuSubTriggerProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.SubTrigger
>;

export type DropdownMenuWithSubComponents = FC<DropdownMenuProps> & {
  CheckboxItem: typeof DropdownMenuCheckboxItem;
  Content: typeof DropdownMenuContent;
  Group: typeof DropdownMenuGroup;
  Item: typeof DropdownMenuItem;
  ItemIndicator: typeof DropdownMenuItemIndicator;
  Label: typeof DropdownMenuLabel;
  Portal: typeof DropdownMenuPortal;
  RadioGroup: typeof DropdownMenuRadioGroup;
  RadioItem: typeof DropdownMenuRadioItem;
  Separator: typeof DropdownMenuSeparator;
  Sub: typeof DropdownMenuSub;
  SubContent: typeof DropdownMenuSubContent;
  SubTrigger: typeof DropdownMenuSubTrigger;
  Trigger: typeof DropdownMenuTrigger;
};
