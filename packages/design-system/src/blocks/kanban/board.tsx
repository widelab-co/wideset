import { RiAddLine, RiAttachment2, RiChat2Line, RiLinkM, RiMoreFill } from '@remixicon/react';
import { Avatar, Button, cn, Divider, IconButton, StatusBadge, Tag } from '@wideset/react';

import type { Badge, Column, Task, TaskGroup } from './data';

const isGroup = (item: Task | TaskGroup): item is TaskGroup => 'tasks' in item;

function TaskMenu({ label }: { label: string }) {
  return (
    <IconButton
      icon={RiMoreFill}
      size="xs"
      variant="secondary"
      preset="ghost"
      aria-label={`Actions for ${label}`}
    />
  );
}

function TaskBadge({ badge }: { badge: Badge }) {
  if (badge.kind === 'tag') {
    return (
      <Tag size="sm" color={badge.color}>
        {badge.label}
      </Tag>
    );
  }
  return (
    <StatusBadge size="sm" color={badge.color}>
      {badge.icon ? <StatusBadge.Icon icon={badge.icon} /> : null}
      <StatusBadge.Label>{badge.label}</StatusBadge.Label>
    </StatusBadge>
  );
}

/**
 * One task. On the column it is raised (Static/Fill/Overlay, Elevation/Low); inside a stack it lies
 * flat on Static/Fill/Container and drops the header row, since the stack names the person.
 */
function TaskCard({ task, nested = false }: { task: Task; nested?: boolean }) {
  const { assignee, date, details, title, badges, comments, attachments, link } = task;
  const name = title ?? assignee?.name ?? 'Unassigned task';
  const hasHeader = assignee !== undefined;

  return (
    <article
      className={cn(
        'p-ws-5 gap-ws-5 flex flex-col',
        nested ? 'bg-ws-static-container rounded-ws-container-sm' : 'shadow-ws-low',
        !nested &&
          (task.highlighted
            ? 'bg-ws-dynamic-primary-alpha-strong-default rounded-ws-container-md'
            : 'bg-ws-static-overlay rounded-ws-container-sm'),
      )}
    >
      {hasHeader ? (
        <div className="p-ws-3 gap-ws-4 flex flex-col">
          <div className="gap-ws-5 flex items-center">
            {assignee ? (
              <Avatar
                size="sm"
                initials={assignee.initials}
                color={assignee.color}
                status={assignee.online ? 'online' : undefined}
              />
            ) : (
              <Avatar size="sm" shape="square" />
            )}
            <p className="typography-label-sm text-ws-static-strong min-w-0 flex-1 truncate">
              {assignee?.name ?? 'Unknown'}
            </p>
            <TaskMenu label={name} />
          </div>
          {date ? <p className="typography-label-sm text-ws-static-base">{date}</p> : null}
          {details ? (
            <div className="mt-ws-4 gap-ws-7 flex flex-col">
              <Divider weight="thin" emphasis="subtle" className="-mx-ws-7 w-auto" />
              <ul className="gap-ws-3 flex flex-col">
                {details.map(({ icon: Icon, label }) => (
                  <li key={label} className="gap-ws-5 flex items-center">
                    <span className="size-ws-12 flex shrink-0 items-center justify-center">
                      <Icon
                        aria-hidden="true"
                        className="size-ws-9 text-ws-dynamic-secondary-default"
                      />
                    </span>
                    <span className="typography-label-sm text-ws-static-base truncate">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {!hasHeader && date ? (
        <p className="p-ws-3 typography-label-sm text-ws-static-base">{date}</p>
      ) : null}

      {title ? (
        <div className="p-ws-3 gap-ws-5 flex items-start">
          <p className="typography-body-md text-ws-static-base min-w-0 flex-1">{title}</p>
          {hasHeader ? null : <TaskMenu label={name} />}
        </div>
      ) : null}

      {badges || comments ? (
        <div className="p-ws-3 gap-ws-3 flex items-center">
          {badges?.map((badge) => (
            <TaskBadge key={badge.label} badge={badge} />
          ))}
          {comments ? (
            <StatusBadge size="sm" className="ml-auto">
              <StatusBadge.Icon icon={RiChat2Line} />
              <StatusBadge.Label>
                {comments}
                <span className="sr-only"> comments</span>
              </StatusBadge.Label>
            </StatusBadge>
          ) : null}
        </div>
      ) : null}

      {attachments || link ? (
        <div className="border-ws-static-subtle rounded-ws-control-md h-ws-15 px-ws-5 gap-ws-5 flex items-center border">
          <span className="size-ws-11 flex shrink-0 items-center justify-center">
            {attachments ? (
              <RiAttachment2 aria-hidden="true" className="size-ws-9 text-ws-static-subtle" />
            ) : (
              <RiLinkM aria-hidden="true" className="size-ws-9 text-ws-static-subtle" />
            )}
          </span>
          <span
            className={cn(
              'typography-label-sm truncate',
              attachments ? 'text-ws-static-subtle' : 'text-ws-static-base',
            )}
          >
            {attachments ? `${attachments} attachments` : link}
          </span>
        </div>
      ) : null}
    </article>
  );
}

/** A person's tasks stacked under their name, with the count of those left out. */
function TaskStack({ group }: { group: TaskGroup }) {
  return (
    <div className="bg-ws-static-alpha-subtle rounded-ws-container-md p-ws-3 gap-ws-4 flex flex-col">
      <div className="px-ws-5 py-ws-3 gap-ws-5 flex items-center">
        <Avatar
          size="sm"
          initials={group.assignee.initials}
          color={group.assignee.color}
          status={group.assignee.online ? 'online' : undefined}
        />
        <p className="typography-label-sm text-ws-static-strong min-w-0 flex-1 truncate">
          {group.assignee.name}
        </p>
        {group.age ? (
          <span className="typography-label-strong-sm text-ws-static-subtle">{group.age}</span>
        ) : null}
      </div>
      <div className="gap-ws-3 flex flex-col">
        {group.tasks.map((task) => (
          <TaskCard key={task.id} task={task} nested />
        ))}
      </div>
      {group.hidden ? (
        <p className="p-ws-3 typography-label-sm text-ws-static-strong">View +{group.hidden}</p>
      ) : null}
    </div>
  );
}

/** A status column: its label and count, the cards, and a button that adds a task. */
export function KanbanColumn({ column }: { column: Column }) {
  return (
    <section
      aria-label={column.title}
      className="bg-ws-static-alpha-subtle rounded-ws-container-md p-ws-5 gap-ws-4 flex w-[22.125rem] shrink-0 flex-col overflow-y-auto"
    >
      <div className="p-ws-3 flex items-center justify-between">
        <div className="gap-ws-4 flex items-center">
          <Tag color={column.color}>
            {column.icon ? <Tag.Icon icon={column.icon} /> : null}
            {column.title}
          </Tag>
          <Tag color={column.color}>{column.count}</Tag>
          <IconButton
            icon={RiMoreFill}
            size="xs"
            variant="secondary"
            preset="ghost"
            aria-label={`${column.title} actions`}
          />
        </div>
        <IconButton
          icon={RiAddLine}
          size="xs"
          variant="secondary"
          preset="ghost"
          aria-label={`Add a task to ${column.title}`}
        />
      </div>
      {column.items.map((item) =>
        isGroup(item) ? (
          <TaskStack key={item.id} group={item} />
        ) : (
          <TaskCard key={item.id} task={item} />
        ),
      )}
      <Button variant="secondary" preset="ghost" size="sm" className="shrink-0">
        <Button.Icon icon={RiAddLine} />
        New task
      </Button>
    </section>
  );
}
