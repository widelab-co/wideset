/** The playground's stage: a top bar with the menu button, a logo, three page links and two actions, its props set from the rail. */
import {
  RiBarChartLine,
  RiBox3Line,
  RiHome5Line,
  RiMenuLine,
  RiNotification3Line,
  RiSettings3Line,
} from '@remixicon/react';
import { IconButton, NavigationBar, type NavigationBarProps } from '@wideset/react';

export default function NavigationBarDefault(props: NavigationBarProps) {
  return (
    <div className="w-[40rem] max-w-full">
      <NavigationBar {...props}>
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
          <NavigationBar.Item href="#" icon={RiHome5Line} label="Dashboard" active />
          <NavigationBar.Item href="#" icon={RiBarChartLine} label="Analytics" />
          <NavigationBar.Item href="#" icon={RiBox3Line} label="Products" />
        </NavigationBar.Nav>
        <NavigationBar.End>
          <NavigationBar.Actions>
            <IconButton
              variant="secondary"
              preset="ghost"
              size="sm"
              icon={RiSettings3Line}
              aria-label="Settings"
            />
            <IconButton
              variant="secondary"
              preset="ghost"
              size="sm"
              icon={RiNotification3Line}
              aria-label="Notifications"
            />
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
