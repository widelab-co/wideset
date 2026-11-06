/**
 * Page links for a product with a handful of top-level areas. `NavigationBar.Nav` is a `nav`
 * landmark that screen readers announce as "Main navigation", and `active` marks the page the user
 * is on with `aria-current="page"`. Keep it to about five links; a product with more areas needs a
 * `Sidebar`. The end of the bar holds what applies on every page: a search field, a segmented
 * control and the icon actions, which `NavigationBar.Actions` keeps close together.
 */
import {
  RiBarChartLine,
  RiBox3Line,
  RiHome5Line,
  RiInbox2Line,
  RiMenuLine,
  RiMoonLine,
  RiNotification3Line,
  RiSearchLine,
  RiSettings3Line,
  RiSunFill,
  RiTaskLine,
} from '@remixicon/react';
import { IconButton, NavigationBar, SegmentedControl, TextInput } from '@wideset/react';

const PAGES = [
  { label: 'Dashboard', icon: RiHome5Line },
  { label: 'Analytics', icon: RiBarChartLine },
  { label: 'Products', icon: RiBox3Line },
  { label: 'Tasks', icon: RiTaskLine },
];

const ACTIONS = [
  { label: 'Settings', icon: RiSettings3Line },
  { label: 'Inbox', icon: RiInbox2Line },
  { label: 'Notifications', icon: RiNotification3Line },
];

export default function NavigationBarNavigation() {
  return (
    <div className="w-[64rem]">
      <NavigationBar>
        <NavigationBar.Start>
          <IconButton
            variant="secondary"
            preset="ghost"
            size="sm"
            icon={RiMenuLine}
            aria-label="Open menu"
          />
          <Logo />
        </NavigationBar.Start>
        <NavigationBar.Nav>
          {PAGES.map(({ label, icon }) => (
            <NavigationBar.Item
              key={label}
              href="#"
              icon={icon}
              label={label}
              active={label === 'Dashboard'}
            />
          ))}
        </NavigationBar.Nav>
        <NavigationBar.End>
          <TextInput size="sm" className="w-[10rem]">
            <TextInput.Prefix inner>
              <TextInput.Icon icon={RiSearchLine} />
            </TextInput.Prefix>
            <TextInput.Input type="search" placeholder="Search" aria-label="Search" />
          </TextInput>
          <SegmentedControl size="sm" defaultValue="light" aria-label="Theme">
            <SegmentedControl.Item value="light" icon={RiSunFill} aria-label="Light" />
            <SegmentedControl.Item value="dark" icon={RiMoonLine} aria-label="Dark" />
          </SegmentedControl>
          <NavigationBar.Actions>
            {ACTIONS.map(({ label, icon }) => (
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
    </div>
  );
}

/** Your logo goes here; this is the Wideset mark on its tile. */
function Logo() {
  return (
    <span className="bg-ws-static-alpha-strong text-ws-static-strong rounded-ws-control-lg size-ws-14 flex shrink-0 items-center justify-center">
      <svg
        viewBox="0 0 16 8"
        role="img"
        aria-label="Wideset"
        className="h-ws-5 w-ws-9 fill-current"
      >
        <path d="M13.69 0s-2.07 5.32-2.15 5.52C11.5 5.42 9.18 0 9.18 0H7.09S4.78 5.52 4.74 5.59C4.7 5.52 2.24 0 2.24 0H0l3.74 8h2.06l2.35-5.66h.04c.02.06 2.39 5.66 2.39 5.66h2.12S15.98.07 16 0z" />
      </svg>
    </span>
  );
}
