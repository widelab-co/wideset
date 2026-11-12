import { RiAttachment2, RiMoreFill, RiPlugLine } from '@remixicon/react';
import { DropdownMenu, ListItem } from '@wideset/react';

import { IconAction } from './icon-action';

/**
 * The "…" at the end of the composer's tools: what is used now and then and needs no place of its
 * own in the bar. Add files puts a file on the composer's tray; the connectors are managed from
 * here. Its rows are the AI chat starting point's: a 20px slot with a 16px subtle glyph.
 */
export function ToolsMenu({ onAttach }: { onAttach?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconAction label="More tools" icon={RiMoreFill} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="top" align="start" className="w-[14rem]">
        <DropdownMenu.Item onSelect={onAttach}>
          <ListItem.Prefix className="size-ws-11 justify-center">
            <RiAttachment2 aria-hidden className="size-ws-9 text-ws-static-subtle" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Add files</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <ListItem.Prefix className="size-ws-11 justify-center">
            <RiPlugLine aria-hidden className="size-ws-9 text-ws-static-subtle" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Manage connectors</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
