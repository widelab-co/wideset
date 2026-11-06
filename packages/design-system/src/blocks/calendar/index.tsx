import {
  RiAddLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarScheduleLine,
  RiCloseLargeFill,
  RiComputerLine,
  RiFilter3Line,
  RiMoreFill,
  RiSearchLine,
  RiSortDesc,
} from '@remixicon/react';
import { Avatar, Button, IconButton, Tabs } from '@wideset/react';
import { useState } from 'react';

import { announcement, events, members, openMonth, page, selectedDay, today, views } from './data';
import { MonthGrid, monthWeeks } from './month-grid';
import { CalendarSidebar } from './sidebar';

const monthTitle = new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const ghost = { variant: 'secondary', preset: 'ghost', size: 'sm' } as const;

const TOOLS = [
  { label: '1 filter', icon: RiFilter3Line },
  { label: 'Sort', icon: RiSortDesc },
  { label: 'Week', icon: RiCalendarScheduleLine },
  { label: 'Search', icon: RiSearchLine },
];

/** Figma's "There are 3 new features" card: it stays until dismissed. */
function AnnouncementCard({ onDismiss }: { onDismiss: () => void }) {
  return (
    <section
      aria-labelledby="calendar-announcement-title"
      className="bg-ws-static-overlay rounded-ws-container-lg shadow-ws-high p-ws-12 gap-ws-12 right-ws-11 bottom-ws-11 absolute flex w-[20.625rem] flex-col"
    >
      {/* Stand-in for Figma's "Computer" illustration: Wideset ships no illustrations. */}
      <div className="flex h-[8.75rem] items-center justify-center">
        <RiComputerLine aria-hidden="true" className="size-ws-24 text-ws-static-base" />
      </div>
      <IconButton
        {...ghost}
        icon={RiCloseLargeFill}
        aria-label="Dismiss"
        onClick={onDismiss}
        className="top-ws-9 right-ws-9 absolute"
      />
      <div className="gap-ws-12 flex flex-col items-start">
        <div className="gap-ws-5 flex flex-col">
          <h2
            id="calendar-announcement-title"
            className="typography-subtitle-sm text-ws-static-base"
          >
            {announcement.title}
          </h2>
          <p className="typography-body-md text-ws-static-subtle">{announcement.description}</p>
        </div>
        <Button variant="secondary" preset="border" size="sm" onClick={onDismiss}>
          {announcement.action}
        </Button>
      </div>
    </section>
  );
}

/** Calendar (Inset direction): the month on a raised page beside the workspace sidebar. */
export default function Calendar() {
  const [month, setMonth] = useState(openMonth.year * 12 + openMonth.month);
  const [selected, setSelected] = useState(selectedDay);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const year = Math.floor(month / 12);

  return (
    <div className="bg-ws-static-background flex h-dvh">
      <CalendarSidebar />
      <main className="bg-ws-static-foreground rounded-ws-container-lg shadow-ws-low my-ws-7 mr-ws-7 ml-ws-5 relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Tabs type="ghost" defaultValue="calendar" className="min-h-0 flex-1">
          <header className="gap-ws-7 px-ws-11 h-ws-20 border-ws-static-base flex shrink-0 items-center border-b">
            <div className="gap-ws-9 flex min-w-0 items-center">
              <h1 className="typography-subtitle-xs text-ws-dynamic-secondary-default truncate">
                {page.title}
              </h1>
              <span aria-hidden="true" className="border-ws-static-base h-ws-11 border-l" />
              <div className="gap-ws-2 flex items-center">
                <Tabs.List aria-label="Views">
                  {views.map(({ id, label, icon }) => (
                    <Tabs.Item key={id} value={id}>
                      <Tabs.Icon icon={icon} />
                      <Tabs.Label>{label}</Tabs.Label>
                    </Tabs.Item>
                  ))}
                </Tabs.List>
                <Button {...ghost}>
                  <Button.Icon icon={RiAddLine} />
                  View
                </Button>
              </div>
            </div>
            <div className="gap-ws-9 ml-auto flex items-center">
              <Avatar.Group size="sm" className="w-fit">
                {members.map(({ name, initials, color }) =>
                  initials ? (
                    <Avatar key={name} initials={initials} color={color} aria-label={name} />
                  ) : (
                    <Avatar key={name} aria-label={name} />
                  ),
                )}
              </Avatar.Group>
              <Button variant="secondary" preset="border" size="sm">
                Share
              </Button>
            </div>
          </header>

          <Tabs.Content value="calendar" className="flex min-h-0 flex-1 flex-col">
            <div className="px-ws-11 h-ws-18 border-ws-static-base flex shrink-0 items-center justify-between border-b">
              <div className="gap-ws-5 flex items-center">
                <div className="gap-ws-3 flex">
                  <IconButton
                    {...ghost}
                    size="xs"
                    icon={RiArrowLeftSLine}
                    aria-label="Previous month"
                    onClick={() => setMonth(month - 1)}
                  />
                  <IconButton
                    {...ghost}
                    size="xs"
                    icon={RiArrowRightSLine}
                    aria-label="Next month"
                    onClick={() => setMonth(month + 1)}
                  />
                </div>
                <h2 className="typography-subtitle-xs text-ws-dynamic-secondary-default">
                  {monthTitle.format(Date.UTC(year, month % 12, 1))}
                </h2>
              </div>
              <div className="gap-ws-2 flex items-center">
                {TOOLS.map(({ label, icon }) => (
                  <Button key={label} {...ghost}>
                    <Button.Icon icon={icon} />
                    {label}
                  </Button>
                ))}
                <IconButton {...ghost} icon={RiMoreFill} aria-label="More options" />
              </div>
            </div>
            <MonthGrid
              weeks={monthWeeks(year, month % 12)}
              events={events}
              today={today}
              selected={selected}
              onSelect={setSelected}
            />
          </Tabs.Content>
          {views
            .filter(({ id }) => id !== 'calendar')
            .map(({ id, label }) => (
              <Tabs.Content
                key={id}
                value={id}
                className="typography-body-md text-ws-static-subtle flex flex-1 items-center justify-center"
              >
                The {label.toLowerCase()} view of {page.title} goes here.
              </Tabs.Content>
            ))}
        </Tabs>
        {showAnnouncement && <AnnouncementCard onDismiss={() => setShowAnnouncement(false)} />}
      </main>
    </div>
  );
}
