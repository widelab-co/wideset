/** The playground's stage: a sidebar and a page in one shell, its direction set from the rail. */
import { RiDashboardLine, RiFolder3Line, RiSettings3Line } from '@remixicon/react';
import { AppShell, type AppShellProps, Button, Sidebar } from '@wideset/react';

export default function AppShellDefault(props: AppShellProps) {
  return (
    <AppShell
      className="border-ws-static-base rounded-ws-container-md h-[24rem] w-full overflow-hidden border"
      {...props}
    >
      <Sidebar>
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
          <nav aria-label="Main" className="gap-ws-2 flex flex-col">
            <Sidebar.Item href="#" icon={RiDashboardLine} label="Dashboard" />
            <Sidebar.Item href="#" icon={RiFolder3Line} label="Projects" active />
            <Sidebar.Item href="#" icon={RiSettings3Line} label="Settings" />
          </nav>
        </Sidebar.Section>
      </Sidebar>
      <AppShell.Main>
        <div className="gap-ws-11 p-ws-12 flex flex-col">
          <header className="gap-ws-9 flex items-center justify-between">
            <h1 className="typography-title-md text-ws-static-strong">Projects</h1>
            <Button size="sm">New project</Button>
          </header>
          <p className="typography-body-md text-ws-static-subtle">
            12 active projects, 3 due this week.
          </p>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
