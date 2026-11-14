import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiBuilding2Line,
  RiHandCoinLine,
  RiHomeLine,
  RiLineChartLine,
  RiPieChart2Line,
  RiSettings3Line,
  RiTeamLine,
} from '@remixicon/react';

/** The sample's clock: every relative date on the page is measured from here. */
export const NOW = new Date('2026-11-10T14:30:00');

export const workspace = {
  name: 'Lumen Studio',
  plan: 'Growth',
  seats: 15,
  /** The address people join the workspace by. */
  inviteLink: 'join.orbit.so/lumen-studio',
};

export type Role = 'owner' | 'admin' | 'member' | 'viewer';

export const ROLE_LABEL: Record<Role, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
  viewer: 'Viewer',
};

/** The roles a person can be given. Ownership is transferred, never assigned. */
export const ROLE_OPTIONS = (['admin', 'member', 'viewer'] as const).map((value) => ({
  value,
  label: ROLE_LABEL[value],
}));

/** What each role may do, shown under its name in the role menu. */
export const ROLE_HINT: Record<Exclude<Role, 'owner'>, string> = {
  admin: 'Admins manage members, billing and workspace settings.',
  member: 'Members work with customers, deals and reports.',
  viewer: 'Viewers can see everything and change nothing.',
};

export type Member = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: Role;
  teams: string[];
  /** ISO date and time of the last session. */
  lastActive: string;
  twoFactor: boolean;
};

export type Invitation = {
  id: string;
  email: string;
  role: Exclude<Role, 'owner'>;
  invitedBy: string;
  /** ISO date and time; the link expires 7 days later. */
  sent: string;
};

export const members: Member[] = [
  {
    id: 'hana',
    name: 'Hana Kobayashi',
    initials: 'HK',
    email: 'hana@lumen.studio',
    role: 'owner',
    teams: ['Leadership'],
    lastActive: '2026-11-10T14:30:00',
    twoFactor: true,
  },
  {
    id: 'marcus',
    name: 'Marcus Bell',
    initials: 'MB',
    email: 'marcus@lumen.studio',
    role: 'admin',
    teams: ['Revenue Ops'],
    lastActive: '2026-11-10T13:48:00',
    twoFactor: true,
  },
  {
    id: 'priya',
    name: 'Priya Raman',
    initials: 'PR',
    email: 'priya@lumen.studio',
    role: 'admin',
    teams: ['Revenue Ops', 'Finance'],
    lastActive: '2026-11-10T09:15:00',
    twoFactor: true,
  },
  {
    id: 'amara',
    name: 'Amara Nwosu',
    initials: 'AN',
    email: 'amara@lumen.studio',
    role: 'member',
    teams: ['Sales'],
    lastActive: '2026-11-10T11:02:00',
    twoFactor: false,
  },
  {
    id: 'jonas',
    name: 'Jonas Lindqvist',
    initials: 'JL',
    email: 'jonas@lumen.studio',
    role: 'member',
    teams: ['Customer Success'],
    lastActive: '2026-11-09T16:40:00',
    twoFactor: true,
  },
  {
    id: 'kofi',
    name: 'Kofi Mensah',
    initials: 'KM',
    email: 'kofi@lumen.studio',
    role: 'member',
    teams: ['Sales'],
    lastActive: '2026-11-10T08:05:00',
    twoFactor: true,
  },
  {
    id: 'leila',
    name: 'Leila Haddad',
    initials: 'LH',
    email: 'leila@lumen.studio',
    role: 'member',
    teams: ['Customer Success', 'Sales'],
    lastActive: '2026-11-08T10:05:00',
    twoFactor: true,
  },
  {
    id: 'sofia',
    name: 'Sofia Marino',
    initials: 'SM',
    email: 'sofia@lumen.studio',
    role: 'member',
    teams: ['Marketing'],
    lastActive: '2026-11-07T09:30:00',
    twoFactor: false,
  },
  {
    id: 'tomas',
    name: 'Tomás Ortega',
    initials: 'TO',
    email: 'tomas@lumen.studio',
    role: 'member',
    teams: ['Sales'],
    lastActive: '2026-11-10T14:18:00',
    twoFactor: true,
  },
  {
    id: 'wei',
    name: 'Wei Chen',
    initials: 'WC',
    email: 'wei@lumen.studio',
    role: 'member',
    teams: ['Data'],
    lastActive: '2026-11-06T17:20:00',
    twoFactor: true,
  },
  {
    id: 'daniel',
    name: 'Daniel Okoro',
    initials: 'DO',
    email: 'daniel@lumen.studio',
    role: 'viewer',
    teams: ['Finance'],
    lastActive: '2026-10-21T15:00:00',
    twoFactor: true,
  },
  {
    id: 'nadia',
    name: 'Nadia Farouk',
    initials: 'NF',
    email: 'nadia@northfold.co',
    role: 'viewer',
    teams: ['Marketing'],
    lastActive: '2026-10-28T12:00:00',
    twoFactor: true,
  },
];

/** The signed-in user: the workspace's owner. */
export const account = members[0];

export const invitations: Invitation[] = [
  {
    id: 'noah',
    email: 'noah@lumen.studio',
    role: 'member',
    invitedBy: 'Marcus Bell',
    sent: '2026-11-09T10:20:00',
  },
  {
    id: 'ines',
    email: 'ines@lumen.studio',
    role: 'admin',
    invitedBy: 'Priya Raman',
    sent: '2026-11-05T15:00:00',
  },
  {
    id: 'ravi',
    email: 'ravi@kettle.design',
    role: 'viewer',
    invitedBy: 'Hana Kobayashi',
    sent: '2026-10-31T09:00:00',
  },
];

export const navigation: { id: string; label: string; icon: RemixiconComponentType }[] = [
  { id: 'home', label: 'Home', icon: RiHomeLine },
  { id: 'customers', label: 'Customers', icon: RiBuilding2Line },
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
  { id: 'forecast', label: 'Forecast', icon: RiLineChartLine },
  { id: 'reports', label: 'Reports', icon: RiPieChart2Line },
];

export const workspaceNavigation: { id: string; label: string; icon: RemixiconComponentType }[] = [
  { id: 'team', label: 'Team', icon: RiTeamLine },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine },
  { id: 'settings', label: 'Settings', icon: RiSettings3Line },
];
