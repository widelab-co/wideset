import {
  RiArrowDownSLine,
  RiCalendarLine,
  RiDownloadLine,
  RiExternalLinkLine,
} from '@remixicon/react';
import { Button, DropdownMenu, ListItem } from '@wideset/react';

export type CalendarEntry = {
  title: string;
  /** ISO instants, UTC. */
  start: string;
  end: string;
  location: string;
  details: string;
};

/** 2026-12-03T13:30:00Z → 20261203T133000Z, the form calendar links and .ics files take. */
const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');

const googleUrl = (entry: CalendarEntry) =>
  `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: 'TEMPLATE',
    text: entry.title,
    dates: `${stamp(entry.start)}/${stamp(entry.end)}`,
    location: entry.location,
    details: entry.details,
  })}`;

const outlookUrl = (entry: CalendarEntry) =>
  `https://outlook.live.com/calendar/0/action/compose?${new URLSearchParams({
    subject: entry.title,
    startdt: entry.start,
    enddt: entry.end,
    location: entry.location,
    body: entry.details,
  })}`;

/** A one-event .ics file, saved through a temporary link. */
function downloadIcs(entry: CalendarEntry) {
  const text = (value: string) => value.replace(/[\\;,]/g, (match) => `\\${match}`);
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Orbit//Events//EN',
    'BEGIN:VEVENT',
    `UID:${stamp(entry.start)}-${entry.title.length}@orbit.so`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(entry.start)}`,
    `DTEND:${stamp(entry.end)}`,
    `SUMMARY:${text(entry.title)}`,
    `LOCATION:${text(entry.location)}`,
    `DESCRIPTION:${text(entry.details)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  const link = Object.assign(document.createElement('a'), {
    href: url,
    download: `${entry.title.replace(/[^\w]+/g, '-').toLowerCase()}.ics`,
  });
  link.click();
  URL.revokeObjectURL(url);
}

const open = (url: string) => window.open(url, '_blank', 'noopener');

/**
 * Add to calendar: a menu of the three ways people keep a calendar. Google and Outlook open their
 * own new-event page filled in; the .ics file covers everything else (Apple Calendar included).
 * The icon after each item says what happens: it opens elsewhere, or it downloads.
 */
export function AddToCalendarMenu({ entry }: { entry: CalendarEntry }) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary" preset="border" size="sm">
          <Button.Icon icon={RiCalendarLine} />
          Add to calendar
          <Button.Icon icon={RiArrowDownSLine} />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[14rem]">
        <DropdownMenu.Item onSelect={() => open(googleUrl(entry))}>
          <ListItem.Content>
            <ListItem.Label>Google Calendar</ListItem.Label>
          </ListItem.Content>
          <ListItem.Suffix>
            <RiExternalLinkLine className="size-ws-9" />
          </ListItem.Suffix>
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={() => open(outlookUrl(entry))}>
          <ListItem.Content>
            <ListItem.Label>Outlook</ListItem.Label>
          </ListItem.Content>
          <ListItem.Suffix>
            <RiExternalLinkLine className="size-ws-9" />
          </ListItem.Suffix>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={() => downloadIcs(entry)}>
          <ListItem.Content>
            <ListItem.Label>Apple and others (.ics)</ListItem.Label>
          </ListItem.Content>
          <ListItem.Suffix>
            <RiDownloadLine className="size-ws-9" />
          </ListItem.Suffix>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
