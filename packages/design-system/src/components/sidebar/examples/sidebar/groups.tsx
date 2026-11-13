/** `Sidebar.SectionHeader` titles a group of items. Give it an `id` and point the group's `aria-labelledby` at it. Collapsed, the rail cuts its text short ("P…"), so the groups stay apart and named. */
import {
  RiBarChartLine,
  RiDashboardLine,
  RiFileCopyLine,
  RiSecurePaymentLine,
  RiUser3Line,
} from '@remixicon/react';
import { Sidebar } from '@wideset/react';

export default function SidebarGroups() {
  return (
    <div className="gap-ws-12 flex flex-wrap items-start justify-center">
      {[false, true].map((collapsed) => (
        <div
          key={String(collapsed)}
          className="rounded-ws-control-lg border-ws-static-base flex h-[20rem] overflow-hidden border"
        >
          <Sidebar defaultCollapsed={collapsed}>
            <Sidebar.Section scrollable>
              <nav aria-label="Main" className="gap-ws-2 flex flex-col">
                <Sidebar.Item href="#" icon={RiDashboardLine} label="Dashboard" active />
                <Sidebar.Item href="#" icon={RiUser3Line} label="Customers" />
                <Sidebar.SectionHeader id={`products-${collapsed}`}>Products</Sidebar.SectionHeader>
                <div
                  role="group"
                  aria-labelledby={`products-${collapsed}`}
                  className="gap-ws-2 flex flex-col"
                >
                  <Sidebar.Item href="#" icon={RiSecurePaymentLine} label="Payments" />
                  <Sidebar.Item href="#" icon={RiFileCopyLine} label="Billing" />
                  <Sidebar.Item href="#" icon={RiBarChartLine} label="Reporting" />
                </div>
              </nav>
            </Sidebar.Section>
          </Sidebar>
        </div>
      ))}
    </div>
  );
}
