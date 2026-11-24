/**
 * `active` marks the page the user is on: one link per bar, announced with `aria-current="page"`.
 * Anything after `NavigationBar.Label`, such as a `Tag` reading "New", is part of the link's name
 * for screen readers. `disabled` dims a link, takes it out of the tab order and blocks it, for an
 * area the user's plan does not include yet. Prefer hiding a page the user will never reach over
 * showing it disabled.
 */
import { RiBarChartLine, RiBox3Line, RiHome5Line, RiTaskLine } from '@remixicon/react';
import { NavigationBar, Tag } from '@wideset/react';

export default function NavigationBarStates() {
  return (
    <div className="w-[40rem]">
      <NavigationBar>
        <NavigationBar.Nav>
          <NavigationBar.Item href="#" active>
            <NavigationBar.Icon icon={RiHome5Line} />
            <NavigationBar.Label>Dashboard</NavigationBar.Label>
          </NavigationBar.Item>
          <NavigationBar.Item href="#">
            <NavigationBar.Icon icon={RiBarChartLine} />
            <NavigationBar.Label>Analytics</NavigationBar.Label>
          </NavigationBar.Item>
          <NavigationBar.Item href="#">
            <NavigationBar.Icon icon={RiBox3Line} />
            <NavigationBar.Label>Products</NavigationBar.Label>
            <Tag size="sm">New</Tag>
          </NavigationBar.Item>
          <NavigationBar.Item href="#" disabled>
            <NavigationBar.Icon icon={RiTaskLine} />
            <NavigationBar.Label>Tasks</NavigationBar.Label>
          </NavigationBar.Item>
        </NavigationBar.Nav>
      </NavigationBar>
    </div>
  );
}
