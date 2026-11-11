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
  RiTeamFill,
  RiTeamLine,
} from '@remixicon/react';

/*
  Who gets into Lumen Studio. Five people wait for an answer: two signed up with a
  lumenstudio.co address, two came through a teammate's invite link and one asked from the
  sign-in page. Four invitations are out, two of them past their seven days. Two people are
  blocked. The workspace has 34 of its 40 Growth seats taken, so every request fits.
*/

/** The sample's clock: every relative date on the page is measured from here. */
export const NOW = new Date('2026-11-10T14:30:00');

/** The product is Orbit; the workspace people ask to join is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = {
  name: 'Lumen Studio',
  initials: 'LS',
  plan: 'Growth',
  seats: 40,
  /** Seats taken before anyone on this page is let in. */
  members: 34,
};
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

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
  { id: 'revenue', label: 'Revenue', icon: RiLineChartLine },
  { id: 'reports', label: 'Reports', icon: RiPieChart2Line },
];

export const settingsLinks: NavLink[] = [
  { id: 'general', label: 'General', icon: RiSettings3Line },
  { id: 'members', label: 'Members', icon: RiTeamLine, activeIcon: RiTeamFill },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

export type Role = 'admin' | 'member' | 'viewer';

/** The roles a person can be let in with. Ownership is transferred, never given. */
export const ROLES: { value: Role; label: string; hint: string }[] = [
  { value: 'admin', label: 'Admin', hint: 'Manages members, billing and workspace settings.' },
  { value: 'member', label: 'Member', hint: 'Works with customers, deals and reports.' },
  { value: 'viewer', label: 'Viewer', hint: 'Sees everything and changes nothing.' },
];

export const roleLabel = (role: Role) => ROLES.find((option) => option.value === role)!.label;

export type Person = { id: string; name: string; initials: string; email: string };

/** Someone who asked to join and waits for an admin. */
export type AccessRequest = Person & {
  /** Who they say they are, in their own words. */
  note: string;
  /** How the request reached the workspace. */
  source: string;
  /** ISO date and time. */
  requested: string;
};

export type Invitation = {
  id: string;
  email: string;
  role: Role;
  invitedBy: string;
  /** ISO date and time; the link expires 7 days later. */
  sent: string;
};

export type BlockedPerson = Person & {
  blockedBy: string;
  /** ISO date and time. */
  blocked: string;
  reason: string;
};

export const requests: AccessRequest[] = [
  {
    id: 'aiko',
    name: 'Aiko Tanaka',
    initials: 'AT',
    email: 'aiko@lumenstudio.co',
    note: 'Sales development, joining Jonas Weber’s team',
    source: 'Signed up with a lumenstudio.co e-mail',
    requested: '2026-11-10T12:05:00',
  },
  {
    id: 'rafael',
    name: 'Rafael Costa',
    initials: 'RC',
    email: 'rafael@lumenstudio.co',
    note: 'Account executive in the Lisbon office',
    source: 'Signed up with a lumenstudio.co e-mail',
    requested: '2026-11-10T09:40:00',
  },
  {
    id: 'hannah',
    name: 'Hannah Brooks',
    initials: 'HB',
    email: 'hannah@marlowfinch.co',
    note: 'Marlow & Finch’s account lead, for the renewal',
    source: 'Through Priya Raman’s invite link',
    requested: '2026-11-09T16:20:00',
  },
  {
    id: 'omar',
    name: 'Omar Haddad',
    initials: 'OH',
    email: 'omar@kestrelanalytics.io',
    note: 'Reviewing the Q4 forecast with Tom Becker',
    source: 'Through Tom Becker’s invite link',
    requested: '2026-11-08T11:15:00',
  },
  {
    id: 'lucy',
    name: 'Lucy Fenwick',
    initials: 'LF',
    email: 'lucy@fenwickadvisory.co',
    note: 'Pricing consultant working with Elena Silva',
    source: 'Asked from the sign-in page',
    requested: '2026-11-06T10:30:00',
  },
];

export const invitations: Invitation[] = [
  {
    id: 'grace',
    email: 'grace@lumenstudio.co',
    role: 'member',
    invitedBy: 'Maya Okafor',
    sent: '2026-11-09T10:12:00',
  },
  {
    id: 'felix',
    email: 'felix@lumenstudio.co',
    role: 'admin',
    invitedBy: 'Jonas Weber',
    sent: '2026-11-07T15:40:00',
  },
  {
    id: 'ines',
    email: 'ines@atlasrobotics.com',
    role: 'viewer',
    invitedBy: 'Daniel Reyes',
    sent: '2026-11-01T09:05:00',
  },
  {
    id: 'samuel',
    email: 'samuel@lumenstudio.co',
    role: 'member',
    invitedBy: 'Maya Okafor',
    sent: '2026-10-28T13:30:00',
  },
];

export const blocked: BlockedPerson[] = [
  {
    id: 'victor',
    name: 'Victor Lang',
    initials: 'VL',
    email: 'victor@quillmetrics.io',
    blockedBy: 'Jonas Weber',
    blocked: '2026-10-21T11:00:00',
    reason: 'Works for a competitor; asked to join twice',
  },
  {
    id: 'dana',
    name: 'Dana Whitfield',
    initials: 'DW',
    email: 'dana@lumenstudio.co',
    blockedBy: 'Maya Okafor',
    blocked: '2026-09-30T17:20:00',
    reason: 'Left Lumen Studio in September',
  },
];
