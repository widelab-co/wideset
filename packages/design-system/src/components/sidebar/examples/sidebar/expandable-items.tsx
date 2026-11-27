/**
 * A page with sub-pages of its own folds them under it: wrap the head `Sidebar.Item` and a
 * `Sidebar.GroupTrigger` in a `Sidebar.Group`, and the sub-pages, `nested`, in
 * `Sidebar.GroupContent`. The head stays a link to its page; the chevron is a separate button
 * that announces `aria-expanded` and names the group through `expandLabel` / `collapseLabel`.
 * Open the group from the start (`defaultOpen`) when one of its pages is the current one.
 * Collapsed, the rail shows the head's icon alone and keeps the open state for later.
 */
import {
  RiBarChartLine,
  RiDashboardLine,
  RiFileChartLine,
  RiLineChartLine,
  RiPieChartLine,
  RiUser3Line,
} from '@remixicon/react';
import { Sidebar } from '@wideset/react';

const REPORTS = [
  { label: 'Revenue', Icon: RiLineChartLine },
  { label: 'Churn', Icon: RiPieChartLine },
  { label: 'Cohorts', Icon: RiFileChartLine },
];

export default function SidebarExpandableItems() {
  return (
    <div className="gap-ws-12 flex flex-wrap items-start justify-center">
      {[
        { key: 'closed', open: false, collapsed: false },
        { key: 'open', open: true, collapsed: false },
        { key: 'rail', open: true, collapsed: true },
      ].map(({ key, open, collapsed }) => (
        <div
          key={key}
          className="rounded-ws-control-lg border-ws-static-base flex h-[18rem] overflow-hidden border"
        >
          <Sidebar defaultCollapsed={collapsed}>
            <Sidebar.Section>
              <nav aria-label="Main" className="gap-ws-2 flex flex-col">
                <Sidebar.Item href="#" icon={RiDashboardLine} label="Dashboard" />
                <Sidebar.Group defaultOpen={open}>
                  <Sidebar.Item href="#" icon={RiBarChartLine} label="Reports" />
                  <Sidebar.GroupTrigger expandLabel="Show reports" collapseLabel="Hide reports" />
                  <Sidebar.GroupContent>
                    {REPORTS.map(({ label, Icon }) => (
                      <Sidebar.Item
                        key={label}
                        href="#"
                        icon={Icon}
                        label={label}
                        active={label === 'Revenue'}
                        nested
                      />
                    ))}
                  </Sidebar.GroupContent>
                </Sidebar.Group>
                <Sidebar.Item href="#" icon={RiUser3Line} label="Customers" />
              </nav>
            </Sidebar.Section>
          </Sidebar>
        </div>
      ))}
    </div>
  );
}
