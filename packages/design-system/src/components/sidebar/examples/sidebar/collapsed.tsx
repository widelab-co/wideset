/** Collapsed keeps only the icons; each item's label becomes its `aria-label` and the trigger flips to Expand. The same tree serves both modes, so the trigger and the items keep focus across a toggle; `Sidebar.Expanded` wraps what exists only when expanded, here the product name. */
import { RiDashboardLine, RiFolder3Line, RiUser3Line } from '@remixicon/react';
import { Sidebar } from '@wideset/react';

const NAV = [
  { label: 'Dashboard', Icon: RiDashboardLine },
  { label: 'Projects', Icon: RiFolder3Line },
  { label: 'Customers', Icon: RiUser3Line },
];

const nav = (
  <nav className="gap-ws-2 flex flex-col">
    {NAV.map(({ label, Icon }) => (
      <Sidebar.Item key={label} href="#" icon={Icon} label={label} active={label === 'Dashboard'} />
    ))}
  </nav>
);

export default function SidebarCollapsedMode() {
  return (
    <div className="gap-ws-12 flex flex-wrap items-start justify-center">
      {[false, true].map((collapsed) => (
        <div
          key={String(collapsed)}
          className="rounded-ws-control-lg border-ws-static-base flex h-[16rem] overflow-hidden border"
        >
          <Sidebar defaultCollapsed={collapsed}>
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
            <Sidebar.Section>{nav}</Sidebar.Section>
          </Sidebar>
        </div>
      ))}
    </div>
  );
}
