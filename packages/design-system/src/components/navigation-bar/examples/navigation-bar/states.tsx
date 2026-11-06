/**
 * `active` marks the page the user is on: one link per bar, announced with `aria-current="page"`.
 * `badge` puts a `Tag` after the label for something new; screen readers read it as part of the
 * link's name. `disabled` dims a link, takes it out of the tab order and blocks it, for an area the
 * user's plan does not include yet. Prefer hiding a page the user will never reach over showing it
 * disabled.
 */
import { RiBarChartLine, RiBox3Line, RiHome5Line, RiTaskLine } from '@remixicon/react';
import { NavigationBar, Tag } from '@wideset/react';

export default function NavigationBarStates() {
  return (
    <div className="w-[40rem] max-w-full">
      <NavigationBar>
        <NavigationBar.Nav>
          <NavigationBar.Item href="#" icon={RiHome5Line} label="Dashboard" active />
          <NavigationBar.Item href="#" icon={RiBarChartLine} label="Analytics" />
          <NavigationBar.Item
            href="#"
            icon={RiBox3Line}
            label="Products"
            badge={<Tag size="sm">New</Tag>}
          />
          <NavigationBar.Item href="#" icon={RiTaskLine} label="Tasks" disabled />
        </NavigationBar.Nav>
      </NavigationBar>
    </div>
  );
}
