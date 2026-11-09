/**
 * Pick one direction for the whole app, by what the app is, and keep it on every screen. Inset
 * suits apps with a strong page edge and several regions (a calendar, a document): the page is a
 * raised card on the grey app frame. Frame suits side-by-side panels (messages, mail): the
 * sidebar on a grey tint, the page full-bleed. Flat suits simple, dense tools: one white
 * surface split by a line. The `Sidebar` inside takes the matching surface on its own; pass
 * nothing to it.
 */
import { RiCalendarLine, RiInboxLine, RiTeamLine } from '@remixicon/react';
import { AppShell, Sidebar } from '@wideset/react';

export default function AppShellDirections() {
  return (
    <div className="gap-ws-12 flex w-full flex-col">
      {(['flat', 'frame', 'inset'] as const).map((direction) => (
        <AppShell
          key={direction}
          direction={direction}
          className="border-ws-static-base rounded-ws-container-md h-[18rem] w-full overflow-hidden border"
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
              <Sidebar.Expanded>
                <nav aria-label={`Main, ${direction}`} className="gap-ws-2 flex flex-col">
                  <Sidebar.Item href="#" icon={RiInboxLine} label="Inbox" />
                  <Sidebar.Item href="#" icon={RiCalendarLine} label="Calendar" active />
                  <Sidebar.Item href="#" icon={RiTeamLine} label="Team" />
                </nav>
              </Sidebar.Expanded>
            </Sidebar.Section>
          </Sidebar>
          <AppShell.Main>
            <div className="gap-ws-5 p-ws-12 flex flex-col">
              <h2 className="typography-subtitle-md text-ws-static-strong capitalize">
                {direction}
              </h2>
              <p className="typography-body-md text-ws-static-subtle">
                Weekly planning, Thursday 10:00. Three meetings left this week.
              </p>
            </div>
          </AppShell.Main>
        </AppShell>
      ))}
    </div>
  );
}
