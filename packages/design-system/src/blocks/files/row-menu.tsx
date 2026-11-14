import {
  type RemixiconComponentType,
  RiDeleteBinLine,
  RiDownloadLine,
  RiExternalLinkLine,
  RiFileCopy2Line,
  RiFolderTransferLine,
  RiMoreFill,
  RiPencilLine,
  RiPushpinLine,
  RiUnpinLine,
} from '@remixicon/react';
import { DropdownMenu, IconButton, ListItem } from '@wideset/react';

import type { Item } from './data';

export type RowAction = 'open' | 'download' | 'rename' | 'duplicate' | 'move' | 'pin' | 'delete';

const Entry = ({
  label,
  icon: Icon,
  onSelect,
  danger,
}: {
  label: string;
  icon: RemixiconComponentType;
  onSelect: () => void;
  danger?: boolean;
}) => (
  <DropdownMenu.Item variant={danger ? 'danger' : undefined} onSelect={onSelect}>
    <ListItem.Prefix>
      <Icon className="size-ws-9" />
    </ListItem.Prefix>
    <ListItem.Content>
      <ListItem.Label>{label}</ListItem.Label>
    </ListItem.Content>
  </DropdownMenu.Item>
);

/**
 * One file's or folder's own actions, behind the ⋯ at the end of its row or tile: what to do
 * with it, then where it lives, then Delete, alone and last. Delete only moves it to the trash.
 */
export function RowMenu({ item, onAction }: { item: Item; onAction: (action: RowAction) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton
          icon={RiMoreFill}
          size="xs"
          variant="secondary"
          preset="ghost"
          aria-label={`Actions for ${item.name}`}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[13rem]">
        <Entry label="Open" icon={RiExternalLinkLine} onSelect={() => onAction('open')} />
        <Entry label="Download" icon={RiDownloadLine} onSelect={() => onAction('download')} />
        <Entry label="Rename" icon={RiPencilLine} onSelect={() => onAction('rename')} />
        <Entry label="Duplicate" icon={RiFileCopy2Line} onSelect={() => onAction('duplicate')} />
        <DropdownMenu.Separator />
        <Entry label="Move" icon={RiFolderTransferLine} onSelect={() => onAction('move')} />
        <Entry
          label={item.pinned ? 'Unpin' : 'Pin'}
          icon={item.pinned ? RiUnpinLine : RiPushpinLine}
          onSelect={() => onAction('pin')}
        />
        <DropdownMenu.Separator />
        <Entry label="Delete" icon={RiDeleteBinLine} danger onSelect={() => onAction('delete')} />
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
