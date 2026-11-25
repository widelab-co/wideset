import { RiArrowDownSLine, RiHistoryLine } from '@remixicon/react';
import { Button, DropdownMenu, ListItem } from '@wideset/react';

import { PEOPLE, type Version } from './data';
import { formatSavedAt } from './format';

type VersionMenuProps = {
  /** Newest first; the first is the one the script runs. */
  versions: Version[];
  /** Picking an older version asks first, so the menu only names it. */
  onPick: (version: Version) => void;
};

/**
 * The script's saved versions behind a button that names the current one. Each entry says when
 * and by whom it was saved (and what it restored); the current one is checked. Picking another
 * does not restore it yet: the page asks first.
 */
export function VersionMenu({ versions, onPick }: VersionMenuProps) {
  const [current] = versions;

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="secondary"
          preset="ghost"
          size="sm"
          aria-label={`Version history, version ${current.number}`}
        >
          <Button.Icon icon={RiHistoryLine} />
          {`Version ${current.number}`}
          <Button.Icon icon={RiArrowDownSLine} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[18rem]">
        <DropdownMenu.Label>Version history</DropdownMenu.Label>
        {versions.map((version) => (
          <DropdownMenu.Item
            key={version.number}
            data-state={version === current ? 'checked' : 'unchecked'}
            onSelect={() => version !== current && onPick(version)}
          >
            <ListItem.Content>
              <ListItem.Label>
                {version.restoredFrom
                  ? `Version ${version.number}, restored from ${version.restoredFrom}`
                  : `Version ${version.number}`}
              </ListItem.Label>
              <ListItem.Description>
                {formatSavedAt(version.savedAt)} · {PEOPLE[version.by].name}
              </ListItem.Description>
            </ListItem.Content>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
