// TODO(custom): a menu item that toggles on and off, ticked while on; Wideset exports DropdownMenu.CheckboxItem as a bare Radix part with no styling.
import { DropdownMenu, ListItem } from '@wideset/react';
import type { ReactNode } from 'react';

/**
 * One of several things that can each be on (a tag on a customer): drawn as `DropdownMenu.Item`
 * draws a row, with `ListItem`'s own tick on the ones that are on, and announced as a checkbox
 * item. Toggling keeps the menu open, so several can be set in one go.
 */
export function MenuCheck({
  checked,
  onCheckedChange,
  children,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <DropdownMenu.CheckboxItem
      checked={checked}
      onCheckedChange={onCheckedChange}
      onSelect={(event) => event.preventDefault()}
      asChild
      className="min-h-ws-14 outline-hidden"
    >
      <ListItem>{children}</ListItem>
    </DropdownMenu.CheckboxItem>
  );
}
