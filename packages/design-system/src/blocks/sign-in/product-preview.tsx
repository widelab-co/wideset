import {
  type RemixiconComponentType,
  RiAddLine,
  RiArrowDownSLine,
  RiAttachment2,
  RiChat2Line,
  RiFlashlightFill,
  RiFolder3Fill,
  RiMoreFill,
} from '@remixicon/react';
import {
  Avatar,
  Breadcrumbs,
  Button,
  cn,
  Divider,
  FilterButton,
  IconButton,
  Select,
  Sidebar,
  StatusBadge,
  Tabs,
  Tag,
} from '@wideset/react';

import { AppIcon } from './app-icon';
import {
  account,
  type Badge,
  breadcrumbs,
  type Column,
  columns,
  navigation,
  type SpaceColor,
  spaceGroups,
  type Task,
  type TaskGroup,
  views,
} from './data';

/**
 * Figma's card beside the sign-in form: a Wideset screen (the Kanban board) at 54% over a glow on
 * near-black, its right side cut off by the card. The screen is drawn from the library, so it
 * follows the theme; the card keeps its colours in dark mode. A picture, so it is inert and
 * hidden from screen readers: replace it with a picture of your own product.
 */
export function ProductPreview({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      // Set as an attribute: React 18 drops a boolean `inert` prop, React 19 accepts both.
      ref={(node) => node?.setAttribute('inert', '')}
      className={cn(
        'rounded-ws-container-xl shadow-ws-low relative isolate overflow-hidden bg-(--ws-colors-light-neutral-1100)',
        className,
      )}
    >
      {/* Figma paints the glow with a blurred glass orb over a raster; here it is three gradients
          in the light palette's nearest tokens: the wash, the pink corner and the orb's edge. */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_12%,var(--ws-colors-light-purple-1000)_30%,var(--ws-colors-light-indigo-900)_50%,color-mix(in_srgb,var(--ws-colors-light-blue-500)_80%,transparent))]" />
      <div className="absolute inset-0 bg-[radial-gradient(at_100%_100%,var(--ws-colors-light-brand-200),transparent_60%)]" />
      <div className="rounded-ws-control-full absolute top-[-10.0625rem] left-[18.5rem] size-[59.625rem] bg-linear-to-b/srgb from-(--ws-colors-light-indigo-900) from-50% to-transparent to-75%" />
      {/* The screen at Figma's 1440 × 960, scaled into a 777 × 518 window 192px from the left. */}
      <div className="rounded-ws-container-lg shadow-ws-medium absolute top-1/2 left-[12rem] h-[32.375rem] w-[48.5625rem] -translate-y-1/2 overflow-hidden">
        <div className="h-[60rem] w-[90rem] origin-top-left scale-[0.5396]">
          <Board />
        </div>
      </div>
    </div>
  );
}

/** The Kanban screen in the Flat direction: sidebar, header and view tabs, filters, columns. */
function Board() {
  return (
    <div className="bg-ws-static-foreground flex h-full">
      <Sidebar>
        <Sidebar.Header>
          <Sidebar.Expanded>
            <div className="gap-ws-7 py-ws-3 pl-ws-5 flex items-center">
              <AppIcon className="size-ws-14" />
              <span className="typography-label-strong-sm text-ws-dynamic-secondary-default min-w-0 flex-1 truncate">
                Wideset
              </span>
              <Sidebar.Trigger />
            </div>
          </Sidebar.Expanded>
        </Sidebar.Header>
        <Sidebar.Section scrollable>
          <Sidebar.Expanded>
            <nav aria-label="Workspace" className="gap-ws-11 flex flex-col">
              <div className="flex flex-col">
                {navigation.map((item) => (
                  <Sidebar.Item
                    key={item.id}
                    href={`#${item.id}`}
                    icon={item.icon}
                    label={item.label}
                  />
                ))}
              </div>
              {spaceGroups.map((group) => (
                <div
                  key={group.id}
                  role="group"
                  aria-labelledby={`sidebar-${group.id}`}
                  className="gap-ws-2 flex flex-col"
                >
                  <Sidebar.SectionHeader id={`sidebar-${group.id}`}>
                    {group.label}
                  </Sidebar.SectionHeader>
                  {group.spaces.map((space) => (
                    <Sidebar.Item
                      key={space.id}
                      href={`#${space.id}`}
                      icon={SPACE_ICON[space.color]}
                      label={space.label}
                    />
                  ))}
                </div>
              ))}
            </nav>
          </Sidebar.Expanded>
        </Sidebar.Section>
        <Sidebar.Footer>
          <Sidebar.Expanded>
            <div className="gap-ws-5 px-ws-5 py-ws-3 flex items-center">
              <Avatar initials={account.initials} status="online" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="typography-label-strong-sm text-ws-static-base truncate">
                  {account.name}
                </span>
                <span className="typography-label-sm text-ws-static-subtle truncate">
                  {account.email}
                </span>
              </span>
              <RiArrowDownSLine aria-hidden="true" className="size-ws-9 text-ws-static-strong" />
            </div>
          </Sidebar.Expanded>
        </Sidebar.Footer>
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <Tabs defaultValue="Board" divider={false}>
          <header className="border-ws-static-subtle border-b">
            <div className="border-ws-static-subtle h-ws-18 px-ws-11 flex items-center border-b">
              <Breadcrumbs separator="arrow">
                {breadcrumbs.map((crumb, index) => (
                  <Breadcrumbs.Item key={crumb}>
                    {index === 0 ? (
                      <RiFolder3Fill aria-hidden="true" className="size-ws-9" />
                    ) : null}
                    {crumb}
                  </Breadcrumbs.Item>
                ))}
              </Breadcrumbs>
            </div>
            <div className="px-ws-11">
              <Tabs.List aria-label="Views">
                {views.map((view) => (
                  <Tabs.Item key={view} value={view}>
                    <Tabs.Label>{view}</Tabs.Label>
                  </Tabs.Item>
                ))}
              </Tabs.List>
            </div>
          </header>
        </Tabs>
        <div className="gap-ws-9 pt-ws-9 flex min-h-0 flex-1 flex-col">
          <div className="gap-ws-5 px-ws-11 flex items-center">
            <FilterButton
              label="Team"
              placeholder="Team"
              options={[{ value: 'wideset', label: 'Wideset' }]}
              defaultValue={['wideset']}
              onChange={() => {}}
            />
            <FilterButton
              label="Assigned to"
              placeholder="Assigned to"
              options={[{ value: 'andrew', label: 'Andrew Tang' }]}
              onChange={() => {}}
            />
            <Select
              size="sm"
              preset="ghost"
              aria-label="Sort tasks"
              options={[{ value: 'newest', label: 'Sort by newest' }]}
              defaultValue="newest"
              className="w-auto"
            />
          </div>
          <div className="gap-ws-9 px-ws-11 flex min-h-0 flex-1">
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const TILE: Record<SpaceColor, string> = {
  purple: 'bg-ws-non-semantic-purple-strong text-ws-non-semantic-purple-on-strong',
  indigo: 'bg-ws-non-semantic-indigo-strong text-ws-non-semantic-indigo-on-strong',
  blue: 'bg-ws-non-semantic-blue-strong text-ws-non-semantic-blue-on-strong',
  cyan: 'bg-ws-non-semantic-cyan-strong text-ws-non-semantic-cyan-on-strong',
  teal: 'bg-ws-non-semantic-teal-strong text-ws-non-semantic-teal-on-strong',
  green: 'bg-ws-non-semantic-green-strong text-ws-non-semantic-green-on-strong',
};

/** Figma's Sidebar Item `Type=Thumbnail`: a 20px colour tile with a white glyph, as the item icon. */
const spaceTile = (color: SpaceColor): RemixiconComponentType => {
  const SpaceTile = () => (
    <span
      className={cn(
        'rounded-ws-control-md size-ws-11 flex shrink-0 items-center justify-center',
        TILE[color],
      )}
    >
      <RiFlashlightFill className="size-ws-7" />
    </span>
  );
  return SpaceTile;
};

const SPACE_ICON: Record<SpaceColor, RemixiconComponentType> = {
  purple: spaceTile('purple'),
  indigo: spaceTile('indigo'),
  blue: spaceTile('blue'),
  cyan: spaceTile('cyan'),
  teal: spaceTile('teal'),
  green: spaceTile('green'),
};

const isGroup = (item: Task | TaskGroup): item is TaskGroup => 'tasks' in item;

function Menu() {
  return (
    <IconButton
      icon={RiMoreFill}
      size="xs"
      variant="secondary"
      preset="ghost"
      aria-label="Actions"
    />
  );
}

function TaskBadge({ badge }: { badge: Badge }) {
  if (badge.kind === 'tag')
    return (
      <Tag size="sm" color={badge.color}>
        {badge.label}
      </Tag>
    );
  return (
    <StatusBadge size="sm" color={badge.color}>
      {badge.icon ? <StatusBadge.Icon icon={badge.icon} /> : null}
      <StatusBadge.Label>{badge.label}</StatusBadge.Label>
    </StatusBadge>
  );
}

/** A task: raised on the column, or flat inside a person's stack, which already names them. */
function TaskCard({ task, nested = false }: { task: Task; nested?: boolean }) {
  return (
    <article
      className={cn(
        'p-ws-5 gap-ws-5 rounded-ws-container-sm flex flex-col',
        nested ? 'bg-ws-static-container' : 'bg-ws-static-overlay shadow-ws-forms-base',
      )}
    >
      {task.assignee !== undefined ? (
        <div className="p-ws-3 gap-ws-4 flex flex-col">
          <div className="gap-ws-5 flex items-center">
            {task.assignee ? (
              <Avatar
                size="sm"
                initials={task.assignee.initials}
                color={task.assignee.color}
                status={task.assignee.online ? 'online' : undefined}
              />
            ) : (
              <Avatar size="sm" shape="square" />
            )}
            <p className="typography-label-sm text-ws-static-strong min-w-0 flex-1 truncate">
              {task.assignee?.name ?? task.placeholder}
            </p>
            <Menu />
          </div>
          {task.date ? (
            <p className="typography-label-sm text-ws-static-base">{task.date}</p>
          ) : null}
          {task.details ? (
            <div className="mt-ws-4 gap-ws-7 flex flex-col">
              <Divider weight="thin" emphasis="subtle" className="-mx-ws-7 w-auto" />
              <ul className="gap-ws-3 flex flex-col">
                {task.details.map(({ icon: Icon, label }) => (
                  <li key={label} className="gap-ws-5 flex items-center">
                    <span className="size-ws-12 flex shrink-0 items-center justify-center">
                      <Icon className="size-ws-9 text-ws-dynamic-secondary-default" />
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
      {task.title ? (
        <div className="p-ws-3 gap-ws-5 flex items-start">
          <p className="typography-body-md text-ws-static-base min-w-0 flex-1">{task.title}</p>
          {task.assignee === undefined ? <Menu /> : null}
        </div>
      ) : null}
      {task.badges || task.comments ? (
        <div className="p-ws-3 gap-ws-3 flex items-center">
          {task.badges?.map((badge) => (
            <TaskBadge key={badge.label} badge={badge} />
          ))}
          {task.comments ? (
            <StatusBadge size="sm" className="ml-auto">
              <StatusBadge.Icon icon={RiChat2Line} />
              <StatusBadge.Label>{task.comments}</StatusBadge.Label>
            </StatusBadge>
          ) : null}
        </div>
      ) : null}
      {task.attachments ? (
        <div className="border-ws-static-subtle rounded-ws-control-md h-ws-15 px-ws-5 gap-ws-5 flex items-center border">
          <span className="size-ws-11 flex shrink-0 items-center justify-center">
            <RiAttachment2 className="size-ws-9 text-ws-static-subtle" />
          </span>
          <span className="typography-label-sm text-ws-static-subtle truncate">
            {task.attachments} attachments
          </span>
        </div>
      ) : null}
    </article>
  );
}

/** A status column: its label and count, the cards, and a button that adds a task. */
function KanbanColumn({ column }: { column: Column }) {
  return (
    <section className="bg-ws-static-alpha-subtle rounded-ws-container-md p-ws-5 gap-ws-4 flex w-[22.125rem] shrink-0 flex-col">
      <div className="p-ws-3 flex items-center justify-between">
        <div className="gap-ws-4 flex items-center">
          <Tag color={column.color}>
            <Tag.Icon icon={column.icon} />
            {column.title}
          </Tag>
          <Tag color={column.color}>{column.count}</Tag>
          <Menu />
        </div>
        <IconButton
          icon={RiAddLine}
          size="xs"
          variant="secondary"
          preset="ghost"
          aria-label="Add"
        />
      </div>
      {column.items.map((item) =>
        isGroup(item) ? (
          <div
            key={item.id}
            className="bg-ws-static-alpha-subtle rounded-ws-container-md p-ws-3 gap-ws-4 flex flex-col"
          >
            <div className="px-ws-5 py-ws-3 gap-ws-5 flex items-center">
              <Avatar
                size="sm"
                initials={item.assignee.initials}
                color={item.assignee.color}
                status={item.assignee.online ? 'online' : undefined}
              />
              <p className="typography-label-sm text-ws-static-strong min-w-0 flex-1 truncate">
                {item.assignee.name}
              </p>
              <span className="typography-label-strong-sm text-ws-static-subtle">{item.age}</span>
            </div>
            <div className="gap-ws-3 flex flex-col">
              {item.tasks.map((task) => (
                <TaskCard key={task.id} task={task} nested />
              ))}
            </div>
            <p className="p-ws-3 typography-label-sm text-ws-static-strong">View +{item.hidden}</p>
          </div>
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
