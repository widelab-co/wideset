import {
  type RemixiconComponentType,
  RiDeleteBinLine,
  RiExternalLinkLine,
  RiMoreFill,
  RiPencilLine,
  RiShareLine,
} from '@remixicon/react';
import { DropdownMenu, IconButton, ListItem } from '@wideset/react';

import type { Entry } from './data';

const Item = ({
  label,
  icon: Icon,
  onSelect,
  danger,
}: {
  label: string;
  icon: RemixiconComponentType;
  onSelect?: () => void;
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
 * A report's or a folder's own actions, behind the ⋯ at the end of its row: open, rename and
 * share it, then Delete, alone and last. The menu does not decide how heavy the delete is; the
 * page does (a report goes at once, a folder asks first).
 */
export function RowMenu({ entry, onDelete }: { entry: Entry; onDelete: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton
          icon={RiMoreFill}
          size="xs"
          variant="secondary"
          preset="ghost"
          aria-label={`Actions for ${entry.name}`}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[13rem]">
        <Item label="Open" icon={RiExternalLinkLine} />
        <Item label="Rename" icon={RiPencilLine} />
        <Item label="Share" icon={RiShareLine} />
        <DropdownMenu.Separator />
        <Item
          label={entry.kind === 'folder' ? 'Delete folder' : 'Delete'}
          icon={RiDeleteBinLine}
          danger
          onSelect={onDelete}
        />
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
