import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiFolder3Fill,
  RiFolder3Line,
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
  Lumen Studio's shared files in Orbit, open on the Proposals folder: the year folders, the
  template and calculator everyone starts from, and three proposals sent this month that were left
  loose. They are selected and on their way into Proposals / 2026. Today is 10 November 2026.
*/

/** The product is Orbit; the workspace is Lumen Studio. */
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

export const mainLinks: NavLink[] = [
  { id: 'home', label: 'Home', icon: RiHome5Line },
  { id: 'inbox', label: 'Inbox', icon: RiInbox2Line },
  { id: 'customers', label: 'Customers', icon: RiContactsBook3Line },
  { id: 'deals', label: 'Deals', icon: RiHandCoinLine },
  { id: 'revenue', label: 'Revenue', icon: RiLineChartLine },
  { id: 'reports', label: 'Reports', icon: RiPieChart2Line },
  { id: 'files', label: 'Files', icon: RiFolder3Line, activeIcon: RiFolder3Fill },
];

export const settingsLinks: NavLink[] = [
  { id: 'general', label: 'General', icon: RiSettings3Line },
  { id: 'members', label: 'Members', icon: RiTeamLine },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

/** "Now" for every relative date on the page, so the screen reads the same on any day. */
export const NOW = '2026-11-10T15:20:00Z';

export type PersonId = 'maya' | 'jonas' | 'priya' | 'tom' | 'elena' | 'daniel';
export type Person = { name: string; initials: string; color?: AvatarColor };

export const PEOPLE: Record<PersonId, Person> = {
  maya: { name: account.name, initials: account.initials, color: 'orange' },
  jonas: { name: 'Jonas Weber', initials: 'JW' },
  priya: { name: 'Priya Raman', initials: 'PR' },
  tom: { name: 'Tom Becker', initials: 'TB' },
  elena: { name: 'Elena Silva', initials: 'ES' },
  daniel: { name: 'Daniel Reyes', initials: 'DR' },
};

/** The top of the tree: every folder sits somewhere under it. */
export const ROOT = 'root';

export type Folder = {
  id: string;
  name: string;
  /** The folder it sits in; only the root has none. */
  parent: string | null;
  owner: PersonId;
  modified: string;
};

const folder = (
  id: string,
  name: string,
  parent: string,
  owner: PersonId,
  modified: string,
): Folder => ({ id, name, parent, owner, modified });

export const FOLDERS: Folder[] = [
  { id: ROOT, name: 'All files', parent: null, owner: 'maya', modified: NOW },
  folder('proposals', 'Proposals', ROOT, 'maya', '2026-11-09T16:05:00Z'),
  folder('proposals-2025', '2025', 'proposals', 'maya', '2026-01-08T10:00:00Z'),
  folder('proposals-2026', '2026', 'proposals', 'maya', '2026-11-03T14:30:00Z'),
  folder('contracts', 'Contracts', ROOT, 'elena', '2026-11-04T10:12:00Z'),
  folder('contracts-signed', 'Signed', 'contracts', 'elena', '2026-11-04T10:12:00Z'),
  folder('contracts-drafts', 'Drafts', 'contracts', 'elena', '2026-10-29T15:40:00Z'),
  folder('decks', 'Decks', ROOT, 'priya', '2026-11-07T13:40:00Z'),
  folder('recordings', 'Call recordings', ROOT, 'jonas', '2026-11-10T11:02:00Z'),
  folder('security', 'Security reviews', ROOT, 'daniel', '2026-10-28T09:30:00Z'),
  folder('planning', '2027 planning', ROOT, 'maya', '2026-11-02T08:15:00Z'),
];

/** The folder the page is open on when the screen loads. */
export const START_FOLDER = 'proposals';
/** Where the three files are about to go. */
export const START_DESTINATION = 'proposals-2026';

export type Kind = 'pdf' | 'doc' | 'sheet';

export type FileEntry = {
  id: string;
  name: string;
  kind: Kind;
  folder: string;
  owner: PersonId;
  /** ISO date and time of the last change. */
  modified: string;
  /** Bytes. */
  size: number;
  archived?: boolean;
};

const MB = 1024 * 1024;

const file = (
  id: string,
  name: string,
  kind: Kind,
  folderId: string,
  owner: PersonId,
  modified: string,
  size: number,
): FileEntry => ({ id, name, kind, folder: folderId, owner, modified, size: Math.round(size) });

// One file per line: id, name, kind, folder, owner, modified, size.
// prettier-ignore
export const FILES: FileEntry[] = [
  file('halcyon', 'Halcyon Freight renewal proposal.pdf', 'pdf', 'proposals', 'jonas', '2026-11-09T16:05:00Z', 1.8 * MB),
  file('kestrel', 'Kestrel Analytics expansion proposal.pdf', 'pdf', 'proposals', 'tom', '2026-11-06T11:20:00Z', 2.1 * MB),
  file('cobalt', 'Cobalt Security proposal.docx', 'doc', 'proposals', 'daniel', '2026-11-04T09:45:00Z', 0.42 * MB),
  file('template', 'Proposal template.docx', 'doc', 'proposals', 'maya', '2026-09-15T08:30:00Z', 0.21 * MB),
  file('calculator', 'Pricing calculator.xlsx', 'sheet', 'proposals', 'priya', '2026-10-30T14:10:00Z', 0.33 * MB),
  file('case-studies', 'Customer case studies.pdf', 'pdf', 'proposals', 'elena', '2026-10-12T10:00:00Z', 5.6 * MB),
  file('atlas', 'Atlas Robotics proposal.pdf', 'pdf', 'proposals-2026', 'priya', '2026-10-21T09:10:00Z', 1.6 * MB),
  file('juniper', 'Juniper Legal proposal.pdf', 'pdf', 'proposals-2026', 'elena', '2026-09-30T13:25:00Z', 1.2 * MB),
  file('tidewater', 'Tidewater Energy proposal.pdf', 'pdf', 'proposals-2026', 'jonas', '2026-08-18T15:00:00Z', 2.4 * MB),
  file('northwind-2025', 'Northwind Health proposal.pdf', 'pdf', 'proposals-2025', 'maya', '2025-11-12T10:30:00Z', 1.1 * MB),
  file('marlow-2025', 'Marlow & Finch proposal.pdf', 'pdf', 'proposals-2025', 'elena', '2025-06-03T09:00:00Z', 0.9 * MB),
  file('msa', 'Master services agreement.pdf', 'pdf', 'contracts', 'elena', '2026-07-01T09:00:00Z', 0.6 * MB),
];

/** Selected when the screen loads: this month's loose proposals. */
export const START_SELECTION = ['halcyon', 'kestrel', 'cobalt'];
