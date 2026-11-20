import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, cn, IconButton } from '@wideset/react';
import { useId, useState } from 'react';

import { account, doneAtStart, meetings, type Task, tasks as tasksAtStart, TODAY } from './data';
import { formatLongDay } from './format';
import { HomeSidebar } from './sidebar';
import { TaskList } from './task-list';
import { UpcomingMeetings } from './upcoming-meetings';
import { WhatsNewModal } from './whats-new-modal';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

/**
 * What's new (Inset direction): the updates since the last visit, open on load over a quiet Home
 * (today's tasks and what is coming up), the way a product shows them the morning after a release.
 * What's new in the sidebar's help area opens them again.
 */
export default function WhatsNew() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(tasksAtStart);
  const [done, setDone] = useState(doneAtStart);
  const [open, setOpen] = useState(true);
  const [muted, setMuted] = useState(false);

  const mark = (id: string, value: boolean) =>
    setDone((current) => (value ? [...current, id] : current.filter((item) => item !== id)));
  const add = (title: string) =>
    setTasks((current) => [...current, { id: `added-${current.length}`, title }]);

  return (
    <AppShell direction="inset">
      <HomeSidebar
        id={sidebarId}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        onWhatsNew={() => setOpen(true)}
      />
      <AppShell.Main>
        <div className="h-ws-18 border-ws-static-base flex shrink-0 items-center border-b">
          {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
              left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
          <div className="gap-ws-5 px-ws-11 flex w-full items-center">
            <IconButton
              icon={RiSideBarLine}
              variant="secondary"
              preset="ghost"
              size="sm"
              iconClassName="text-ws-static-subtle size-ws-9"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              aria-controls={sidebarId}
              onClick={() => setCollapsed(!collapsed)}
              className="-ml-ws-5"
            />
            <Breadcrumbs separator="arrow">
              <Breadcrumbs.Item>Home</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
            <header className="gap-ws-2 flex flex-col">
              <h1 className="typography-title-md text-ws-static-strong">
                Good morning, {account.firstName}
              </h1>
              <p className="typography-body-md text-ws-static-subtle">
                {formatLongDay(TODAY)}. Your tasks and meetings for the day.
              </p>
            </header>

            <div className="gap-ws-16 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_18rem]">
              <TaskList tasks={tasks} done={done} today={TODAY} onDoneChange={mark} onAdd={add} />
              <UpcomingMeetings meetings={meetings} today={TODAY} />
            </div>
          </div>
        </div>
      </AppShell.Main>
      <WhatsNewModal open={open} onOpenChange={setOpen} muted={muted} onMutedChange={setMuted} />
    </AppShell>
  );
}
