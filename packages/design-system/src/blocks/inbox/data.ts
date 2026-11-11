import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiHandCoinLine,
  RiHome5Line,
  RiInbox2Fill,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartLine,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionLine,
  RiSettings3Line,
  RiTeamLine,
} from '@remixicon/react';

/*
  Maya's mail with customers on Tuesday morning, 10 November 2026. Orbit files every conversation
  under the customer and the deal it is about. The open one is the quote Halcyon Freight is
  waiting for: the same quote that is on Maya's task list for 10:00 and that the team is talking
  about in the halcyon-renewal channel.
*/

/** The product is Orbit; the workspace is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };

export type Person = {
  name: string;
  email: string;
  initials: string;
  /** The avatar's colour, pinned where two people in one thread would otherwise share a hue. */
  color?: 'orange' | 'teal';
};

export const account: Person = {
  name: 'Maya Okafor',
  email: 'maya@lumenstudio.co',
  initials: 'MO',
  color: 'orange',
};

/** The sample is frozen at this moment (local time). */
export const NOW = '2026-11-10T09:12';

export type NavLink = {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  /** The icon while the page is open (a line icon swaps for its fill). */
  activeIcon?: RemixiconComponentType;
};

export const mainLinks: NavLink[] = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'inbox', label: 'Inbox', icon: RiInbox2Line, activeIcon: RiInbox2Fill },
  { id: 'customers', label: 'Customers', icon: RiContactsBook3Line },
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

/** A file sent with a message. */
export type Attachment = { name: string; size: string };

export type Message = {
  id: string;
  from: Person;
  /** Local date and time. */
  at: string;
  /** The text, one paragraph per entry. */
  body: string[];
  attachments?: Attachment[];
};

export type Conversation = {
  id: string;
  subject: string;
  /** The person at the customer the conversation is with. */
  contact: Person;
  customer: string;
  /** The deal in Orbit the conversation is filed under. */
  deal: string;
  /** Oldest first. */
  messages: Message[];
  unread: boolean;
  starred: boolean;
};

const person = (name: string, email: string): Person => ({
  name,
  email,
  initials: name
    .split(' ')
    .map((part) => part[0])
    .join(''),
});

const ingrid: Person = {
  ...person('Ingrid Solberg', 'ingrid.solberg@halcyonfreight.com'),
  color: 'teal',
};
const samuel = person('Samuel Adeyemi', 'samuel@northwindhealth.org');
const mirela = person('Mirela Costin', 'mirela@kestrelanalytics.io');
const colm = person('Colm Brennan', 'colm.brennan@juniperlegal.com');
const beatrice = person('Beatrice Finch', 'beatrice@marlowfinch.co');
const oskar = person('Oskar Lindqvist', 'oskar@atlasrobotics.com');
const farah = person('Farah Haddad', 'farah.haddad@cobaltsecurity.io');
const andre = person('Andre Baptiste', 'andre@tidewaterenergy.com');
const tariq = person('Tariq Mansour', 'tariq@kestrelanalytics.io');
const hugo = person('Hugo Marlow', 'hugo@marlowfinch.co');
const lena = person('Lena Voss', 'lena.voss@tidewaterenergy.com');

/** A conversation that holds one message so far. */
const single = (
  id: string,
  contact: Person,
  customer: string,
  deal: string,
  subject: string,
  at: string,
  body: string[],
  flags: { unread?: boolean; starred?: boolean; attachments?: Attachment[] } = {},
): Conversation => ({
  id,
  subject,
  contact,
  customer,
  deal,
  messages: [{ id: `${id}-1`, from: contact, at, body, attachments: flags.attachments }],
  unread: flags.unread ?? false,
  starred: flags.starred ?? false,
});

/** The inbox, newest first. */
export const conversations: Conversation[] = [
  {
    id: 'halcyon-quote',
    subject: 'Revised quote for the 2027 renewal',
    contact: ingrid,
    customer: 'Halcyon Freight',
    deal: 'Renewal 2027',
    unread: false,
    starred: true,
    messages: [
      {
        id: 'halcyon-quote-1',
        from: ingrid,
        at: '2026-11-05T14:14',
        body: [
          'Hi Maya, thank you for the call on Tuesday.',
          'Before the renewal goes to our finance committee we need two things from you: the price per seat if we commit to two years, and whether the 12 extra dispatcher seats can start in January instead of at signing.',
        ],
      },
      {
        id: 'halcyon-quote-2',
        from: account,
        at: '2026-11-06T09:02',
        body: [
          'Hi Ingrid, both are possible. I am checking the two-year price with our deal desk and will send you a revised quote by Tuesday.',
        ],
      },
      {
        id: 'halcyon-quote-3',
        from: ingrid,
        at: '2026-11-09T16:40',
        body: [
          'Thanks, Maya. One more question from our CFO: can the onboarding fee for the new seats be waived? The team that will use them is already trained.',
        ],
      },
      {
        id: 'halcyon-quote-4',
        from: ingrid,
        at: '2026-11-10T08:47',
        body: [
          'Good morning Maya,',
          'The finance committee meets on Thursday at 10:00. If the revised quote is with me by noon tomorrow, I can still put it on the agenda. After that the renewal moves to the December meeting, and our current term ends before then.',
          'To recap what we need in the quote: the two-year term with its price per seat, the 12 added seats starting on January 1, and the onboarding fee for those seats waived. Our current order form is attached, so the new one can follow it.',
          'I am at my desk all morning if a short call is easier than writing it up.',
          'Best regards,',
          'Ingrid',
        ],
        attachments: [{ name: 'halcyon-order-form-2025.pdf', size: '184 KB' }],
      },
    ],
  },
  single(
    'northwind-pricing',
    samuel,
    'Northwind Health',
    'Expansion to four clinics',
    'Pricing review this afternoon',
    '2026-11-10T08:12',
    [
      'Confirming 1:30 PM. I am bringing our procurement lead, so please include the volume tiers above 100 seats.',
    ],
    { unread: true },
  ),
  single(
    'kestrel-demo',
    mirela,
    'Kestrel Analytics',
    'New business',
    'Who is joining on Thursday',
    '2026-11-10T07:35',
    [
      'Five of us will join the demo: two engineers, our security lead, the head of analytics and me. Could you send the invite to everyone on this thread?',
    ],
    { unread: true },
  ),
  single(
    'juniper-redlines',
    colm,
    'Juniper Legal',
    'Master agreement',
    'Redlines on sections 7 and 11',
    '2026-11-09T17:20',
    [
      'Our comments are in the attached draft. The liability cap in section 11 is the only point still open on our side.',
    ],
    { starred: true, attachments: [{ name: 'juniper-msa-redlines.docx', size: '96 KB' }] },
  ),
  single(
    'marlow-discount',
    beatrice,
    'Marlow & Finch',
    'Renewal 2027',
    'Renewal discount',
    '2026-11-09T15:05',
    [
      'Thank you for approving the 10 percent. We will sign the order form this week, as soon as Hugo is back in the office.',
    ],
  ),
  single(
    'atlas-agenda',
    oskar,
    'Atlas Robotics',
    'Discovery',
    'Agenda for the discovery call',
    '2026-11-09T11:48',
    [
      'As promised, here is what we would like to cover: our current tooling, the three workflows we want to replace first, and how the rollout would work across two sites.',
    ],
    { unread: true },
  ),
  single(
    'cobalt-questionnaire',
    farah,
    'Cobalt Security',
    'Security review',
    'Vendor security questionnaire',
    '2026-11-06T16:31',
    [
      'Could you complete the attached questionnaire before our review board meets on November 18? Sections 3 and 4 matter most to us.',
    ],
    { attachments: [{ name: 'cobalt-vendor-questionnaire.xlsx', size: '312 KB' }] },
  ),
  single(
    'tidewater-invoice',
    andre,
    'Tidewater Energy',
    'Growth plan',
    'October invoice',
    '2026-11-06T10:22',
    [
      'We have not received the invoice for October yet. Could you resend it to our accounts payable address?',
    ],
  ),
  single(
    'kestrel-sso',
    tariq,
    'Kestrel Analytics',
    'New business',
    'Single sign-on during the trial',
    '2026-11-05T13:10',
    [
      'Is single sign-on available during the trial, or only once we are on a paid plan? Our security team will ask on Thursday.',
    ],
  ),
  single(
    'marlow-lisbon',
    hugo,
    'Marlow & Finch',
    'Renewal 2027',
    'Seats for the Lisbon office',
    '2026-11-04T09:40',
    [
      'We are opening in Lisbon in February and will need eight more seats. Can they go on the same order form as the renewal?',
    ],
  ),
  single(
    'tidewater-walkthrough',
    lena,
    'Tidewater Energy',
    'Growth plan',
    'Thank you for the walkthrough',
    '2026-11-03T15:56',
    [
      'The forecast view was exactly what our regional leads asked for. I have shared the recording with them.',
    ],
  ),
];
