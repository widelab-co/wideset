import { Button, DropdownMenu, ListItem, NavigationBar } from '@wideset/react';
import { useState } from 'react';

import { BrandMark } from './brand-mark';
import { MODELS, NAV } from './data';

/** Figma "Navigation" on the white page, no line: brand and model, centred navigation, invite. */
export function TopBar() {
  const [current, setCurrent] = useState(NAV[0].href);
  const [model, setModel] = useState(MODELS[0]);

  return (
    <NavigationBar divider={false} className="h-ws-22 grid grid-cols-[1fr_auto_1fr]">
      <NavigationBar.Start className="gap-ws-12">
        <BrandMark label="Wide AI" />
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button variant="secondary" preset="border" size="sm">
              {model}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start">
            {MODELS.map((item) => (
              <DropdownMenu.Item
                key={item}
                data-state={item === model ? 'checked' : 'unchecked'}
                onSelect={() => setModel(item)}
              >
                <ListItem.Content>
                  <ListItem.Label>{item}</ListItem.Label>
                </ListItem.Content>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu>
      </NavigationBar.Start>

      {/* Below md the bar keeps the brand, the model and the invite; the links do not fit. */}
      <NavigationBar.Nav className="hidden md:flex">
        {NAV.map((item) => (
          <NavigationBar.Item
            key={item.href}
            href={item.href}
            active={item.href === current}
            onClick={() => setCurrent(item.href)}
          >
            <NavigationBar.Label>{item.label}</NavigationBar.Label>
          </NavigationBar.Item>
        ))}
      </NavigationBar.Nav>

      <NavigationBar.End className="col-start-3">
        <Button variant="secondary" preset="border" size="sm">
          Invite
        </Button>
      </NavigationBar.End>
    </NavigationBar>
  );
}
