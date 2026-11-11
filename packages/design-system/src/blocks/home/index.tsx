import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, cn, IconButton } from '@wideset/react';
import { useId, useState } from 'react';

import {
  account,
  deals,
  doneAtStart,
  meetings,
  recentRecords,
  type Task,
  tasks as tasksAtStart,
  TODAY,
} from './data';
import { DealsTable } from './deals-table';
import { formatLongDay } from './format';
import { RecentRecords } from './recent-records';
import { HomeSidebar } from './sidebar';
import { TaskList } from './task-list';
import { UpcomingMeetings } from './upcoming-meetings';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

/**
 * Home (Inset direction): the first page after sign-in, on the raised page beside the workspace
 * sidebar. It answers "what do I do today": the task list is the main column's first and
 * heaviest thing, the deals to move this week under it, and a narrow column beside them for what
 * is coming up and the way back to recent records. No key figures: those are the dashboard's.
 */
export default function Home() {
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(tasksAtStart);
  const [done, setDone] = useState(doneAtStart);

  const mark = (id: string, value: boolean) =>
    setDone((current) => (value ? [...current, id] : current.filter((item) => item !== id)));
  const add = (title: string) =>
    setTasks((current) => [...current, { id: `added-${current.length}`, title }]);

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <HomeSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 flex min-w-0 flex-1 flex-col overflow-hidden">
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
              <h1 className="typography-subtitle-md text-ws-static-strong">
                Good morning, {account.firstName}
              </h1>
              <p className="typography-body-md text-ws-static-subtle">
                {formatLongDay(TODAY)}. Your tasks, deals and meetings for the day.
              </p>
            </header>

            <div className="gap-ws-16 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="gap-ws-16 flex min-w-0 flex-col">
                <TaskList tasks={tasks} done={done} today={TODAY} onDoneChange={mark} onAdd={add} />
                <DealsTable deals={deals} />
              </div>

              <aside aria-label="Calendar and recent records" className="gap-ws-16 flex flex-col">
                <UpcomingMeetings meetings={meetings} today={TODAY} />
                <RecentRecords records={recentRecords} />
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
