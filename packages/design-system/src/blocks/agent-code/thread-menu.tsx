import {
  RiArchiveLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiMoreLine,
  RiPencilLine,
} from '@remixicon/react';
import { DropdownMenu, ListItem } from '@wideset/react';

import { IconAction } from './icon-action';
import { MenuChoice } from './menu-choice';
import { MenuSub } from './menu-sub';
import type { TranscriptView } from './model';

const VIEWS: { id: TranscriptView; label: string; note: string }[] = [
  { id: 'normal', label: 'Normal', note: 'Steps and reasoning folded' },
  { id: 'thinking', label: 'Thinking', note: 'Reasoning open' },
  { id: 'verbose', label: 'Verbose', note: 'Every step open with its output' },
];

type ThreadMenuProps = {
  view: TranscriptView;
  onViewChange: (view: TranscriptView) => void;
};

/**
 * The "…" at the end of the top bar: what can be done with the open thread, and, in a submenu
 * that shows the current choice, how much of the agent's work its transcript shows. Icons on
 * every item, the one destructive action last, after a line.
 */
export function ThreadMenu({ view, onViewChange }: ThreadMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconAction label="More" icon={RiMoreLine} side="bottom" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[15rem]">
        <DropdownMenu.Item>
          <ListItem.Prefix>
            <RiPencilLine className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Rename</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
        <MenuSub
          icon={RiEyeLine}
          label="Transcript view"
          value={VIEWS.find((item) => item.id === view)?.label}
        >
          <DropdownMenu.RadioGroup
            aria-label="Transcript view"
            value={view}
            onValueChange={(value) => onViewChange(value as TranscriptView)}
          >
            {VIEWS.map((item) => (
              <MenuChoice key={item.id} value={item.id}>
                <ListItem.Content>
                  <ListItem.Label>{item.label}</ListItem.Label>
                  <ListItem.Description>{item.note}</ListItem.Description>
                </ListItem.Content>
              </MenuChoice>
            ))}
          </DropdownMenu.RadioGroup>
        </MenuSub>
        <DropdownMenu.Item>
          <ListItem.Prefix>
            <RiArchiveLine className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Archive</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="danger">
          <ListItem.Prefix>
            <RiDeleteBinLine className="size-ws-9" />
          </ListItem.Prefix>
          <ListItem.Content>
            <ListItem.Label>Delete</ListItem.Label>
          </ListItem.Content>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
