import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiCheckboxCircleFill,
  RiFilter3Line,
} from '@remixicon/react';
import { Avatar, Button, cn, IconButton, ProgressBar } from '@wideset/react';
import { type CSSProperties, useState } from 'react';

import {
  type Mark,
  type Member,
  members,
  MONTHS,
  type Task,
  WEEK,
  WEEK_STARTS,
  WEEKS_PER_MONTH,
} from './data';

const MONTH = WEEK * WEEKS_PER_MONTH;

/** Figma's table beside the timeline: 54px of chevrons, 176px of names, 72px of progress. */
const TABLE = 'w-[18.875rem]';
const CHEVRONS = 'w-[3.375rem]';

/*
  Bars and chips are Static/Fill/Alpha/Subtle laid over the page colour, so they are opaque and the
  month lines stop at them, as Figma's background blur makes them do. Breaks stay see-through.
*/
const GREY =
  'bg-ws-static-foreground bg-[linear-gradient(var(--ws-static-fill-alpha-subtle),var(--ws-static-fill-alpha-subtle))]';
/** Figma's break: 4px stripes at 45° every 9.45px, over two layers of Static/Fill/Alpha/Subtle. */
const HATCH =
  'bg-ws-static-alpha-base bg-[repeating-linear-gradient(135deg,var(--ws-static-fill-alpha-subtle)_0_4px,transparent_4px_6.68px)]';
const FOCUS =
  'focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default cursor-pointer';

const place = ({ start, length }: { start: number; length: number }): CSSProperties => ({
  left: start * WEEK,
  width: length * WEEK,
});

type Row = { kind: 'member'; member: Member } | { kind: 'task'; task: Task };

/** The people table and their work on a timeline of months; a task opens in the side panel. */
export function GanttChart({ onOpenTask }: { onOpenTask: (title: string) => void }) {
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const toggle = (id: string) =>
    setCollapsed((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));

  const rows = members.flatMap((member): Row[] => [
    { kind: 'member', member },
    ...(collapsed.includes(member.id)
      ? []
      : member.tasks.map((task): Row => ({ kind: 'task', task }))),
  ]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="flex min-h-full">
        <div className={cn(TABLE, 'shrink-0')}>
          <div className="border-ws-static-subtle h-ws-18 px-ws-11 typography-label-strong-sm text-ws-static-strong flex items-center border-b">
            Person
          </div>
          <div className="h-ws-18 px-ws-11 flex items-center">
            <Button variant="secondary" preset="border" size="sm">
              <Button.Icon icon={RiFilter3Line} />
              Filters
            </Button>
          </div>
          {rows.map((row) =>
            row.kind === 'member' ? (
              <MemberCells
                key={row.member.id}
                member={row.member}
                expanded={!collapsed.includes(row.member.id)}
                onToggle={() => toggle(row.member.id)}
              />
            ) : (
              <div key={row.task.id} className="h-ws-15 pr-ws-21 flex items-center pl-[3.375rem]">
                <button
                  type="button"
                  onClick={() => onOpenTask(row.task.title)}
                  className={cn(
                    'typography-label-sm text-ws-static-subtle hover:text-ws-static-strong rounded-ws-control-sm truncate',
                    FOCUS,
                  )}
                >
                  {row.task.title}
                </button>
              </div>
            ),
          )}
          <div className="h-ws-18 pl-ws-6 flex items-center">
            <Button variant="secondary" preset="ghost" size="sm">
              <Button.Icon icon={RiAddLine} />
              New project
            </Button>
          </div>
        </div>

        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* The timeline is a canvas: it scrolls sideways, without a bar, past what the window shows. */}
          <div className="flex-1 [scrollbar-width:none] overflow-x-auto">
            <div className="relative min-h-full" style={{ width: MONTHS.length * MONTH }}>
              <div aria-hidden="true" className="absolute inset-0 flex">
                {MONTHS.map((month) => (
                  <div
                    key={month}
                    className="border-ws-static-base shrink-0 border-r"
                    style={{ width: MONTH }}
                  />
                ))}
              </div>
              <div className="flex">
                {MONTHS.map((month) => (
                  <div
                    key={month}
                    className="border-ws-static-subtle h-ws-18 px-ws-9 typography-label-strong-sm text-ws-static-strong flex shrink-0 items-center border-b"
                    style={{ width: MONTH }}
                  >
                    {month}
                  </div>
                ))}
              </div>
              <div className="flex">
                {MONTHS.map((month) => (
                  <div
                    key={month}
                    className="h-ws-18 pt-ws-7 typography-caption-md text-ws-static-subtle flex shrink-0"
                    style={{ width: MONTH }}
                  >
                    {WEEK_STARTS.map((day) => (
                      <span key={day} className="flex-1 text-center">
                        {day}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              {rows.map((row) =>
                row.kind === 'member' ? (
                  <div key={row.member.id} className="h-ws-18 relative">
                    {row.member.marks.map((mark, index) => (
                      <TimelineMark key={index} mark={mark} top="top-ws-7" />
                    ))}
                  </div>
                ) : (
                  <div key={row.task.id} className="h-ws-15 relative">
                    {row.task.marks.map((mark, index) => (
                      <TimelineMark
                        key={index}
                        mark={mark}
                        top="top-ws-3"
                        title={row.task.title}
                        onOpen={() => onOpenTask(row.task.title)}
                      />
                    ))}
                  </div>
                ),
              )}
            </div>
          </div>
          {/* Figma's table divider is 2px of #000000 at 8%, unbound: Static/Stroke/Subtle is that value. */}
          <span
            aria-hidden="true"
            className="border-ws-static-subtle absolute inset-y-0 left-0 border-l-2"
          />
        </div>
      </div>
    </div>
  );
}

/** A person's row in the table: expand, who, how far along. */
function MemberCells({
  member,
  expanded,
  onToggle,
}: {
  member: Member;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="h-ws-18 flex items-center">
      <div className={cn(CHEVRONS, 'pl-ws-9 shrink-0')}>
        <IconButton
          variant="secondary"
          preset="ghost"
          size="xs"
          icon={expanded ? RiArrowDownSLine : RiArrowRightSLine}
          aria-label={`${member.name}’s tasks`}
          aria-expanded={expanded}
          onClick={onToggle}
        />
      </div>
      <div className="gap-ws-7 flex min-w-0 flex-1 items-center">
        {member.initials ? (
          <Avatar size="sm" initials={member.initials} color={member.color} status="online" />
        ) : (
          <Avatar size="sm" status="online" />
        )}
        <span className="typography-label-strong-sm text-ws-static-strong truncate">
          {member.name}
        </span>
      </div>
      <div className="w-ws-21 pr-ws-9 flex shrink-0 justify-end">
        <ProgressBar
          type="circle"
          value={member.progress}
          aria-label={`${member.name}, work done`}
        />
      </div>
    </div>
  );
}

/**
 * One mark on a row. A person's bars only show their load; a task's marks open it. Figma's done
 * part carries a 1.5px inside stroke of #000000 at 10%, unbound: Static/Stroke/Base (1px) stands in.
 */
function TimelineMark({
  mark,
  top,
  title,
  onOpen,
}: {
  mark: Mark;
  top: string;
  title?: string;
  onOpen?: () => void;
}) {
  const box = cn('h-ws-13 rounded-ws-container-sm absolute', top);

  if (mark.kind === 'break') {
    return <span aria-hidden="true" className={cn(box, HATCH)} style={place(mark)} />;
  }

  if (mark.kind === 'bar') {
    const done =
      mark.progress > 0 ? (
        <span
          className="bg-ws-non-semantic-brand-strong rounded-ws-container-sm absolute inset-y-0 left-0 inset-ring inset-ring-(--ws-static-stroke-base)"
          style={{ width: `${mark.progress * 100}%` }}
        />
      ) : null;
    return title ? (
      <button
        type="button"
        aria-label={title}
        onClick={onOpen}
        className={cn(box, GREY, FOCUS)}
        style={place(mark)}
      >
        {done}
      </button>
    ) : (
      <span aria-hidden="true" className={cn(box, GREY)} style={place(mark)}>
        {done}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        box,
        GREY,
        FOCUS,
        'gap-ws-5 pl-ws-5 pr-ws-4 typography-label-sm text-ws-static-base flex items-center whitespace-nowrap',
        // Figma outlines the task in focus inside the chip: 1.5px of #5846f8 at 50%, unbound.
        mark.highlighted && 'inset-ring inset-ring-(--ws-dynamic-stroke-primary-default)',
      )}
      style={place(mark)}
    >
      {title}
      {mark.done ? (
        <>
          <RiCheckboxCircleFill
            aria-hidden="true"
            className="size-ws-11 text-ws-semantic-positive ml-auto shrink-0"
          />
          <span className="sr-only">, done</span>
        </>
      ) : null}
    </button>
  );
}
