/**
 * In a menu the shortcut goes in `ListItem.Suffix`, so it lines up at the end of the row and the
 * label truncates first. It only shows the keys: your app listens for them. Screen readers read it
 * with the label, as "Bold, Command B".
 */
import { RiArrowDownSLine } from '@remixicon/react';
import { Button, DropdownMenu, ListItem, Shortcut } from '@wideset/react';

export default function ShortcutMenu() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" preset="border">
          Format
          <Button.Icon icon={RiArrowDownSLine} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        <DropdownMenu.Item>
          <ListItem.Label>Bold</ListItem.Label>
          <ListItem.Suffix>
            <Shortcut>
              <Shortcut.Key>⌘</Shortcut.Key>
              <Shortcut.Key>B</Shortcut.Key>
            </Shortcut>
          </ListItem.Suffix>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <ListItem.Label>Italic</ListItem.Label>
          <ListItem.Suffix>
            <Shortcut>
              <Shortcut.Key>⌘</Shortcut.Key>
              <Shortcut.Key>I</Shortcut.Key>
            </Shortcut>
          </ListItem.Suffix>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <ListItem.Label>Underline</ListItem.Label>
          <ListItem.Suffix>
            <Shortcut>
              <Shortcut.Key>⌘</Shortcut.Key>
              <Shortcut.Key>U</Shortcut.Key>
            </Shortcut>
          </ListItem.Suffix>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <ListItem.Label>Bulleted list</ListItem.Label>
          <ListItem.Suffix>
            <Shortcut>
              <Shortcut.Key>⇧</Shortcut.Key>
              <Shortcut.Key>⌘</Shortcut.Key>
              <Shortcut.Key>8</Shortcut.Key>
            </Shortcut>
          </ListItem.Suffix>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
