import {
  type RemixiconComponentType,
  RiBuilding2Line,
  RiHandCoinLine,
  RiHomeLine,
  RiLineChartLine,
  RiPieChart2Fill,
  RiPieChart2Line,
  RiSettings3Line,
  RiTeamLine,
} from '@remixicon/react';
import type { AvatarColor } from '@wideset/react';

/*
  Orbit, a customer and revenue platform, in the Lumen Studio workspace. Jonas, who sells, opened a
  link to a Finance report; Finance reports are shared with the finance team only.
*/

export const workspace = { name: 'Lumen Studio' };

export type Person = { name: string; initials: string; color: AvatarColor; role: string };

/** The signed-in person: a member without access to Finance. */
export const account = {
  name: 'Jonas Weber',
  initials: 'JW',
  color: 'blue' as AvatarColor,
  role: 'Member',
  email: 'jonas@lumenstudio.co',
};

/** The page Jonas opened, and who decides on access to it. */
export const report = {
  name: 'Revenue by plan',
  folder: 'Finance',
  owner: {
    name: 'Elena Silva',
    firstName: 'Elena',
    initials: 'ES',
    color: 'purple',
    role: 'Head of Finance',
  } satisfies Person & { firstName: string },
};

export type NavLink = {
  id: string;
  label: string;
  icon: RemixiconComponentType;
  /** The icon while the page is open (a line icon swaps for its fill). */
  activeIcon?: RemixiconComponentType;
};

export const navigation: NavLink[] = [
  { id: 'home', label: 'Home', icon: RiHomeLine },
  { id: 'customers', label: 'Customers', icon: RiBuilding2Line },
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
  { id: 'forecast', label: 'Forecast', icon: RiLineChartLine },
  { id: 'reports', label: 'Reports', icon: RiPieChart2Line, activeIcon: RiPieChart2Fill },
];

export const workspaceNavigation: NavLink[] = [
  { id: 'team', label: 'Team', icon: RiTeamLine },
  { id: 'settings', label: 'Settings', icon: RiSettings3Line },
];

/** Where the way back leads: replace with your routes. */
export const ROUTES = { reports: '#reports' };
