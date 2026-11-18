/**
 * `active` marks the page the user is on: one item per sidebar, announced with
 * `aria-current="page"`. `disabled` dims an item, takes it out of the tab order and blocks the
 * link, for a page the user's plan or role does not include yet. Prefer hiding a page the user
 * will never reach over showing it disabled.
 */
import { RiBarChartLine, RiDashboardLine, RiFolder3Line, RiUser3Line } from '@remixicon/react';
import { Sidebar } from '@wideset/react';

export default function SidebarStates() {
  return (
    <div className="rounded-ws-control-lg border-ws-static-base flex h-[16rem] w-fit overflow-hidden border">
      <Sidebar>
        <Sidebar.Section>
          <nav aria-label="Main" className="gap-ws-2 flex flex-col">
            <Sidebar.Item href="#" icon={RiDashboardLine} label="Dashboard" active />
            <Sidebar.Item href="#" icon={RiFolder3Line} label="Projects" />
            <Sidebar.Item href="#" icon={RiUser3Line} label="Customers" />
            <Sidebar.Item href="#" icon={RiBarChartLine} label="Reports" disabled />
          </nav>
        </Sidebar.Section>
      </Sidebar>
    </div>
  );
}
