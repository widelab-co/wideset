/**
 * Pick one direction for the whole app, by what the app is, and keep it on every screen. Inset,
 * the default, suits apps with navigation and several regions (a calendar, a document): the page
 * is a raised card on the grey app frame. Flat suits simple, dense tools: one white surface split
 * by a line. Frame suits side-by-side panels (messages, mail): the sidebar on a grey tint, the
 * page full-bleed. Canvas suits pages made of separate modules (an overview, a wallet): the page
 * stays grey and the content sits in white sections. The `Sidebar` inside takes the matching
 * surface on its own; pass nothing to it.
 */
import { RiCalendarLine, RiInboxLine, RiTeamLine } from '@remixicon/react';
import { AppShell, Sidebar } from '@wideset/react';

const directions = ['inset', 'flat', 'frame', 'canvas'] as const;

export default function AppShellDirections() {
  return (
    <div className="gap-ws-12 flex w-full flex-col">
      {directions.map((direction) => (
        <AppShell
          key={direction}
          direction={direction}
          className="border-ws-static-base rounded-ws-container-md h-[18rem] w-full overflow-hidden border"
        >
          <Sidebar>
            <Sidebar.Header>
              <div className="typography-label-strong-sm text-ws-static-strong py-ws-3 pl-ws-5">
                Northwind
              </div>
            </Sidebar.Header>
            <Sidebar.Section>
              <nav aria-label={`Main, ${direction}`} className="gap-ws-2 flex flex-col">
                <Sidebar.Item href="#" icon={RiInboxLine} label="Inbox" />
                <Sidebar.Item href="#" icon={RiCalendarLine} label="Calendar" active />
                <Sidebar.Item href="#" icon={RiTeamLine} label="Team" />
              </nav>
            </Sidebar.Section>
          </Sidebar>
          <AppShell.Main>
            {direction === 'canvas' ? (
              <div className="p-ws-7 flex flex-col">
                <section className="bg-ws-static-foreground rounded-ws-container-md gap-ws-5 p-ws-12 flex flex-col">
                  <h2 className="typography-subtitle-md text-ws-static-strong capitalize">
                    {direction}
                  </h2>
                  <p className="typography-body-md text-ws-static-subtle">
                    Weekly planning, Thursday 10:00. Three meetings left this week.
                  </p>
                </section>
              </div>
            ) : (
              <div className="gap-ws-5 p-ws-12 flex flex-col">
                <h2 className="typography-subtitle-md text-ws-static-strong capitalize">
                  {direction}
                </h2>
                <p className="typography-body-md text-ws-static-subtle">
                  Weekly planning, Thursday 10:00. Three meetings left this week.
                </p>
              </div>
            )}
          </AppShell.Main>
        </AppShell>
      ))}
    </div>
  );
}
