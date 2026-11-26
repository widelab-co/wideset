import {
  RiArrowLeftLine,
  RiBarChartFill,
  RiBarChartHorizontalFill,
  RiFolder3Fill,
  RiInbox2Line,
  RiNotification3Line,
  RiSettings4Line,
} from '@remixicon/react';
import { Breadcrumbs, IconButton, NavigationBar, SegmentedControl } from '@wideset/react';

/**
 * Figma's Top Navigation for a takeover: back to where the user came from and where this page
 * sits, then the view and the tools. Full-bleed, a line below it.
 */
export function TopBar() {
  return (
    <NavigationBar className="h-ws-19 px-ws-11">
      <NavigationBar.Start>
        <IconButton
          variant="secondary"
          preset="ghost"
          size="sm"
          icon={RiArrowLeftLine}
          aria-label="Back to projects"
        />
      </NavigationBar.Start>
      <Breadcrumbs separator="arrow" className="min-w-0 flex-1">
        <Breadcrumbs.Item>
          <RiFolder3Fill aria-hidden="true" className="size-ws-9" />
          Projects
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Marketing</Breadcrumbs.Item>
      </Breadcrumbs>
      <NavigationBar.End>
        <SegmentedControl size="sm" defaultValue="timeline" aria-label="View">
          <SegmentedControl.Item
            value="timeline"
            icon={RiBarChartHorizontalFill}
            aria-label="Timeline"
          />
          <SegmentedControl.Item value="chart" icon={RiBarChartFill} aria-label="Chart" />
        </SegmentedControl>
        <NavigationBar.Actions>
          {[
            { icon: RiNotification3Line, label: 'Notifications' },
            { icon: RiInbox2Line, label: 'Inbox' },
            { icon: RiSettings4Line, label: 'Settings' },
          ].map(({ icon, label }) => (
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
