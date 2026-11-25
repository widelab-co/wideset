import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import {
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
import type { DropdownMenuProps, DropdownMenuWithSubComponents } from './DropdownMenu.types';
import { DropdownMenuContent } from './DropdownMenuContent';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuLabel } from './DropdownMenuLabel';
import { DropdownMenuSeparator } from './DropdownMenuSeparator';
import { DropdownMenuTrigger } from './DropdownMenuTrigger';

const DropdownMenu = ((props: DropdownMenuProps) => (
  <DropdownMenuPrimitive.Root {...props} />
)) as DropdownMenuWithSubComponents;

DropdownMenu.displayName = 'DropdownMenu';

DropdownMenu.CheckboxItem = DropdownMenuCheckboxItem;
DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Group = DropdownMenuGroup;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.ItemIndicator = DropdownMenuItemIndicator;
DropdownMenu.Label = DropdownMenuLabel;
DropdownMenu.Portal = DropdownMenuPortal;
DropdownMenu.RadioGroup = DropdownMenuRadioGroup;
DropdownMenu.RadioItem = DropdownMenuRadioItem;
DropdownMenu.Separator = DropdownMenuSeparator;
DropdownMenu.Sub = DropdownMenuSub;
DropdownMenu.SubContent = DropdownMenuSubContent;
DropdownMenu.SubTrigger = DropdownMenuSubTrigger;
DropdownMenu.Trigger = DropdownMenuTrigger;

export * from './DropdownMenu.parts';
export { DropdownMenu };
