import { RiDeleteBinLine, RiDownloadLine, RiUserSharedLine } from '@remixicon/react';
import { ActionBar, Avatar, Button, DropdownMenu, ListItem } from '@wideset/react';

import { type OwnerId, OWNERS } from './data';

/** The actions on the selected rows, floating over the page while anything is selected. */
export function SelectionBar({
  count,
  onClear,
  onAssign,
}: {
  count: number;
  onClear: () => void;
  onAssign: (owner: OwnerId) => void;
}) {
  return (
    <ActionBar
      isOpen={count > 0}
      amountSelected={count}
      onClose={onClear}
      closeAriaLabel="Clear selection"
    >
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary" preset="border" size="sm">
            <Button.Icon icon={RiUserSharedLine} />
            Assign owner
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content side="top" align="start">
          {(Object.keys(OWNERS) as OwnerId[]).map((id) => (
            <DropdownMenu.Item key={id} onSelect={() => onAssign(id)}>
              <ListItem.Prefix>
                <Avatar size="xs" initials={OWNERS[id].initials} />
              </ListItem.Prefix>
              <ListItem.Content>
                <ListItem.Label>{OWNERS[id].name}</ListItem.Label>
              </ListItem.Content>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu>
      <Button variant="secondary" preset="border" size="sm">
        <Button.Icon icon={RiDownloadLine} />
        Export
      </Button>
      <Button variant="danger" preset="border" size="sm">
        <Button.Icon icon={RiDeleteBinLine} />
        Delete
      </Button>
    </ActionBar>
  );
}
