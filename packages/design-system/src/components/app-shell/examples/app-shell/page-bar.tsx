/**
 * The page bar: 48px across the top of the page, with the sidebar's toggle, where you are
 * and the page's small tools. It stays put while the page scrolls under it. The toggle works the
 * `Sidebar` beside it, so the sidebar's header needs no trigger of its own; the `Sidebar` still
 * holds the state (`defaultCollapsed`, or `collapsed` with `onCollapsedChange`). The crumbs are
 * the small text of the screen (12px); the page's title sits below, in the page, at the size its
 * room asks for (`typography-title-md` on a whole page). Leave the bar out on a screen that opens
 * with its own toolbar, such as a calendar.
 */
import { RiInboxLine, RiStarLine, RiTeamLine, RiUserAddLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, Button, IconButton, Sidebar } from '@wideset/react';

export default function AppShellPageBar() {
  return (
    <AppShell className="border-ws-static-base rounded-ws-container-md h-[24rem] w-full overflow-hidden border">
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
            <Sidebar.Item href="#" icon={RiInboxLine} label="Inbox" />
            <Sidebar.Item href="#" icon={RiTeamLine} label="Customers" active />
          </nav>
        </Sidebar.Section>
      </Sidebar>
      <AppShell.Main>
        <AppShell.PageBar>
          <AppShell.SidebarTrigger />
          <Breadcrumbs separator="arrow">
            <Breadcrumbs.Item asChild>
              <a href="#customers">Customers</a>
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>Acme Robotics</Breadcrumbs.Item>
          </Breadcrumbs>
          <span>Edited 2 hours ago</span>
          <AppShell.PageBarActions>
            <Button size="sm" variant="secondary" preset="border">
              <Button.Icon icon={RiUserAddLine} />
              Invite
            </Button>
            <IconButton
              icon={RiStarLine}
              size="sm"
              variant="secondary"
              preset="ghost"
              aria-label="Add to favourites"
            />
          </AppShell.PageBarActions>
        </AppShell.PageBar>
        <div className="gap-ws-12 px-ws-14 pt-ws-14 pb-ws-16 flex w-full flex-col">
          <header className="gap-ws-2 flex flex-col">
            <h1 className="typography-title-md text-ws-static-strong">Acme Robotics</h1>
            <p className="typography-body-md text-ws-static-subtle">
              Customer since March 2023. 14 seats on the Business plan.
            </p>
          </header>
          <p className="typography-body-md text-ws-static-base">
            The renewal is due on 1 March. Two invoices are open and the last call with their
            operations lead was on Tuesday; the notes are in the activity below.
          </p>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}
