/** Group related choices under one menu item, such as the sort order for a file list. */
import { RiArrowDownSLine } from '@remixicon/react';
import { Button, DropdownMenu } from '@wideset/react';
import { useState } from 'react';

export default function DropdownMenuSubmenus() {
  const [sortBy, setSortBy] = useState('name');

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" preset="border">
          File options
          <Button.Icon icon={RiArrowDownSLine} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start">
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>Sort by</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.RadioGroup
              aria-label="Sort files by"
              value={sortBy}
              onValueChange={setSortBy}
            >
              <DropdownMenu.RadioItem value="name">Name</DropdownMenu.RadioItem>
              <DropdownMenu.RadioItem value="modified">Last modified</DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Item disabled={sortBy === 'name'} onSelect={() => setSortBy('name')}>
          Reset sort order
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
