import { RiSideBarLine } from '@remixicon/react';
import { Breadcrumbs, cn, IconButton, ToastProvider, useToast } from '@wideset/react';
import { useId, useState } from 'react';

import { AchievementList } from './achievement-list';
import {
  achievements,
  doneAtStart,
  type Goal,
  goals as goalsAtStart,
  QUARTER,
  standings,
  TODAY,
} from './data';
import { formatCount, formatRange } from './format';
import { GoalList } from './goal-list';
import { Leaderboard } from './leaderboard';
import { NewGoalModal } from './new-goal-modal';
import { PageHeader } from './page-header';
import { Section } from './section';
import { GoalsSidebar } from './sidebar';

/** One column of the page: the header and the body share its edges. */
const COLUMN = 'px-ws-14 mx-auto w-full max-w-[80rem]';

const daysLeft = (Date.parse(QUARTER.to) - Date.parse(TODAY)) / 86_400_000;

const MILESTONES = achievements.map(({ person, ...milestone }) => ({
  ...milestone,
  person: person.name,
}));

/** The page: the goals first, then who is ahead and what was reached. */
function GoalsPage() {
  const sidebarId = useId();
  const { showToast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  const [goals, setGoals] = useState(goalsAtStart);
  const [done, setDone] = useState(doneAtStart);
  // The goal at risk opens on load: ticking its next key result is what moves it back on track.
  const [open, setOpen] = useState(['expansion']);
  const [adding, setAdding] = useState(false);

  const toggle = (id: string, value: boolean) =>
    setOpen((all) => (value ? [...all, id] : all.filter((item) => item !== id)));

  const tick = (goalId: string, resultId: string, value: boolean) =>
    setDone((all) => {
      const current = all[goalId] ?? [];
      return {
        ...all,
        [goalId]: value ? [...current, resultId] : current.filter((item) => item !== resultId),
      };
    });

  const add = (goal: Omit<Goal, 'id'>) => {
    setGoals((all) => [...all, { ...goal, id: `goal-${all.length + 1}` }]);
    setAdding(false);
    showToast({ status: 'success', content: `Goal added: ${goal.name}` });
  };

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <GoalsSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
              <Breadcrumbs.Item>Goals</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls inside the card, so the card's corners stay put. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className={cn(COLUMN, 'gap-ws-12 pt-ws-14 pb-ws-16 flex flex-col')}>
            <PageHeader
              summary={`The sales team’s goals for ${QUARTER.label}, ${formatRange(QUARTER.from, QUARTER.to)}. ${formatCount(daysLeft)} days left.`}
              onNewGoal={() => setAdding(true)}
            />

            <div className="gap-ws-16 flex flex-col">
              <GoalList
                goals={goals}
                done={done}
                open={open}
                onOpenChange={toggle}
                onDoneChange={tick}
              />

              <div className="gap-ws-16 grid grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_18rem]">
                <Section title="Leaderboard">
                  <Leaderboard standings={standings} />
                </Section>
                <Section title="Milestones this quarter">
                  <AchievementList items={MILESTONES} />
                </Section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <NewGoalModal open={adding} onOpenChange={setAdding} onAdd={add} />
    </div>
  );
}

/**
 * Goals (Inset direction): the sales team's goals for the quarter on the raised page beside the
 * workspace sidebar. The goals come first and weigh most: rows on the white, each with its owner,
 * its figure against the target as one bar, a state that is a judgement, and its key results to
 * tick off. Under them, the leaderboard as a plain ranked table and the quarter's milestones as a
 * quiet list. "New goal" is the one filled button and opens a short dialog.
 */
export default function Goals() {
  return (
    <ToastProvider position="bottom-center">
      <GoalsPage />
    </ToastProvider>
  );
}
