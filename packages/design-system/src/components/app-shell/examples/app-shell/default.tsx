/** The playground's stage: a sidebar and a page with its top bar in one shell, its direction set from the rail. */
import { RiDashboardLine, RiFolder3Line, RiMoreLine, RiSettings3Line } from '@remixicon/react';
import {
  AppShell,
  type AppShellProps,
  Breadcrumbs,
  Button,
  IconButton,
  Sidebar,
} from '@wideset/react';

export default function AppShellDefault(props: AppShellProps) {
  return (
    <AppShell
      className="border-ws-static-base rounded-ws-container-md h-[24rem] w-full overflow-hidden border"
      {...props}
    >
      <Sidebar>
        <Sidebar.Header>
          <Sidebar.Expanded>
            <div className="typography-label-strong-sm text-ws-static-strong py-ws-3 pl-ws-5">
              Northwind
            </div>
          </Sidebar.Expanded>
        </Sidebar.Header>
        <Sidebar.Section>
          <nav aria-label="Main" className="gap-ws-2 flex flex-col">
            <Sidebar.Item href="#" icon={RiDashboardLine} label="Dashboard" />
            <Sidebar.Item href="#" icon={RiFolder3Line} label="Projects" active />
            <Sidebar.Item href="#" icon={RiSettings3Line} label="Settings" />
          </nav>
        </Sidebar.Section>
      </Sidebar>
      <AppShell.Main>
        <AppShell.TopBar>
          <AppShell.SidebarTrigger />
          <Breadcrumbs separator="arrow">
            <Breadcrumbs.Item asChild>
              <a href="#workspace">Workspace</a>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>Projects</Breadcrumbs.Item>
          </Breadcrumbs>
          <AppShell.TopBarActions>
            <Button size="sm" variant="secondary" preset="border">
              Share
            </Button>
            <IconButton
              icon={RiMoreLine}
              size="sm"
              variant="secondary"
              preset="ghost"
              aria-label="More actions"
            />
          </AppShell.TopBarActions>
        </AppShell.TopBar>
        <div className="gap-ws-12 px-ws-14 pt-ws-14 pb-ws-16 flex w-full flex-col">
          <header className="gap-ws-2 flex flex-col">
            <h1 className="typography-title-md text-ws-static-strong">Projects</h1>
            <p className="typography-body-md text-ws-static-subtle">
              12 active projects, 3 due this week.
            </p>
          </header>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
