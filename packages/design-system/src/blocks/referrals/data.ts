import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiGiftFill,
  RiGiftLine,
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

/*
  Orbit's referral programme, as Lumen Studio sees it on 10 November 2026. A team that subscribes
  through Lumen Studio's link earns it $200 of credit, and every fifth team adds a $500 bonus.
  Three teams have subscribed ($600 earned), $200 of that already came off November's invoice, so
  $400 is left to redeem against December's: Growth, 40 seats at $39 = $1,560.00. Every figure on
  the page is worked out below from these values.
*/

/** The product is Orbit; the workspace referring others to it is Lumen Studio. */
export const product = { name: 'Orbit' };
export const workspace = { name: 'Lumen Studio', initials: 'LS' };
export const account = { name: 'Maya Okafor', email: 'maya@lumenstudio.co', initials: 'MO' };

/** The day the screen shows: a new invitation is dated with it. */
export const today = '2026-11-10';

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
  { id: 'referrals', label: 'Referrals', icon: RiGiftLine, activeIcon: RiGiftFill },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

/** The deal: what a referral earns, and the bonus every few of them add. */
export const programme = {
  link: 'https://orbit.so/r/lumen-studio',
  /** Credit for each referred team, once it subscribes. */
  reward: 200,
  /** The bonus, and how many subscribed teams it takes to earn one. */
  bonus: { amount: 500, every: 5 },
};

/** Where a referred team stands. Only `subscribed` earns the reward. */
export type ReferralStatus = 'invited' | 'signed-up' | 'subscribed';

export type Referral = {
  /** The address the invitation went to: it is all the page knows about the person. */
  email: string;
  /** The day the invitation was sent. */
  invited: string;
  status: ReferralStatus;
};

/** Everyone invited so far, newest first. */
export const referrals: Referral[] = [
  { email: 'owen@tallgrasslabs.co', invited: '2026-11-06', status: 'invited' },
  { email: 'rosa@pinecrest.studio', invited: '2026-11-03', status: 'invited' },
  { email: 'kenji@harborlane.co', invited: '2026-10-27', status: 'signed-up' },
  { email: 'amara@fernhill.agency', invited: '2026-10-08', status: 'subscribed' },
  { email: 'felix@quarryworks.io', invited: '2026-09-16', status: 'subscribed' },
  { email: 'sofia@larkspur.design', invited: '2026-08-21', status: 'subscribed' },
];

/** Credit that already came off an invoice, before today. */
export const redeemedBefore = 200;

/** The invoice the credit goes against next: December's seats, before any credit. */
export const nextInvoice = { date: '2026-12-01', description: 'Growth, 40 seats', amount: 1_560 };

/** What a referral has earned: the reward once the team subscribed, nothing before. */
export const rewardOf = (referral: Referral) =>
  referral.status === 'subscribed' ? programme.reward : 0;

/** Where the credit stands for a list of referrals: what it earned and how far the bonus is. */
export function creditOf(list: Referral[]) {
  const subscribed = list.filter((referral) => referral.status === 'subscribed').length;
  const bonuses = Math.floor(subscribed / programme.bonus.every);
  return {
    subscribed,
    earned: subscribed * programme.reward + bonuses * programme.bonus.amount,
    /** Subscribed teams counted towards the next bonus, and how many it takes. */
    towardsBonus: subscribed % programme.bonus.every,
  };
}
