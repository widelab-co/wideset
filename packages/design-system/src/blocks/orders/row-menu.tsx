import { RiMoreFill } from '@remixicon/react';
import { DropdownMenu, IconButton, ListItem } from '@wideset/react';

type RowMenuProps = {
  /** The order's number, as shown: "#6178". */
  order: string;
  /** The order's page. */
  href: string;
  /** Opens the refund dialog; left out when nothing is left to refund, which disables the item. */
  onRefund?: () => void;
};

const Label = ({ children }: { children: string }) => (
  <ListItem.Content>
    <ListItem.Label>{children}</ListItem.Label>
  </ListItem.Content>
);

/**
 * A row's own actions, behind the ⋯ at its end. Refund stays in the list when it cannot be used,
 * disabled, so the menu is the same on every row.
 */
export function RowMenu({ order, href, onRefund }: RowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton
          icon={RiMoreFill}
          size="xs"
          variant="secondary"
          preset="ghost"
          aria-label={`Actions for order ${order}`}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item onSelect={() => window.location.assign(href)}>
          <Label>View order</Label>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Label>Download invoice</Label>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item disabled={!onRefund} onSelect={onRefund}>
          <Label>Refund</Label>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
