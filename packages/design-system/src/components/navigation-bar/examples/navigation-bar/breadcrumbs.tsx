/**
 * On a page below the top level, the bar shows the path to it instead of the page links: put
 * `Breadcrumbs` right after `NavigationBar.Start`. The last crumb is the current page, announced as
 * such and not focusable; the others lead back up. `Breadcrumbs` is a `nav` landmark of its own,
 * named "Breadcrumb", so the bar needs no `NavigationBar.Nav` here.
 */
import {
  RiBarChartFill,
  RiInbox2Line,
  RiMenuLine,
  RiMoonLine,
  RiNotification3Line,
  RiSearchLine,
  RiSettings3Line,
  RiSunFill,
} from '@remixicon/react';
import {
  Breadcrumbs,
  IconButton,
  NavigationBar,
  SegmentedControl,
  TextInput,
} from '@wideset/react';

const ACTIONS = [
  { label: 'Settings', icon: RiSettings3Line },
  { label: 'Inbox', icon: RiInbox2Line },
  { label: 'Notifications', icon: RiNotification3Line },
];

export default function NavigationBarBreadcrumbs() {
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
        <Breadcrumbs separator="arrow">
          <Breadcrumbs.Item>
            <RiBarChartFill className="size-ws-9" />
            Analytics
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>Report</Breadcrumbs.Item>
          <Breadcrumbs.Item>Adam Smith January</Breadcrumbs.Item>
        </Breadcrumbs>
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
