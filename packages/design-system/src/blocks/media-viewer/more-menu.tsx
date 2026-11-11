import {
  type RemixiconComponentType,
  RiDeleteBinLine,
  RiFolderOpenLine,
  RiLinkM,
  RiMoreFill,
} from '@remixicon/react';
import { DropdownMenu, IconButton, ListItem } from '@wideset/react';

export type MoreAction = 'copy-link' | 'show-in-folder' | 'trash';

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
 * The file's other actions behind ⋯ in the viewer's bar: its link, its folder, then Move to
 * trash, alone and last. The menu opens over the viewer, in the page's theme.
 */
export function MoreMenu({
  name,
  onAction,
}: {
  name: string;
  onAction: (action: MoreAction) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton
          icon={RiMoreFill}
          variant="secondary"
          preset="ghost"
          size="sm"
          aria-label={`More actions for ${name}`}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[13rem]">
        <Entry label="Copy link" icon={RiLinkM} onSelect={() => onAction('copy-link')} />
        <Entry
          label="Show in folder"
          icon={RiFolderOpenLine}
          onSelect={() => onAction('show-in-folder')}
        />
        <DropdownMenu.Separator />
        <Entry
          label="Move to trash"
          icon={RiDeleteBinLine}
          danger
          onSelect={() => onAction('trash')}
        />
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
