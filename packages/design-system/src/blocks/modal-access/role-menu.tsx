// TODO(custom): a role picker drawn as Figma draws it, a ghost Button with a chevron over a menu; Wideset's ghost Select hides its arrow until hover and sets the value in regular weight.
import { RiArrowDownSLine } from '@remixicon/react';
import { Button, DropdownMenu, ListItem } from '@wideset/react';

export type RoleOption<Role extends string = string> = {
  value: Role;
  label: string;
  /** What the role may do, under its name in the menu. */
  hint?: string;
  /** Held, never given: shown on the person who has it and left out of everyone else's menu. */
  fixed?: boolean;
};

/**
 * A role, changed in place. Figma draws it as a ghost Button with a chevron, in the invite field
 * (`md`) and at the end of a person's row (`sm`); the menu marks the current role. The click
 * stops at the button, so inside a field it does not also move the focus to the input.
 */
export function RoleMenu<Role extends string>({
  value,
  options,
  onValueChange,
  size = 'sm',
  'aria-label': label,
}: {
  value: Role;
  options: RoleOption<Role>[];
  onValueChange: (value: Role) => void;
  size?: 'sm' | 'md';
  /** What the role belongs to ("Role of Marcus Bell"); the current role is read after it. */
  'aria-label': string;
}) {
  const current = options.find((option) => option.value === value)?.label;

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="secondary"
          preset="ghost"
          size={size}
          aria-label={`${label}: ${current}`}
          onClick={(event) => event.stopPropagation()}
        >
          {current}
          <Button.Icon icon={RiArrowDownSLine} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {options.map((option) => (
          <DropdownMenu.Item
            key={option.value}
            data-state={option.value === value ? 'checked' : 'unchecked'}
            onSelect={() => onValueChange(option.value)}
          >
            <ListItem.Content>
              <ListItem.Label>{option.label}</ListItem.Label>
              {option.hint && <ListItem.Description>{option.hint}</ListItem.Description>}
            </ListItem.Content>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
