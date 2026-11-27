import { RiMenuLine } from '@remixicon/react';
import { Avatar, DropdownMenu, IconButton, ListItem, NavigationBar } from '@wideset/react';
import { useState } from 'react';

import { BrandMark } from './brand-mark';
import { ACCOUNT, NAV } from './data';

/** Figma "Navigation Bar" on the grey canvas, no fill and no line: brand, navigation, account. */
export function TopBar() {
  const [current, setCurrent] = useState(NAV[0].href);

  return (
    <NavigationBar divider={false} className="h-ws-22">
      <NavigationBar.Start>
        <IconButton
          variant="secondary"
          preset="ghost"
          size="sm"
          icon={RiMenuLine}
          aria-label="Open menu"
        />
        <BrandMark label="Wideset" />
      </NavigationBar.Start>
      <NavigationBar.Nav>
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

      <NavigationBar.End>
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="typography-label-strong-sm text-ws-static-strong rounded-ws-control-lg gap-ws-5 px-ws-5 py-ws-3 hover:bg-ws-dynamic-secondary-alpha-hover focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default flex cursor-pointer items-center"
            >
              <Avatar initials={ACCOUNT.initials} aria-hidden />
              {ACCOUNT.name}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            {['Profile', 'Settings', 'Log out'].map((label) => (
              <DropdownMenu.Item key={label}>
                <ListItem.Content>
                  <ListItem.Label>{label}</ListItem.Label>
                </ListItem.Content>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu>
      </NavigationBar.End>
    </NavigationBar>
  );
}
