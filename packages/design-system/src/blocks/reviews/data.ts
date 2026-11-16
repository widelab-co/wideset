import {
  type RemixiconComponentType,
  RiBankCardLine,
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
  RiStarFill,
  RiStarLine,
  RiTeamLine,
} from '@remixicon/react';

/*
  What Lumen Studio's customers say after a deal closes. Orbit asks the deal's contact for a
  rating and a few words; the summary counts all 128 answers, the list holds the latest. The
  average is worked out from the spread: (5×92 + 4×24 + 3×7 + 2×3 + 1×2) / 128 = 4.57.
*/

/** The product is Orbit; the workspace is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

/** The sample is frozen on this day; a reply written on the page is written today. */
export const TODAY = '2026-11-10';

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
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
  { id: 'reviews', label: 'Reviews', icon: RiStarLine, activeIcon: RiStarFill },
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

export type Rating = 1 | 2 | 3 | 4 | 5;
export const RATINGS: Rating[] = [5, 4, 3, 2, 1];

/** How many reviews gave each rating, over every review Lumen Studio has. */
export const spread: Record<Rating, number> = { 5: 92, 4: 24, 3: 7, 2: 3, 1: 2 };
export const total = RATINGS.reduce((sum, rating) => sum + spread[rating], 0);
export const average = RATINGS.reduce((sum, rating) => sum + rating * spread[rating], 0) / total;

export type Reply = {
  /** Who answered for Lumen Studio. */
  author: string;
  /** A calendar day. */
  date: string;
  text: string;
};

export type Review = {
  id: string;
  rating: Rating;
  /** The review in one line. */
  title: string;
  text: string;
  customer: string;
  /** Who wrote it: the contact on the deal. */
  person: string;
  role: string;
  /** A calendar day. */
  date: string;
  /** The deal it followed. */
  deal: string;
  reply?: Reply;
};

/** The latest reviews, newest first. */
export const reviews: Review[] = [
  {
    id: 'tidewater',
    rating: 5,
    title: 'Clear pricing and no surprises in the contract',
    text: 'We compared three vendors. Lumen Studio was the only one that sent a full quote after the first call, and the contract matched it line for line. Onboarding started the week we signed.',
    customer: 'Tidewater Energy',
    person: 'Grace Okonkwo',
    role: 'Procurement lead',
    date: '2026-11-06',
    deal: 'Team plan, 60 seats',
  },
  {
    id: 'marlow',
    rating: 4,
    title: 'Good product, slow start on the paperwork',
    text: 'The demo answered every question we had and Jonas knew our business. The security questionnaire took two weeks to come back, which pushed our start date.',
    customer: 'Marlow & Finch',
    person: 'Theo Marlow',
    role: 'Partner',
    date: '2026-11-03',
    deal: 'Two-year renewal',
    reply: {
      author: account.name,
      date: '2026-11-04',
      text: 'Thank you, Theo. Two weeks is too long, and a different team handles questionnaires now. The next one will reach you within three working days.',
    },
  },
  {
    id: 'cobalt',
    rating: 2,
    title: 'Sold one thing, delivered another',
    text: 'We were told single sign-on was part of our plan. It was an add-on, and we found out after signing. Support corrected the invoice, but it cost us a month.',
    customer: 'Cobalt Security',
    person: 'Farah Qureshi',
    role: 'Head of security',
    date: '2026-10-28',
    deal: 'Annual plan, 45 seats',
  },
  {
    id: 'northwind',
    rating: 5,
    title: 'They understood a regulated buyer',
    text: 'Priya brought the compliance documents to the second meeting without being asked. The rollout across four clinics was planned with our IT team, not handed to us.',
    customer: 'Northwind Health',
    person: 'Samuel Adeyemi',
    role: 'IT director',
    date: '2026-10-21',
    deal: 'Annual plan, 120 seats',
    reply: {
      author: account.name,
      date: '2026-10-22',
      text: 'Thank you, Samuel. I have passed this on to Priya and to the onboarding team.',
    },
  },
  {
    id: 'halcyon',
    rating: 5,
    title: 'Fast, careful, and honest about what they could not do',
    text: 'Two features we asked for were not on the roadmap and we were told so in the first week. Everything that was promised arrived on the dates in the plan.',
    customer: 'Halcyon Freight',
    person: 'Dana Whitfield',
    role: 'Head of operations',
    date: '2026-10-14',
    deal: 'Annual plan, 80 seats',
  },
  {
    id: 'kestrel',
    rating: 4,
    title: 'A straightforward purchase',
    text: 'Three calls from first contact to signature. We would have liked a trial with our own data before committing, but the pilot terms made up for it.',
    customer: 'Kestrel Analytics',
    person: 'Ines Duarte',
    role: 'Operations director',
    date: '2026-10-09',
    deal: 'Team plan, 30 seats',
  },
  {
    id: 'juniper',
    rating: 3,
    title: 'Fine, once we got past procurement',
    text: 'The team was helpful, but the order form went through four versions before legal on both sides agreed. A standard set of terms for firms like ours would have saved weeks.',
    customer: 'Juniper Legal',
    person: 'Claire Monroe',
    role: 'Managing partner',
    date: '2026-09-30',
    deal: 'Annual plan, 25 seats',
    reply: {
      author: account.name,
      date: '2026-10-01',
      text: 'That is fair, Claire. We now start legal firms on a standard order form, and yours was the reason.',
    },
  },
];

export type SortKey = 'newest' | 'highest' | 'lowest';

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'highest', label: 'Highest' },
  { value: 'lowest', label: 'Lowest' },
];

/** A deal that closed and has not been asked about yet. */
export type ReviewRequest = {
  id: string;
  customer: string;
  /** The contact on the deal: who the request goes to. */
  person: string;
  deal: string;
  /** The day the deal closed. */
  closed: string;
};

export const reviewRequests: ReviewRequest[] = [
  {
    id: 'atlas',
    customer: 'Atlas Robotics',
    person: 'Henrik Lund',
    deal: 'Team plan, 45 seats',
    closed: '2026-11-05',
  },
  {
    id: 'halcyon-expansion',
    customer: 'Halcyon Freight',
    person: 'Dana Whitfield',
    deal: 'Expansion, 40 seats',
    closed: '2026-11-02',
  },
  {
    id: 'northwind-clinics',
    customer: 'Northwind Health',
    person: 'Samuel Adeyemi',
    deal: 'Two new clinics, 30 seats',
    closed: '2026-10-29',
  },
];
