import {
  type RemixiconComponentType,
  RiBarChartBoxLine,
  RiBuilding2Line,
  RiFlag2Fill,
  RiFlag2Line,
  RiHandCoinLine,
  RiHome5Line,
  RiQuestionLine,
  RiSettingsLine,
} from '@remixicon/react';
import type { AvatarColor } from '@wideset/react';

/*
  Orbit, a customer and revenue platform, on the day Maya Chen opened the Lumen Studio workspace.
  She has imported her customers and connected her e-mail; the team, the defaults and the first
  deal are still to do.
*/

export const workspace = { name: 'Lumen Studio', plan: 'Trial, 14 days left' };

/** The signed-in person, who created the workspace. */
export const account = {
  name: 'Maya Chen',
  firstName: 'Maya',
  initials: 'MC',
  color: 'teal' as AvatarColor,
  email: 'maya@lumenstudio.co',
};

export type NavLink = {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  /** The icon while the page is open (a line icon swaps for its fill). */
  activeIcon?: RemixiconComponentType;
};

/** A young app: the pages exist, nothing in them is set up yet. */
export const mainLinks: NavLink[] = [
  { id: 'get-started', label: 'Get started', icon: RiFlag2Line, activeIcon: RiFlag2Fill },
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'customers', label: 'Customers', icon: RiBuilding2Line },
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
  { id: 'reports', label: 'Reports', icon: RiBarChartBoxLine },
];

export const footerLinks: NavLink[] = [
  { id: 'settings', label: 'Settings', icon: RiSettingsLine },
  { id: 'help', label: 'Help', icon: RiQuestionLine },
];

export type Step = {
  id: string;
  title: string;
  /** One line: why the step is worth doing. */
  why: string;
  /** The one action that does the step. */
  action: string;
  /** What doing it left behind, shown once it is done. */
  result: string;
};

export const steps: Step[] = [
  {
    id: 'import',
    title: 'Import your customers',
    why: 'Bring in the companies you already work with, from a file or a CRM.',
    action: 'Import customers',
    result: '128 customers imported',
  },
  {
    id: 'email',
    title: 'Connect your e-mail',
    why: 'Orbit files every e-mail with a customer on their record for you.',
    action: 'Connect e-mail',
    result: 'Syncing maya@lumenstudio.co',
  },
  {
    id: 'team',
    title: 'Invite your team',
    why: 'Work from the same customers and give every account an owner.',
    action: 'Invite people',
    result: '4 people invited',
  },
  {
    id: 'defaults',
    title: 'Set your currency and time zone',
    why: 'Reports use your currency; reminders arrive in your working hours.',
    action: 'Open settings',
    result: 'EUR, Europe/Lisbon',
  },
  {
    id: 'deal',
    title: 'Create your first deal',
    why: 'Follow one opportunity from the first call to the signed contract.',
    action: 'Create deal',
    result: 'Lanetrack, Q4 seat expansion',
  },
];

/** The steps Maya has done before this visit. */
export const doneAtStart = ['import', 'email'];

export type Resource = { id: string; title: string; description: string; href: string };

export const resources: Resource[] = [
  {
    id: 'guide',
    title: 'Getting started guide',
    description: 'A ten-minute tour',
    href: '#guide',
  },
  {
    id: 'template',
    title: 'Agency pipeline template',
    description: 'Stages built for studios',
    href: '#templates',
  },
  {
    id: 'help',
    title: 'Help centre',
    description: 'Imports, e-mail and access',
    href: '#help',
  },
];
