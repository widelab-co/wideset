import {
  type RemixiconComponentType,
  RiBardLine,
  RiCalendarEventLine,
  RiCalendarLine,
  RiDashboardLine,
  RiFile3Fill,
  RiFile3Line,
  RiInbox2Line,
  RiListUnordered,
  RiNotification3Line,
  RiSettingsLine,
  RiSupabaseLine,
  RiTableView,
  RiTimelineView,
} from '@remixicon/react';
import type { AvatarColor } from '@wideset/react';

export const workspace = { name: 'Wideset', plan: 'Team Plan', initials: 'W' };

/** The page open in the calendar. */
export const page = { title: 'Product Design' };

/** The card over the calendar's corner until it is dismissed. */
export const announcement = {
  title: 'There are 3 new features!',
  description:
    'You can review and try them for free right now. This will be available for 2 weeks.',
  action: 'Take me there',
};

export const account = { name: 'Adam Smith', email: 'hello@wideset.co', initials: 'AS' };

export type NavLink = {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  /** The icon while the page is open (Figma swaps a line icon for its fill). */
  activeIcon?: RemixiconComponentType;
  /** The digit after ⌘ in the keyboard shortcut. */
  shortcut?: string;
};

export const inboxLinks: NavLink[] = [
  { id: 'inbox', label: 'Inbox', icon: RiInbox2Line, shortcut: '1' },
  { id: 'activity', label: 'Activity', icon: RiNotification3Line, shortcut: '2' },
  { id: 'schedule', label: 'Schedule', icon: RiCalendarLine, shortcut: '3' },
];

export const sharedLinks: NavLink[] = [
  { id: 'boosts', label: 'Boosts', icon: RiSupabaseLine },
  { id: 'documents', label: 'Documents', icon: RiFile3Line, activeIcon: RiFile3Fill },
];

export const footerLinks: NavLink[] = [
  { id: 'settings', label: 'Settings', icon: RiSettingsLine },
  { id: 'help', label: 'Help', icon: RiBardLine },
];

export type ProjectColor = 'blue' | 'purple' | 'teal';

export const projects: { id: string; label: string; color: ProjectColor }[] = [
  { id: 'design', label: 'Design', color: 'blue' },
  { id: 'handoff', label: 'Development Handoff', color: 'purple' },
  { id: 'feedback', label: 'Feedback & Iteration', color: 'teal' },
];

export const views = [
  { id: 'list', label: 'List', icon: RiListUnordered },
  { id: 'calendar', label: 'Calendar', icon: RiCalendarEventLine },
  { id: 'board', label: 'Board', icon: RiDashboardLine },
  { id: 'timeline', label: 'Timeline', icon: RiTimelineView },
  { id: 'table', label: 'Table', icon: RiTableView },
];

/** Who the page is shared with; a person without initials shows the default user icon. */
export const members: { name: string; initials?: string; color?: AvatarColor }[] = [
  { name: 'Robert Redford', initials: 'RR', color: 'orange' },
  { name: 'Diana Ross', initials: 'DR', color: 'yellow' },
  { name: 'Guest' },
];

/** The calendar opens on this month (0-based) and marks this day as today. */
export const today = '2024-05-01';
export const openMonth = { year: 2024, month: 4 };
/** The day selected when the page opens. */
export const selectedDay = '2024-04-30';

export type EventColor = 'purple' | 'cyan' | 'teal' | 'green';

export type CalendarEvent = {
  id: string;
  title: string;
  /** ISO date of the first day. */
  start: string;
  /** ISO date of the last day, for an event that runs over several days. */
  end?: string;
  time?: string;
  /** A meeting's colour, or `busy` for time blocked off (drawn hatched). */
  color: EventColor | 'busy';
};

export const events: CalendarEvent[] = [
  { id: 'q1', title: 'Q1 UKR', start: '2024-04-29', color: 'purple' },
  { id: 'standup', title: 'Standup', start: '2024-05-02', color: 'busy' },
  {
    id: 'critique-7',
    title: 'Design Critique',
    start: '2024-05-07',
    time: '10am - 11am',
    color: 'cyan',
  },
  { id: 'time-off', title: 'Time off', start: '2024-05-08', color: 'busy' },
  { id: 'jam-9', title: 'Design Jam', start: '2024-05-09', time: '8pm - 9pm', color: 'teal' },
  { id: 'sync-9', title: 'Maciej & Michał', start: '2024-05-09', color: 'green' },
  { id: 'jam-14', title: 'Design Jam', start: '2024-05-14', end: '2024-05-16', color: 'teal' },
  {
    id: 'critique-20',
    title: 'Design Critique',
    start: '2024-05-20',
    time: '10am - 11am',
    color: 'cyan',
  },
  { id: 'sync-23', title: 'Maciej & Michał', start: '2024-05-23', color: 'green' },
  {
    id: 'sprint',
    title: 'Sprint Planning',
    start: '2024-05-28',
    time: '8pm - 9pm',
    color: 'purple',
  },
];
