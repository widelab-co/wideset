import { RiAddLine } from '@remixicon/react';
import { DropdownMenu, IconButton, ListItem } from '@wideset/react';

import { INSERTABLE, STEP_TYPES, type StepKind } from './data';

/**
 * The "+" on a line between two steps: a short menu of the step types, each with the icon its
 * node will carry. Picking one inserts it at that point of the line.
 */
export function InsertMenu({
  label,
  onInsert,
}: {
  /** Says where the step goes, for screen readers ("Add a step after Create task"). */
  label: string;
  onInsert: (kind: StepKind) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton
          icon={RiAddLine}
          variant="secondary"
          preset="border"
          size="xs"
          aria-label={label}
          className="shrink-0"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="center" className="w-[13rem]">
        {INSERTABLE.map((kind) => {
          const { label: name, icon: Icon } = STEP_TYPES[kind];
          return (
            <DropdownMenu.Item key={kind} onSelect={() => onInsert(kind)}>
              <ListItem.Prefix>
                <Icon className="size-ws-9" />
              </ListItem.Prefix>
              <ListItem.Content>
                <ListItem.Label>{name}</ListItem.Label>
              </ListItem.Content>
            </DropdownMenu.Item>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
