/**
 * A section the user may want out of the way folds under its header: wrap a
 * `Sidebar.SectionHeader collapsible` and the section's items, in `Sidebar.GroupContent`, in a
 * `Sidebar.Group`. The whole header row is the toggle, with the chevron right after its title; it
 * announces `aria-expanded` and its title is its name. Collapsed, the rail shows the chevron alone
 * and still folds the section. Keep the main pages outside any collapsible section.
 */
import {
  RiDashboardLine,
  RiFlashlightLine,
  RiLightbulbLine,
  RiPaletteLine,
  RiSearchEyeLine,
  RiUser3Line,
} from '@remixicon/react';
import { Sidebar } from '@wideset/react';

export default function SidebarCollapsibleSections() {
  return (
    <div className="gap-ws-12 flex flex-wrap items-start justify-center">
      {[false, true].map((collapsed) => (
        <div
          key={String(collapsed)}
          className="rounded-ws-control-lg border-ws-static-base flex h-[24rem] overflow-hidden border"
        >
          <Sidebar defaultCollapsed={collapsed}>
            <Sidebar.Section scrollable>
              <nav aria-label="Main" className="gap-ws-2 flex flex-col">
                <Sidebar.Item href="#" icon={RiDashboardLine} label="Dashboard" active />
                <Sidebar.Item href="#" icon={RiUser3Line} label="Customers" />
                <Sidebar.Group defaultOpen>
                  <Sidebar.SectionHeader collapsible>Pinned spaces</Sidebar.SectionHeader>
                  <Sidebar.GroupContent>
                    <Sidebar.Item href="#" icon={RiFlashlightLine} label="Project kick-off" />
                    <Sidebar.Item href="#" icon={RiSearchEyeLine} label="Research" />
                  </Sidebar.GroupContent>
                </Sidebar.Group>
                <Sidebar.Group>
                  <Sidebar.SectionHeader collapsible>Archived spaces</Sidebar.SectionHeader>
                  <Sidebar.GroupContent>
                    <Sidebar.Item href="#" icon={RiPaletteLine} label="Rebrand 2025" />
                    <Sidebar.Item href="#" icon={RiLightbulbLine} label="Ideas" />
                  </Sidebar.GroupContent>
                </Sidebar.Group>
              </nav>
            </Sidebar.Section>
          </Sidebar>
        </div>
      ))}
    </div>
  );
}
