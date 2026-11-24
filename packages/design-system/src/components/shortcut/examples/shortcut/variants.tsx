/**
 * `inverse` draws the keys for a dark surface, such as the default Tooltip: the text and the cap's
 * stroke take the inverse colours, so a shortcut reads next to the tooltip's label. Use `default`
 * everywhere else.
 */
import { RiSearchLine } from '@remixicon/react';
import { IconButton, Shortcut, Tooltip } from '@wideset/react';

export default function ShortcutVariants() {
  return (
    <div className="pt-ws-24 pl-ws-16">
      <Tooltip open>
        <Tooltip.Trigger asChild>
          <IconButton icon={RiSearchLine} variant="secondary" preset="border" aria-label="Search" />
        </Tooltip.Trigger>
        <Tooltip.Content>
          <span className="gap-ws-4 flex items-center">
            <Tooltip.Label>Search</Tooltip.Label>
            <Shortcut variant="inverse">
              <Shortcut.Key>⌘</Shortcut.Key>
              <Shortcut.Key>K</Shortcut.Key>
            </Shortcut>
          </span>
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
}
