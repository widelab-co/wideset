import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiHandCoinFill,
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
  This morning's discovery call with Atlas Robotics, recorded in Orbit: Maya Okafor (Lumen
  Studio) and Oskar Lindqvist, who runs operations at Atlas. Atlas builds warehouse robots and
  runs service from two sites; they want one place for service requests, parts orders and shift
  handovers. The call sits on the deal "Two-site rollout". Three teammates have commented since.
*/

/** The product is Orbit; the workspace using it is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

/** "Now" for the relative times on the page: the afternoon after the call. */
export const NOW = new Date('2026-11-10T15:00');

export type NavLink = {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  /** The icon while the page is open (a line icon swaps for its fill). */
  activeIcon?: RemixiconComponentType;
};

export const mainLinks: NavLink[] = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'inbox', label: 'Inbox', icon: RiInbox2Line },
  { id: 'customers', label: 'Customers', icon: RiContactsBook3Line },
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine, activeIcon: RiHandCoinFill },
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

export type Person = { id: string; name: string; initials: string; color: AvatarColor };

const person = (id: string, name: string, color: AvatarColor): Person => ({
  id,
  name,
  initials: name
    .split(' ')
    .map((part) => part[0])
    .join(''),
  color,
});

export const maya = person('maya', 'Maya Okafor', 'orange');
export const oskar = person('oskar', 'Oskar Lindqvist', 'blue');
const jonas = person('jonas', 'Jonas Weber', 'teal');
const priya = person('priya', 'Priya Raman', 'purple');
const tom = person('tom', 'Tom Becker', 'green');

/** The two people on the call, in the order the timeline lists them. */
export const speakers = [maya, oskar];

export const call = {
  title: 'Discovery call with Atlas Robotics',
  customer: 'Atlas Robotics',
  startedAt: '2026-11-10T11:30',
  /** Seconds. */
  duration: 1584,
  deal: { id: 'atlas-two-site-rollout', name: 'Two-site rollout' },
};

/** One turn of the call: who spoke, from `at` seconds, what they said. */
export type Line = { at: number; speaker: Person; text: string };

const line = (at: number, speaker: Person, text: string): Line => ({ at, speaker, text });

export const transcript: Line[] = [
  line(0, maya, 'Hi Oskar, thanks for making the time. Can you hear me all right?'),
  line(
    6,
    oskar,
    'Loud and clear. Thanks for sending the agenda yesterday, I added a couple of points.',
  ),
  line(
    14,
    maya,
    'Great. Let’s start with how your team works today, and keep the last ten minutes for next steps.',
  ),
  line(
    25,
    oskar,
    'Sure. We build warehouse robots and run service and parts from two sites, Denver and Austin. About 120 people between them.',
  ),
  line(62, maya, 'And what do they work in today?'),
  line(
    68,
    oskar,
    'Mostly spreadsheets, and an old ticketing tool that only Denver uses. Austin never moved over, so we have two ways of doing everything.',
  ),
  line(130, maya, 'What does that cost you, day to day?'),
  line(
    138,
    oskar,
    'Handovers, mainly. A technician in Austin can’t see what Denver promised a customer, so they call around. We lose hours every week.',
  ),
  line(220, maya, 'You mentioned three workflows in your note. Which would you replace first?'),
  line(
    232,
    oskar,
    'Service requests first, then parts orders, then shift handovers. Service requests are where our customers feel it.',
  ),
  line(330, maya, 'Who owns service requests today?'),
  line(
    336,
    oskar,
    'Each site’s lead. Lena in Denver, Marco in Austin. They would both need to sign off.',
  ),
  line(
    400,
    maya,
    'That is very close to how Halcyon Freight worked before they moved to us. Same two-site split.',
  ),
  line(425, oskar, 'Interesting. How long did their move take?'),
  line(
    432,
    maya,
    'About six weeks a site, one workflow at a time. I can send you their story after the call.',
  ),
  line(510, oskar, 'Please do. Our worry is putting both sites through a change at once.'),
  line(
    585,
    maya,
    'We wouldn’t. We would start with service requests in Denver, then bring Austin over once it works.',
  ),
  line(680, oskar, 'That works for us. Do you support single sign-on? Our security team will ask.'),
  line(691, maya, 'Yes, on the Business plan, with audit logs. I will include our security pack.'),
  line(785, maya, 'How do you decide on a purchase like this?'),
  line(
    820,
    oskar,
    'I recommend, our COO signs. Anything over fifty thousand a year goes to the board in January.',
  ),
  line(930, oskar, 'Which brings me to pricing. What would 120 seats look like?'),
  line(
    942,
    maya,
    'Business is 65 dollars a seat a month, so 7,800 a month for 120 seats. I will put it in writing with the annual price.',
  ),
  line(1030, oskar, 'And if we start with Denver only?'),
  line(
    1038,
    maya,
    'Then you pay for Denver’s seats, and Austin joins at the same price when it is ready.',
  ),
  line(1165, oskar, 'That makes the first step much easier to approve.'),
  line(1240, maya, 'What would make this a success for you in six months?'),
  line(
    1250,
    oskar,
    'One place for every service request, and handovers nobody has to chase. If Austin stops calling Denver, I am happy.',
  ),
  line(
    1390,
    maya,
    'Then let’s agree next steps. Today I will send the Halcyon story, the security pack and pricing for Business.',
  ),
  line(1420, oskar, 'And a demo for Lena and Marco?'),
  line(1426, maya, 'Yes. Does the 19th work, at ten your time?'),
  line(1445, oskar, 'The 19th works. I will send the invite to both of them.'),
  line(1460, maya, 'Anything you would like me to prepare for it?'),
  line(1470, oskar, 'Show us a handover between two sites. That is the moment that hurts.'),
  line(1570, maya, 'Will do. Thanks, Oskar, speak on the 19th.'),
  line(1576, oskar, 'Thanks, Maya. Bye.'),
];

/** A moment Orbit marked in the call, from `at` seconds. */
export type Moment = { at: number; label: string };

export const highlights: Moment[] = [
  { at: 68, label: 'Current tooling' },
  { at: 232, label: 'Workflows to replace first' },
  { at: 930, label: 'Pricing question' },
  { at: 1390, label: 'Next steps' },
];

/** A comment left at a moment of the call: text, or a voice note `duration` seconds long. */
export type Comment = {
  id: string;
  author: Person;
  /** The moment it refers to, in seconds. */
  at: number;
  /** When it was left, ISO. */
  postedAt: string;
} & ({ text: string } | { voiceNote: number });

export const comments: Comment[] = [
  {
    id: 'jonas-halcyon',
    author: jonas,
    at: 400,
    postedAt: '2026-11-10T13:05',
    text: 'Halcyon is the right story here. I can join the demo and walk through their rollout.',
  },
  {
    id: 'priya-sso',
    author: priya,
    at: 680,
    postedAt: '2026-11-10T13:40',
    text: 'I will ask security to have the pack ready before the 19th.',
  },
  {
    id: 'tom-trial',
    author: tom,
    at: 1038,
    postedAt: '2026-11-10T14:10',
    text: 'Denver first fits their trial. I will extend it to the end of the month.',
  },
];
