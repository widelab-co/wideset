import { useState } from 'react';

import { account, doneAtStart, steps, workspace } from './data';
import { Resources } from './resources';
import { SetupChecklist } from './setup-checklist';
import { OnboardingSidebar } from './sidebar';

/**
 * Onboarding (Inset direction): a new workspace's first run on the raised page, in one reading
 * column: a welcome that says what Orbit is for, the setup checklist with its progress, and help
 * under it. Steps tick off by hand or by doing them; the sidebar's Get started keeps the count.
 */
export default function Onboarding() {
  const [done, setDone] = useState(doneAtStart);

  const mark = (id: string, value: boolean) =>
    setDone((current) => (value ? [...current, id] : current.filter((item) => item !== id)));

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <OnboardingSidebar progress={`${done.length}/${steps.length}`} />
      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="px-ws-16 gap-ws-16 py-ws-16 mx-auto flex w-full max-w-[52rem] flex-col">
            <header className="gap-ws-3 flex flex-col">
              <h1 className="typography-subtitle-md text-ws-static-strong">
                Welcome to Orbit, {account.firstName}
              </h1>
              <p className="typography-body-md text-ws-static-base">
                Keep your customers, deals and revenue in one place, so the whole studio knows who
                to call next.
              </p>
            </header>

            <SetupChecklist
              workspaceName={workspace.name}
              steps={steps}
              done={done}
              onDoneChange={mark}
              // Each action opens its own flow in a real app (an import, the invite dialog,
              // settings); here finishing it is instant.
              onStart={(id) => mark(id, true)}
            />
            <Resources />
          </div>
        </div>
      </main>
    </div>
  );
}
