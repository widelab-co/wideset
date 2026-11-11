import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Fill,
  RiContactsBook3Line,
  RiHandCoinLine,
  RiHome5Line,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartLine,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionLine,
  RiSettings3Line,
  RiTeamLine,
} from '@remixicon/react';
import type { AvatarColor } from '@wideset/react';

/*
  Maya Okafor books the Halcyon Freight renewal review with Ingrid Solberg from the customer's
  record, on Tuesday 10 November 2026. Ingrid works in Oslo and has shared her free time with
  Lumen Studio; Maya is in London, an hour behind. Nothing is free on Wednesday, and her finance
  committee takes Thursday, so the first day with time is Friday 13 November; she shares four
  weeks ahead. Her free time is written in Oslo time (GMT+1 all through November and December);
  every slot is an instant, so the time-zone select only changes how it reads.
*/

/** The product is Orbit; the workspace using it is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

export type NavLink = {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  /** The icon while the page is open (a line icon swaps for its fill). */
  activeIcon?: RemixiconComponentType;
};

/** Booking is something done to a customer, so the page sits under Customers. */
export const mainLinks: NavLink[] = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'inbox', label: 'Inbox', icon: RiInbox2Line },
  {
    id: 'customers',
    label: 'Customers',
    icon: RiContactsBook3Line,
    activeIcon: RiContactsBook3Fill,
  },
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
  { id: 'revenue', label: 'Revenue', icon: RiLineChartLine },
  { id: 'reports', label: 'Reports', icon: RiPieChart2Line },
];

export const settingsLinks: NavLink[] = [
  { id: 'general', label: 'General', icon: RiSettings3Line },
  { id: 'members', label: 'Members', icon: RiTeamLine },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

/** The sample's "now": Tuesday 10 November 2026, mid-morning in London. */
export const NOW = '2026-11-10T10:00:00Z';

export const customer = { name: 'Halcyon Freight', city: 'Oslo' };

export const contact = {
  name: 'Ingrid Solberg',
  initials: 'IS',
  role: 'Head of Operations',
  email: 'ingrid.solberg@halcyonfreight.com',
  timeZone: 'Europe/Oslo',
};

export type Attendee = {
  name: string;
  initials: string;
  color: AvatarColor;
  /** Where they work, under the name. */
  detail: string;
  /** The signed-in user, marked "You". */
  you?: boolean;
};

/** Who is on the meeting before anyone else is invited. */
export const attendees: Attendee[] = [
  {
    name: contact.name,
    initials: contact.initials,
    color: 'teal',
    detail: customer.name,
  },
  {
    name: account.name,
    initials: account.initials,
    color: 'orange',
    detail: workspace.name,
    you: true,
  },
];

export type MeetingType = { id: string; name: string; minutes: number };

export const meetingTypes: MeetingType[] = [
  { id: 'intro', name: 'Intro call', minutes: 30 },
  { id: 'renewal', name: 'Renewal review', minutes: 45 },
  { id: 'workshop', name: 'Workshop', minutes: 60 },
];

export const places = [
  { value: 'video', label: 'Video call', detail: 'Orbit adds the link to the invitation.' },
  {
    value: 'office',
    label: 'Halcyon Freight office',
    detail: 'Bjørvika, Oslo. Ingrid meets you at reception.',
  },
];

/** The zones the slots can be read in; the viewer's own comes first. */
export const timeZones = [
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Oslo', label: 'Oslo (GMT+1)' },
  { value: 'America/New_York', label: 'New York (GMT−5)' },
];

/** Oslo is GMT+1 for the whole window shared below. */
const OSLO = '+01:00';

/**
 * Ingrid's free time by day, in Oslo time. A day missing from the list has none: weekends, her
 * finance committee on the 12th, two days at the depot in Trondheim on the 25th and 26th.
 */
const freeTime: Record<string, [string, string][]> = {
  '2026-11-13': [
    ['09:00', '11:00'],
    ['13:30', '15:30'],
  ],
  '2026-11-16': [
    ['09:00', '10:00'],
    ['14:00', '16:00'],
  ],
  '2026-11-17': [
    ['09:30', '10:00'],
    ['15:00', '15:30'],
  ],
  '2026-11-18': [['13:00', '14:30']],
  '2026-11-19': [
    ['09:00', '10:30'],
    ['13:00', '15:00'],
  ],
  '2026-11-20': [['09:00', '11:00']],
  '2026-11-23': [['10:00', '10:45']],
  '2026-11-24': [
    ['09:00', '10:00'],
    ['13:30', '15:30'],
  ],
  '2026-11-27': [['09:00', '12:00']],
  '2026-11-30': [['14:00', '16:00']],
  '2026-12-01': [['09:30', '11:00']],
  '2026-12-02': [['13:00', '15:00']],
  '2026-12-03': [['09:00', '10:00']],
  '2026-12-04': [['10:00', '12:00']],
  '2026-12-07': [['09:00', '11:00']],
  '2026-12-08': [['14:00', '15:30']],
};

/** Slots start on the hour and the half hour. */
const STEP = 30;

/** Every start time on a day that leaves room for a meeting of that length, as UTC instants. */
export function slotsFor(day: string, minutes: number): string[] {
  return (freeTime[day] ?? []).flatMap(([from, to]) => {
    const start = Date.parse(`${day}T${from}:00${OSLO}`);
    const end = Date.parse(`${day}T${to}:00${OSLO}`);
    const slots: string[] = [];
    for (let at = start; at + minutes * 60_000 <= end; at += STEP * 60_000) {
      slots.push(new Date(at).toISOString());
    }
    return slots;
  });
}

/** The days Ingrid shared, in order: the calendar opens only those with room for the meeting. */
export const sharedDays = Object.keys(freeTime);

/** The first day after `day` with room for the meeting, if there is one in the window. */
export const nextDayWithTime = (day: string, minutes: number) =>
  sharedDays.find((other) => other > day && slotsFor(other, minutes).length > 0);

/** People Maya can bring along: her team, and Ingrid's colleagues Orbit knows. */
export const guests = [
  { value: 'jonas', label: 'Jonas Weber, Lumen Studio' },
  { value: 'nina', label: 'Nina Alvarez, Lumen Studio' },
  { value: 'tom', label: 'Tom Becker, Lumen Studio' },
  { value: 'samir', label: 'Samir Khan, Halcyon Freight' },
  { value: 'kari', label: 'Kari Nyland, Halcyon Freight' },
];

/** Orbit fills the agenda in from the meeting type and the open renewal. */
export const agendaTemplate = [
  'Usage this year, team by team',
  'The two-year price',
  'The 12 dispatcher seats from January 1',
].join('\n');
