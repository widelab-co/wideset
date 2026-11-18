import { RiMoreFill } from '@remixicon/react';
import { DropdownMenu, IconButton, ListItem } from '@wideset/react';

import type { Customer } from './data';

const Item = ({ label, onSelect }: { label: string; onSelect?: () => void }) => (
  <DropdownMenu.Item onSelect={onSelect}>
    <ListItem.Content>
      <ListItem.Label>{label}</ListItem.Label>
    </ListItem.Content>
  </DropdownMenu.Item>
);

/** A row's own actions, behind the ⋯ at its end. */
export function RowMenu({
  customer,
  onAssignToMe,
}: {
  customer: Customer;
  onAssignToMe: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton
          icon={RiMoreFill}
          size="xs"
          variant="secondary"
          preset="ghost"
          aria-label={`Actions for ${customer.name}`}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <Item label="Open customer" />
        <Item label="Assign to me" onSelect={onAssignToMe} />
        <Item
          label="Copy domain"
          onSelect={() => void navigator.clipboard?.writeText(customer.id).catch(() => {})}
        />
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="danger">
          <ListItem.Content>
            <ListItem.Label>Delete customer</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
