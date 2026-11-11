import { RiArrowDownSLine } from '@remixicon/react';
import { Button, DropdownMenu, ListItem } from '@wideset/react';
import { useState } from 'react';

import { MenuChoice } from './menu-choice';

export type Model = { id: string; name: string; note: string };

type ModelMenuProps = {
  models: Model[];
  efforts: string[];
  defaultModel?: string;
  defaultEffort?: string;
};

/**
 * The model answering and how hard it thinks, as one quiet button in the composer that says both
 * ("Tandem Pro · High") and opens a menu of the two choices: the models with a line on what each
 * is for, then the effort. It holds its own state: nothing else on the screen depends on it.
 */
export function ModelMenu({
  models,
  efforts,
  defaultModel = models[0].id,
  defaultEffort = efforts[efforts.length - 1],
}: ModelMenuProps) {
  const [model, setModel] = useState(defaultModel);
  const [effort, setEffort] = useState(defaultEffort);
  const { name } = models.find((item) => item.id === model) ?? models[0];

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="secondary"
          preset="ghost"
          size="sm"
          aria-label={`Model: ${name}, ${effort.toLowerCase()} effort`}
        >
          {`${name} · ${effort}`}
          <Button.Icon icon={RiArrowDownSLine} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="top" align="end" className="w-[16rem]">
        <DropdownMenu.Label>Model</DropdownMenu.Label>
        <DropdownMenu.RadioGroup aria-label="Model" value={model} onValueChange={setModel}>
          {models.map((item) => (
            <MenuChoice key={item.id} value={item.id}>
              <ListItem.Content>
                <ListItem.Label>{item.name}</ListItem.Label>
                <ListItem.Description>{item.note}</ListItem.Description>
              </ListItem.Content>
            </MenuChoice>
          ))}
        </DropdownMenu.RadioGroup>
        <DropdownMenu.Separator />
        <DropdownMenu.Label>Effort</DropdownMenu.Label>
        <DropdownMenu.RadioGroup aria-label="Effort" value={effort} onValueChange={setEffort}>
          {efforts.map((item) => (
            <MenuChoice key={item} value={item}>
              <ListItem.Content>
                <ListItem.Label>{item}</ListItem.Label>
              </ListItem.Content>
            </MenuChoice>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
