import { DropdownMenu, ListItem } from '@wideset/react';
import type { ReactNode } from 'react';

/**
 * One choice in a `DropdownMenu.RadioGroup` (a workspace, a theme, an account): drawn as
 * `DropdownMenu.Item` draws a row, with `ListItem`'s own tick and selected fill on the one picked,
 * and announced as a radio item, so a screen reader hears which one is on.
 */
export function MenuChoice({
  value,
  onSelect,
  children,
}: {
  value: string;
  onSelect?: () => void;
  children: ReactNode;
}) {
  return (
    <DropdownMenu.RadioItem
      value={value}
      onSelect={onSelect}
      asChild
      className="min-h-ws-14 outline-hidden"
    >
      <ListItem>{children}</ListItem>
    </DropdownMenu.RadioItem>
  );
}
