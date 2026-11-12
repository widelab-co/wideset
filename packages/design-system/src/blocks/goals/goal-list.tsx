// TODO(custom): goal rows that open onto their key results; Table has no expandable row.
import { RiArrowDownSLine, RiArrowRightSLine } from '@remixicon/react';
import { Card, cn, StatusBadge, type StatusBadgeProps } from '@wideset/react';
import { useId } from 'react';

import { figureOf, type Goal, type GoalState, MEASURES, stateOf } from './data';
import { formatDay, formatMeasure } from './format';
import { GoalMeter } from './goal-meter';
import { KeyResultList } from './key-result-list';
import { PersonAvatar } from './person-avatar';

/**
 * The columns every row shares, header and key results included: goal, owner, progress, state,
 * due. Inset 20px, like a card's title.
 */
const COLUMNS =
  'gap-x-ws-12 px-ws-11 grid grid-cols-[minmax(0,1fr)_10rem_16rem_5.5rem_4.5rem] items-center';

/** Every state carries its meaning: done and on track are good, at risk needs a look, behind is bad. */
const STATE_COLOR: Record<GoalState, StatusBadgeProps['color']> = {
  'On track': 'positive',
  'At risk': 'notice',
  Behind: 'negative',
  Done: 'positive',
};

type GoalListProps = {
  goals: Goal[];
  /** Ids of the key results done, by goal. */
  done: Record<string, string[]>;
  /** Ids of the goals open on their key results. */
  open: string[];
  onOpenChange: (id: string, open: boolean) => void;
  onDoneChange: (goalId: string, resultId: string, done: boolean) => void;
};

/**
 * The quarter's goals, the page's main thing, as rows in a card, split by lines, under one header
 * row: the goal and
 * what it measures, its owner, the figure against the target with one bar, the state and the due
 * date. A row does one thing, open its key results, so its name is a button stretched over the
 * whole row; the hover runs across it and the chevron turns.
 */
export function GoalList({ goals, done, open, onOpenChange, onDoneChange }: GoalListProps) {
  const id = useId();

  return (
    <Card role="region" aria-label="Goals">
      <div
        aria-hidden="true"
        className={cn(
          COLUMNS,
          'h-ws-18 border-ws-static-base typography-label-strong-sm text-ws-static-base border-b',
        )}
      >
        <span className="pl-ws-12">Goal</span>
        <span>Owner</span>
        <span>Progress</span>
        <span>State</span>
        <span className="text-right">Due</span>
      </div>

      <ul>
        {goals.map((goal) => {
          const expanded = open.includes(goal.id);
          const goalDone = done[goal.id] ?? [];
          const figure = figureOf(goal, goalDone);
          const state = stateOf(goal, figure);
          const resultsId = `${id}-${goal.id}`;
          const Chevron = expanded ? RiArrowDownSLine : RiArrowRightSLine;

          return (
            // The last row ends on the card's border, so it draws no line of its own.
            <li key={goal.id} className="border-ws-static-base border-b last:border-b-0">
              <div
                className={cn(
                  COLUMNS,
                  'py-ws-7 hover:bg-ws-dynamic-secondary-alpha-hover relative',
                )}
              >
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={resultsId}
                  onClick={() => onOpenChange(goal.id, !expanded)}
                  className="gap-ws-5 focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default after:inset-ws-0 flex min-w-0 cursor-pointer items-center text-left after:absolute"
                >
                  <Chevron
                    aria-hidden="true"
                    className="size-ws-9 text-ws-dynamic-secondary-default shrink-0"
                  />
                  <span className="flex min-w-0 flex-col">
                    <span className="typography-label-strong-sm text-ws-static-strong truncate">
                      {goal.name}
                    </span>
                    <span className="typography-caption-md text-ws-static-subtle truncate">
                      {MEASURES[goal.measure].label}
                    </span>
                  </span>
                </button>
                <span className="gap-ws-5 typography-label-sm text-ws-static-base flex min-w-0 items-center">
                  <PersonAvatar
                    size="sm"
                    name={goal.owner.name}
                    initials={goal.owner.initials}
                    color={goal.owner.color}
                    aria-hidden
                  />
                  <span className="truncate">{goal.owner.name}</span>
                </span>
                <GoalMeter
                  figure={formatMeasure(goal.measure, figure)}
                  target={formatMeasure(goal.measure, goal.target)}
                  value={figure}
                  max={goal.target}
                  label={`${goal.name}, progress`}
                />
                <span>
                  <StatusBadge size="sm" color={STATE_COLOR[state]}>
                    {state}
                  </StatusBadge>
                </span>
                <span className="typography-label-sm text-ws-static-base text-right tabular-nums">
                  <span className="sr-only">Due </span>
                  {formatDay(goal.due)}
                </span>
              </div>

              {expanded && (
                <div id={resultsId}>
                  <KeyResultList
                    results={goal.keyResults}
                    done={goalDone}
                    measure={goal.measure}
                    goal={goal.name}
                    rowClassName={COLUMNS}
                    onDoneChange={(resultId, value) => onDoneChange(goal.id, resultId, value)}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
