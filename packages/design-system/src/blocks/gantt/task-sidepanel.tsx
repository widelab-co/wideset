import {
  type RemixiconComponentType,
  RiAddLine,
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowUpSLine,
  RiChat2Line,
  RiCloseLine,
  RiMoreFill,
  RiUserFill,
} from '@remixicon/react';
import {
  Avatar,
  type AvatarColor,
  Button,
  Checkbox,
  cn,
  IconButton,
  ProgressBar,
  Sidepanel,
  StatusBadge,
  Switch,
  Tabs,
  Tag,
  type TagProps,
} from '@wideset/react';
import { Fragment, type ReactNode } from 'react';

/*
  The task side panel, one file so it can be copied on its own: the Gantt starting point carries a
  byte-identical copy (src/__tests__/blocks.test.tsx keeps the two the same).
*/

export type Person = { name: string; initials: string; color: AvatarColor };

/** One entry in the task's history. */
export type Activity = {
  id: string;
  /** What happened, e.g. "Task created by"; `person` follows it when there is one. */
  text: string;
  person?: Person;
  date: string;
  /** The subtask the entry is about, drawn as a card under the date. */
  subtask?: { title: string; reviewers: number; doneBy: string; comments: number };
};

export type TaskDetail = {
  title: string;
  /** The line under the title. */
  due: string;
  private: boolean;
  /** Who the task is shared with, in the header. */
  people: Person[];
  status: { label: string; color: TagProps['color'] };
  labels: { label: string; color: TagProps['color'] }[];
  assignee: Person;
  dueDate: string;
  /** `progress` (0–100) draws a ring beside a subtask under way. */
  subtasks: { id: string; title: string; done: boolean; progress?: number }[];
  activity: Activity[];
};

type TaskSidepanelProps = {
  task: TaskDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'activity', label: 'Activity Log' },
  { value: 'backlog', label: 'Backlog' },
  { value: 'label', label: 'Label' },
];

/**
 * Figma's Side Panel `Size=Small, Type=Task`: a record's detail beside the page. The page stays in
 * use, so there is no scrim: picking another record swaps the panel's content instead of closing
 * it, and focus stays where the user is. The close button and Esc close it.
 */
export function TaskSidepanel({ task, open, onOpenChange }: TaskSidepanelProps) {
  return (
    <Sidepanel open={open} onOpenChange={onOpenChange} modal={false}>
      <Sidepanel.Panel
        size="sm"
        // Without the scrim, Figma raises the panel on Elevation/High (an override on the instance).
        className="shadow-ws-high"
        onInteractOutside={(event) => event.preventDefault()}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <Fragment key={task.title}>
          <div className="border-ws-static-base h-ws-20 gap-ws-7 px-ws-12 flex shrink-0 items-center justify-between border-b">
            <Switch label="Private" defaultChecked={task.private} />
            <div className="gap-ws-5 flex items-center">
              {/* One letter each: at 24px, overlapping two-letter initials run into each other. */}
              <Avatar.Group size="sm" className="w-auto">
                {task.people.map((person) => (
                  <Avatar
                    key={person.name}
                    initials={person.initials.charAt(0)}
                    color={person.color}
                    status="online"
                  />
                ))}
              </Avatar.Group>
              <IconButton
                variant="secondary"
                preset="border"
                size="sm"
                icon={RiMoreFill}
                aria-label="More actions"
              />
              <Sidepanel.Close asChild>
                <IconButton
                  variant="secondary"
                  preset="border"
                  size="sm"
                  icon={RiCloseLine}
                  aria-label="Close"
                />
              </Sidepanel.Close>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div className="p-ws-12">
              <Sidepanel.Title>{task.title}</Sidepanel.Title>
              <Sidepanel.Description className="mt-ws-5">{task.due}</Sidepanel.Description>
            </div>

            <dl className="gap-ws-7 px-ws-12 pb-ws-12 flex flex-col">
              <Property label="Status">
                <Tag size="sm" color={task.status.color}>
                  {task.status.label}
                </Tag>
              </Property>
              <Property label="Labels">
                {task.labels.map((label) => (
                  <Tag key={label.label} size="sm" color={label.color}>
                    {label.label}
                  </Tag>
                ))}
              </Property>
              <Property label="Assigned to">
                <Avatar size="xs" initials={task.assignee.initials} color={task.assignee.color} />
                {task.assignee.name}
              </Property>
              <Property label="Due Date">{task.dueDate}</Property>
            </dl>

            <div className="px-ws-12 pb-ws-12">
              <Button variant="primary" preset="border" size="sm">
                <Button.Icon icon={RiAddLine} />
                Complete
              </Button>
            </div>

            <div className="px-ws-12 pb-ws-12">
              {/* Figma's stroke is inside the card: an inset ring keeps its 6px and 4px padding. */}
              <div className="bg-ws-static-container rounded-ws-container-sm pt-ws-4 pb-ws-3 inset-ring inset-ring-(--ws-static-stroke-base)">
                <ul aria-label="Subtasks">
                  {task.subtasks.map((subtask) => (
                    <li
                      key={subtask.id}
                      // Label/Small sets the row's line: ProgressBar's ring then sits in 20px, not the page's 24px.
                      className="gap-ws-9 px-ws-9 py-ws-5 typography-label-sm flex items-center justify-between"
                    >
                      <Checkbox label={subtask.title} defaultChecked={subtask.done} />
                      {subtask.progress === undefined ? null : (
                        <ProgressBar
                          type="circle"
                          value={subtask.progress}
                          aria-label={`${subtask.title} progress`}
                        />
                      )}
                    </li>
                  ))}
                </ul>
                <div className="h-ws-15 gap-ws-6 px-ws-8 flex items-center">
                  <IconButton
                    variant="secondary"
                    preset="ghost"
                    size="xs"
                    icon={RiAddLine}
                    aria-label="Add subtask"
                  />
                  <span aria-hidden="true" className="typography-body-md text-ws-static-subtle">
                    Add subtask
                  </span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" divider={false} className="flex-1">
              {/* The line under the tabs is the header's own, Static/Stroke/Base, edge to edge. */}
              <div className="border-ws-static-base px-ws-12 border-b">
                <Tabs.List aria-label="Task sections">
                  {TABS.map((tab) => (
                    <Tabs.Item key={tab.value} value={tab.value}>
                      <Tabs.Label>{tab.label}</Tabs.Label>
                    </Tabs.Item>
                  ))}
                </Tabs.List>
              </div>
              {/* Figma lays the grey (Static/Fill/Alpha/Subtle) over Static/Fill/Foreground. */}
              <div className="bg-ws-static-foreground flex flex-1 flex-col">
                <div className="bg-ws-static-alpha-subtle px-ws-12 py-ws-12 flex-1">
                  {TABS.map((tab) => (
                    <Tabs.Content key={tab.value} value={tab.value}>
                      {tab.value === 'overview' || tab.value === 'activity' ? (
                        <ActivityTimeline items={task.activity} />
                      ) : (
                        <p className="py-ws-5 typography-body-md text-ws-static-subtle">
                          Nothing here yet.
                        </p>
                      )}
                    </Tabs.Content>
                  ))}
                </div>
              </div>
            </Tabs>
          </div>

          <div className="bg-ws-static-overlay px-ws-12 py-ws-9 flex shrink-0 items-center justify-between">
            <div className="gap-ws-12 flex items-center">
              <Hint
                keys={
                  <span className="gap-ws-3 flex">
                    <Key icon={RiArrowUpSLine} name="Up arrow" />
                    <Key icon={RiArrowDownSLine} name="Down arrow" />
                  </span>
                }
              >
                Navigate
              </Hint>
              <Hint keys={<Key icon={RiArrowLeftLine} name="Left arrow" />}>Return to parent</Hint>
            </div>
            <Hint keys={<Key>esc</Key>}>Close</Hint>
          </div>
        </Fragment>
      </Sidepanel.Panel>
    </Sidepanel>
  );
}

/** A property row: its name in a 96px column, the value beside it. */
function Property({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="gap-ws-9 flex items-start">
      <dt className="w-ws-24 typography-body-md text-ws-static-subtle shrink-0">{label}</dt>
      <dd className="gap-ws-5 typography-body-md text-ws-static-strong flex items-center">
        {children}
      </dd>
    </div>
  );
}

/** The task's history on a line of dots, newest first. */
function ActivityTimeline({ items }: { items: Activity[] }) {
  return (
    <ol className="gap-ws-12 py-ws-5 flex flex-col">
      {items.map((item, index) => (
        <li key={item.id} className="gap-ws-8 relative flex">
          {/* Figma's dot (#9a9a9a) and line (#e5e5e5) are unbound: the nearest tokens stand in. */}
          <span aria-hidden="true" className="w-ws-15 pt-ws-6 flex shrink-0 justify-center">
            <span className="size-ws-5 rounded-ws-control-full relative bg-(--ws-semantic-stroke-neutral)" />
          </span>
          {index < items.length - 1 ? (
            <span
              aria-hidden="true"
              className="border-ws-static-subtle left-ws-10 top-ws-11 -bottom-ws-16 absolute border-l"
            />
          ) : null}
          <div className="gap-ws-7 flex min-w-0 flex-1 flex-col">
            <div className="gap-ws-3 flex flex-col">
              <p className="gap-ws-3 typography-label-strong-sm text-ws-static-base flex items-center">
                {item.text}
                {item.person ? (
                  <>
                    <Avatar size="xs" initials={item.person.initials} color={item.person.color} />
                    {item.person.name}
                  </>
                ) : null}
              </p>
              <p className="typography-body-md text-ws-static-subtle">{item.date}</p>
            </div>
            {item.subtask ? (
              <div className="bg-ws-static-foreground rounded-ws-container-sm gap-ws-3 px-ws-5 pt-ws-5 pb-ws-7 flex flex-col">
                <div className="gap-ws-5 p-ws-3 flex items-start">
                  <p className="typography-label-sm text-ws-static-strong min-w-0 flex-1">
                    {item.subtask.title}
                  </p>
                  <IconButton
                    variant="secondary"
                    preset="ghost"
                    size="xs"
                    icon={RiMoreFill}
                    aria-label={`Actions for ${item.subtask.title}`}
                  />
                </div>
                <div className="px-ws-3 flex items-center justify-between">
                  <div className="gap-ws-3 flex items-center">
                    <StatusBadge size="sm">
                      <StatusBadge.Icon icon={RiUserFill} />
                      <StatusBadge.Label>{item.subtask.reviewers} reviewers</StatusBadge.Label>
                    </StatusBadge>
                    <StatusBadge size="sm">
                      <StatusBadge.Label>Done by {item.subtask.doneBy}</StatusBadge.Label>
                    </StatusBadge>
                  </div>
                  <StatusBadge size="sm">
                    <StatusBadge.Icon icon={RiChat2Line} />
                    <StatusBadge.Label>
                      {item.subtask.comments}
                      <span className="sr-only"> comments</span>
                    </StatusBadge.Label>
                  </StatusBadge>
                </div>
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A keyboard hint in the footer: the keys, then what they do. */
function Hint({ keys, children }: { keys: ReactNode; children: string }) {
  return (
    <span className="gap-ws-5 typography-body-md text-ws-static-subtle flex items-center">
      {keys}
      {children}
    </span>
  );
}

/**
 * A key, drawn as Figma draws it here: the box of Button `xs` Border, as a `kbd` (the calendar
 * sidebar's Shortcut is the same idea). An icon key names itself for screen readers.
 */
function Key({
  icon: Icon,
  name,
  children,
}: {
  icon?: RemixiconComponentType;
  name?: string;
  children?: string;
}) {
  return (
    <kbd
      className={cn(
        'font-ws-body border-ws-dynamic-secondary-default bg-ws-static-highlight-subtle shadow-ws-controls-control rounded-ws-control-md h-ws-12 typography-caption-strong-md text-ws-dynamic-secondary-default flex items-center justify-center border',
        Icon ? 'w-ws-12' : 'px-ws-5',
      )}
    >
      {Icon ? (
        <>
          <Icon aria-hidden="true" className="size-ws-8 shrink-0" />
          <span className="sr-only">{name}</span>
        </>
      ) : (
        children
      )}
    </kbd>
  );
}
