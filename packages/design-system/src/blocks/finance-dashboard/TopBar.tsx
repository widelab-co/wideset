import {
  RiInbox2Line,
  RiMenuLine,
  RiMoonLine,
  RiNotification3Line,
  RiSettings4Line,
  RiSunFill,
} from '@remixicon/react';
import { IconButton, NavigationBar, SegmentedControl } from '@wideset/react';
import { useState } from 'react';

import { NAV } from './data';

const ACTIONS = [
  { icon: RiSettings4Line, label: 'Settings' },
  { icon: RiInbox2Line, label: 'Inbox' },
  { icon: RiNotification3Line, label: 'Notifications' },
];

/** Figma "Navigation Bar" on the white page: menu, navigation, tools. */
export function TopBar() {
  const [current, setCurrent] = useState(NAV[0].href);

  return (
    <NavigationBar divider={false}>
      <NavigationBar.Start>
        <IconButton
          variant="secondary"
          preset="ghost"
          size="sm"
          icon={RiMenuLine}
          aria-label="Open menu"
        />
      </NavigationBar.Start>
      <NavigationBar.Nav>
        {NAV.map((item) => (
          <NavigationBar.Item
            key={item.href}
            href={item.href}
            active={item.href === current}
            onClick={() => setCurrent(item.href)}
          >
            <NavigationBar.Icon icon={item.icon} />
            <NavigationBar.Label>{item.label}</NavigationBar.Label>
          </NavigationBar.Item>
        ))}
      </NavigationBar.Nav>

      <NavigationBar.End>
        <SegmentedControl size="sm" defaultValue="light" aria-label="Theme">
          <SegmentedControl.Item value="light" icon={RiSunFill} aria-label="Light" />
          <SegmentedControl.Item value="dark" icon={RiMoonLine} aria-label="Dark" />
        </SegmentedControl>
        <NavigationBar.Actions>
          {ACTIONS.map(({ icon, label }) => (
            <IconButton
              key={label}
              variant="secondary"
              preset="ghost"
              size="sm"
              icon={icon}
              aria-label={label}
            />
          ))}
        </NavigationBar.Actions>
      </NavigationBar.End>
    </NavigationBar>
  );
}
