import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiCalendarEventFill,
  RiCalendarEventLine,
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
  Lumen Studio's own customer event, as Maya Okafor sees it on Tuesday 10 November 2026: the
  Revenue Roundtable, an in-person afternoon at the studio in London on Thursday 3 December, for
  customers and prospects. Nina Alvarez and Elena Silva host it and have invited the sales team.
  Maya has not answered yet, so the answer is the page's one filled control. 39 people are going.
  London is on GMT in December, so the times below are UTC and London time at once.
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

/** Events is added after Customers: the events a team runs for its customers. */
export const mainLinks: NavLink[] = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'inbox', label: 'Inbox', icon: RiInbox2Line },
  { id: 'customers', label: 'Customers', icon: RiContactsBook3Line },
  { id: 'events', label: 'Events', icon: RiCalendarEventLine, activeIcon: RiCalendarEventFill },
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

export type Person = {
  id: string;
  name: string;
  initials: string;
  /** Where they work: a customer, a prospect, or Lumen Studio. */
  company: string;
  color?: AvatarColor;
};

const person = (id: string, name: string, company: string, color?: AvatarColor): Person => ({
  id,
  name,
  company,
  color,
  initials: name
    .split(' ')
    .map((part) => part[0])
    .join(''),
});

/** The signed-in user, pinned to the sidebar's colour. */
export const me = person('maya', account.name, workspace.name, 'orange');

export const event = {
  name: 'Revenue Roundtable, London',
  summary: 'An afternoon with customers and prospects on forecasting, renewals and pricing.',
  start: '2026-12-03T13:30:00Z',
  end: '2026-12-03T17:30:00Z',
  timeZone: 'Europe/London',
  format: 'In person',
  venue: {
    name: 'Lumen Studio',
    address: '21 Hoxton Square, London',
    postcode: 'N1 6NN',
    map: 'https://www.openstreetmap.org/search?query=Hoxton%20Square%2C%20London',
  },
  link: 'https://orbit.so/lumen-studio/events/revenue-roundtable-london',
  /** The hosts' deadline for answers, so the kitchen can plan. */
  answerBy: '2026-11-26',
  about: [
    'Twice a year we bring the people who run revenue at our customers into one room. This time it is about the quarter turning: how teams forecast when deals slip, how renewals stop being a surprise, and what a two-year price is worth.',
    'Short talks, then roundtables of eight. Nothing is recorded except the panel, and nothing leaves the room without a name being asked first.',
  ],
};

export type Session = {
  id: string;
  /** ISO start, UTC. */
  at: string;
  title: string;
  /** Who leads it, when someone does. */
  speakers?: string;
  room: string;
};

export const agenda: Session[] = [
  { id: 'arrival', at: '2026-12-03T13:30:00Z', title: 'Arrival and coffee', room: 'Foyer' },
  {
    id: 'welcome',
    at: '2026-12-03T14:00:00Z',
    title: 'Welcome: the year in numbers',
    speakers: 'Elena Silva',
    room: 'Main room',
  },
  {
    id: 'panel',
    at: '2026-12-03T14:20:00Z',
    title: 'Panel: forecasting when the quarter turns',
    speakers: 'Ingrid Solberg, Oskar Lindqvist and Beatrice Finch',
    room: 'Main room',
  },
  { id: 'break', at: '2026-12-03T15:10:00Z', title: 'Break', room: 'Foyer' },
  {
    id: 'roundtables',
    at: '2026-12-03T15:30:00Z',
    title: 'Roundtables: renewals, pricing or pipeline',
    speakers: 'Hosted by the Lumen Studio team',
    room: 'Library and Studio 2',
  },
  { id: 'drinks', at: '2026-12-03T16:30:00Z', title: 'Drinks', room: 'Terrace' },
];

export type Speaker = Person & { role: string; line: string };

export const speakers: Speaker[] = [
  {
    ...person('ingrid', 'Ingrid Solberg', 'Halcyon Freight', 'teal'),
    role: 'Head of Operations',
    line: 'Moved forecasting for 400 dispatch routes from a spreadsheet to a weekly review.',
  },
  {
    ...person('oskar', 'Oskar Lindqvist', 'Atlas Robotics', 'blue'),
    role: 'Chief Operating Officer',
    line: 'Plans sales for warehouse robots with an eighteen-month lead time.',
  },
  {
    ...person('beatrice', 'Beatrice Finch', 'Marlow & Finch', 'purple'),
    role: 'Managing Partner',
    line: 'Led the firm-wide rollout across three offices this year.',
  },
  {
    ...person('elena', 'Elena Silva', workspace.name, 'lime'),
    role: 'Revenue operations',
    line: 'Owns the forecast at Lumen Studio and the numbers in the welcome.',
  },
];

export type Host = Person & { role: string; email: string };

export const hosts: Host[] = [
  {
    ...person('nina', 'Nina Alvarez', workspace.name, 'pink'),
    role: 'Customer success',
    email: 'nina@lumenstudio.co',
  },
  { ...speakers[3], email: 'elena@lumenstudio.co' },
];

/** Who has said they are going, in the order they answered. */
export const going: Person[] = [
  speakers[0],
  speakers[1],
  speakers[2],
  person('samuel', 'Samuel Adeyemi', 'Northwind Health'),
  person('mirela', 'Mirela Costin', 'Kestrel Analytics'),
  person('colm', 'Colm Brennan', 'Juniper Legal'),
  person('farah', 'Farah Haddad', 'Cobalt Security'),
  person('lena', 'Lena Voss', 'Tidewater Energy'),
  hosts[0],
  speakers[3],
  person('hugo', 'Hugo Marlow', 'Marlow & Finch'),
  person('tariq', 'Tariq Mansour', 'Kestrel Analytics'),
  person('andre', 'Andre Baptiste', 'Tidewater Energy'),
  person('jonas', 'Jonas Weber', workspace.name),
  person('priya', 'Priya Raman', workspace.name),
  person('tom', 'Tom Becker', workspace.name),
  person('daniel', 'Daniel Reyes', workspace.name),
  person('amara', 'Amara Osei', 'Fernhill Logistics'),
  person('rhys', 'Rhys Morgan', 'Fernhill Logistics'),
  person('sofia', 'Sofia Lindgren', 'Pellucid Health'),
  person('kenji', 'Kenji Arata', 'Arden Systems'),
  person('claire', 'Claire Dubois', 'Arden Systems'),
  person('mateo', 'Mateo Fernández', 'Oakmoor Foods'),
  person('hannah', 'Hannah Kowalczyk', 'Oakmoor Foods'),
  person('yusuf', 'Yusuf Demir', 'Solent Marine'),
  person('grace', 'Grace Whitfield', 'Solent Marine'),
  person('ravi', 'Ravi Menon', 'Lattice Works'),
  person('isla', 'Isla McKenzie', 'Lattice Works'),
  person('tobias', 'Tobias Brandt', 'Quarry & Vale'),
  person('nadia', 'Nadia Petrova', 'Quarry & Vale'),
  person('owen', 'Owen Hughes', 'Northwind Health'),
  person('leila', 'Leila Navarro', 'Juniper Legal'),
  person('felix', 'Felix Wagner', 'Atlas Robotics'),
  person('chloe', 'Chloe Martin', 'Cobalt Security'),
  person('samir', 'Samir Khan', 'Halcyon Freight'),
  person('eva', 'Eva Novak', 'Pellucid Health'),
  person('marcus', 'Marcus Bell', 'Fernhill Logistics'),
  person('julia', 'Julia Romano', 'Kestrel Analytics'),
  person('leo', 'Leo Marchetti', workspace.name),
];

/** How to get there, what to bring, how the place works: the facts a guest checks on the day. */
export const practical = [
  {
    label: 'Getting there',
    value:
      'Old Street station (Northern line) is a five-minute walk, exit 2. There is no parking at the studio.',
  },
  { label: 'What to bring', value: 'Photo ID for the front desk. Laptops are not needed.' },
  {
    label: 'Accessibility',
    value:
      'Step-free from the street, with a lift to every floor and an accessible toilet on each. Tell the hosts if you need anything else.',
  },
];

export type Answer = 'going' | 'maybe' | 'not-going';

export const ANSWERS: { value: Answer; label: string }[] = [
  { value: 'going', label: 'Going' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'not-going', label: 'Can’t go' },
];

export const DIETS = [
  { value: 'none', label: 'No dietary needs' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten free' },
  { value: 'dairy-free', label: 'Dairy free' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
];
