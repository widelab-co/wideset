import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiComputerLine,
  RiContactsBook3Line,
  RiGoogleLine,
  RiHandCoinLine,
  RiHome5Line,
  RiInbox2Line,
  RiKey2Line,
  RiLineChartLine,
  RiMacbookLine,
  RiMicrosoftLine,
  RiPieChart2Line,
  RiPlugLine,
  RiQuestionLine,
  RiSettings3Line,
  RiSmartphoneLine,
  RiTeamLine,
} from '@remixicon/react';
import type { AvatarColor } from '@wideset/react';

/*
  Maya's own account, reached from the account menu at the foot of the sidebar. She works from
  London (GMT in November), reads Orbit in US English with US dates and numbers, signs in with a
  password and an authenticator app, has Google linked, and is signed in on three devices.
*/

/** The sample's clock: an instant, so the format example can follow the chosen time zone. */
export const NOW = new Date('2026-11-10T14:30:00Z');

/** The product is Orbit; the workspace is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = {
  name: 'Maya Okafor',
  email: 'maya@lumenstudio.co',
  initials: 'MO',
  color: 'orange' as AvatarColor,
};

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
  { id: 'members', label: 'Members', icon: RiTeamLine },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

/** What the save bar saves: the profile and the language and region, as the server holds them. */
export type AccountValues = {
  /** An uploaded image's object URL; `null` shows the initials. */
  photo: string | null;
  name: string;
  jobTitle: string;
  email: string;
  language: string;
  timeZone: string;
  /** The locale dates and numbers are written in. */
  format: string;
};

/** A message per field that is wrong; every field's control has the id `account-<field>`. */
export type FieldErrors = Partial<Record<keyof AccountValues, string>>;

export const saved: AccountValues = {
  photo: null,
  name: 'Maya Okafor',
  jobTitle: 'Head of Sales',
  email: 'maya@lumenstudio.co',
  language: 'en-US',
  timeZone: 'Europe/London',
  format: 'en-US',
};

export const languages = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'pl', label: 'Polski' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
];

export const timeZones = [
  { value: 'America/Los_Angeles', label: '(GMT−08:00) Los Angeles' },
  { value: 'America/New_York', label: '(GMT−05:00) New York' },
  { value: 'Europe/London', label: '(GMT+00:00) London' },
  { value: 'Europe/Lisbon', label: '(GMT+00:00) Lisbon' },
  { value: 'Europe/Berlin', label: '(GMT+01:00) Berlin' },
  { value: 'Europe/Warsaw', label: '(GMT+01:00) Warsaw' },
  { value: 'Europe/Helsinki', label: '(GMT+02:00) Helsinki' },
  { value: 'Asia/Dubai', label: '(GMT+04:00) Dubai' },
  { value: 'Asia/Kolkata', label: '(GMT+05:30) Mumbai' },
  { value: 'Asia/Singapore', label: '(GMT+08:00) Singapore' },
  { value: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo' },
  { value: 'Australia/Sydney', label: '(GMT+11:00) Sydney' },
];

/** Date and number formats, named by the region whose habits they follow. */
export const formats = [
  { value: 'en-US', label: 'United States' },
  { value: 'en-GB', label: 'United Kingdom' },
  { value: 'de-DE', label: 'Germany' },
  { value: 'fr-FR', label: 'France' },
  { value: 'pl-PL', label: 'Poland' },
  { value: 'ja-JP', label: 'Japan' },
];

export type Theme = 'light' | 'dark' | 'system';

/** E-mail notifications: each switch applies the moment it flips. */
export const notifications: { id: string; label: string; description: string; on: boolean }[] = [
  {
    id: 'deals',
    label: 'Deal updates',
    description: 'When a deal you own moves stage, or someone comments on it.',
    on: true,
  },
  {
    id: 'mentions',
    label: 'Mentions',
    description: 'When someone mentions you in a note or on a deal.',
    on: true,
  },
  {
    id: 'requests',
    label: 'Access requests',
    description: 'When someone asks to join Lumen Studio and an admin has to answer.',
    on: true,
  },
  {
    id: 'digest',
    label: 'Weekly revenue digest',
    description: 'New revenue, churn and pipeline changes, every Monday at 9:00.',
    on: false,
  },
  {
    id: 'product',
    label: 'Product updates',
    description: 'New Orbit features, about once a month.',
    on: false,
  },
];

export const security = {
  /** ISO date the password was last changed. */
  passwordChanged: '2026-08-14T10:00:00Z',
  twoFactor: { method: 'an authenticator app', backupCodes: 8 },
};

/** A sign-in provider; `connected` is the address it is linked as, `null` when it is not. */
export type LinkedAccount = {
  id: string;
  name: string;
  icon: RemixiconComponentType;
  connected: string | null;
};

export const linkedAccounts: LinkedAccount[] = [
  { id: 'google', name: 'Google', icon: RiGoogleLine, connected: 'maya@lumenstudio.co' },
  { id: 'microsoft', name: 'Microsoft', icon: RiMicrosoftLine, connected: null },
];

export type Session = {
  id: string;
  device: string;
  icon: RemixiconComponentType;
  place: string;
  /** ISO date and time of the last request from it. */
  lastActive: string;
  /** The device this page is open on: it cannot sign itself out here. */
  current?: boolean;
};

export const sessions: Session[] = [
  {
    id: 'mac',
    device: 'Chrome on macOS',
    icon: RiMacbookLine,
    place: 'London, United Kingdom',
    lastActive: '2026-11-10T14:30:00Z',
    current: true,
  },
  {
    id: 'iphone',
    device: 'Orbit for iPhone',
    icon: RiSmartphoneLine,
    place: 'London, United Kingdom',
    lastActive: '2026-11-10T12:10:00Z',
  },
  {
    id: 'windows',
    device: 'Edge on Windows',
    icon: RiComputerLine,
    place: 'Berlin, Germany',
    lastActive: '2026-11-03T09:20:00Z',
  },
];
