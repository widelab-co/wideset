/** The playground's stage: a sidebar with a header and three pages, beside the page it opens. */
import { RiDashboardLine, RiFolder3Line, RiUser3Line } from '@remixicon/react';
import { Sidebar, type SidebarProps } from '@wideset/react';

export default function SidebarDefault(props: SidebarProps) {
  return (
    <div className="rounded-ws-control-lg border-ws-static-base bg-ws-static-foreground flex h-[16rem] w-[22rem] max-w-full overflow-hidden border">
      <Sidebar {...props}>
        <Sidebar.Header>
          <div className="gap-ws-7 py-ws-3 flex items-center">
            <Sidebar.Expanded>
              <span className="typography-label-strong-sm text-ws-static-strong pl-ws-5">
                Northwind
              </span>
            </Sidebar.Expanded>
            <Sidebar.Trigger />
          </div>
        </Sidebar.Header>
        <Sidebar.Section>
          <nav className="gap-ws-2 flex flex-col">
            <Sidebar.Item href="#" icon={RiDashboardLine} label="Dashboard" active />
            <Sidebar.Item href="#" icon={RiFolder3Line} label="Projects" />
            <Sidebar.Item href="#" icon={RiUser3Line} label="Customers" />
          </nav>
        </Sidebar.Section>
      </Sidebar>
      <div className="p-ws-9 typography-label-strong-sm text-ws-static-strong min-w-0 flex-1">
        Dashboard
      </div>
    </div>
  );
}
