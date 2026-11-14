/**
 * `suffix` puts a count or a badge on the item's right edge, where it stays: it is content. A
 * keyboard shortcut is a hint instead: with `suffixOnHover` it shows only while the row is hovered
 * or has keyboard focus, and keeps its space, so the label never shifts. Collapsed, the sidebar
 * hides every suffix.
 */
import { RiCalendarLine, RiDashboardLine, RiInbox2Line, RiSearchLine } from '@remixicon/react';
import { Sidebar } from '@wideset/react';

export default function SidebarSuffixes() {
  return (
    <div className="rounded-ws-control-lg border-ws-static-base flex h-[16rem] w-fit overflow-hidden border">
      <Sidebar>
        <Sidebar.Section>
          <nav aria-label="Main" className="gap-ws-2 flex flex-col">
            <Sidebar.Item href="#" icon={RiDashboardLine} label="Dashboard" active />
            <Sidebar.Item href="#" icon={RiInbox2Line} label="Inbox" suffix="12" />
            <Sidebar.Item
              href="#"
              icon={RiCalendarLine}
              label="Calendar"
              suffix="⌘2"
              suffixOnHover
            />
            <Sidebar.Item href="#" icon={RiSearchLine} label="Search" suffix="⌘K" suffixOnHover />
          </nav>
        </Sidebar.Section>
      </Sidebar>
    </div>
  );
}
