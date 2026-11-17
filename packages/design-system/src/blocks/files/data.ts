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
  Lumen Studio's shared files in Orbit: the proposals, contracts, decks and call recordings the
  sales team works from, in a handful of folders, a few pinned, three collections that gather
  files across folders, two archived and two in the trash. Today is 10 November 2026.
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
/** Deleted files stay in the trash this long, then go for good. */
export const TRASH_DAYS = 30;
/** Recent holds what changed in the last two weeks. */
export const RECENT_DAYS = 14;

export type Person = { name: string; initials: string; color?: AvatarColor };

export type PersonId = 'maya' | 'jonas' | 'priya' | 'tom' | 'elena' | 'daniel' | 'leo' | 'nina';

export const PEOPLE: Record<PersonId, Person> = {
  maya: { name: account.name, initials: account.initials, color: 'orange' },
  jonas: { name: 'Jonas Weber', initials: 'JW' },
  priya: { name: 'Priya Raman', initials: 'PR' },
  tom: { name: 'Tom Becker', initials: 'TB' },
  elena: { name: 'Elena Silva', initials: 'ES' },
  daniel: { name: 'Daniel Reyes', initials: 'DR' },
  leo: { name: 'Leo Marchetti', initials: 'LM' },
  nina: { name: 'Nina Alvarez', initials: 'NA' },
};
export const ME: PersonId = 'maya';

/** What a file is, read from its extension. A folder is a kind too, so a list can hold both. */
export type Kind = 'folder' | 'pdf' | 'doc' | 'deck' | 'sheet' | 'recording';

export const KIND_LABEL: Record<Exclude<Kind, 'folder'>, string> = {
  pdf: 'PDF',
  doc: 'Document',
  deck: 'Deck',
  sheet: 'Spreadsheet',
  recording: 'Recording',
};

const EXTENSIONS: Record<string, Exclude<Kind, 'folder'>> = {
  pdf: 'pdf',
  doc: 'doc',
  docx: 'doc',
  txt: 'doc',
  md: 'doc',
  ppt: 'deck',
  pptx: 'deck',
  key: 'deck',
  xls: 'sheet',
  xlsx: 'sheet',
  csv: 'sheet',
  mp4: 'recording',
  mov: 'recording',
  m4a: 'recording',
  mp3: 'recording',
  wav: 'recording',
};

/** `proposal.pdf` → `pdf`; anything unknown is shown as a document. */
export const kindOf = (name: string): Exclude<Kind, 'folder'> =>
  EXTENSIONS[name.split('.').pop()?.toLowerCase() ?? ''] ?? 'doc';

export type ItemState = 'active' | 'archived' | 'trashed';

export type Item = {
  id: string;
  name: string;
  kind: Kind;
  /** The folder it sits in; `null` is the top of All files. */
  parent: string | null;
  owner: PersonId;
  /** ISO date and time of the last change. */
  modified: string;
  /** Bytes; folders have none. */
  size?: number;
  pinned?: boolean;
  /** Shared with the signed-in person directly, by its owner. */
  sharedWithMe?: boolean;
  /** The collections it belongs to; a file can be in several. */
  collections: string[];
  state: ItemState;
  /** When it was archived or moved to the trash. */
  putAway?: string;
  /** 0 to 1 while it uploads; gone once it is in. */
  progress?: number;
};

export type Collection = { id: string; name: string };

export const COLLECTIONS: Collection[] = [
  { id: 'q4', name: 'Q4 proposals' },
  { id: 'security', name: 'Security pack' },
  { id: 'onboarding', name: 'Customer onboarding' },
];

const MB = 1024 * 1024;

const folder = (id: string, name: string, owner: PersonId, modified: string, parent = null) =>
  ({ id, name, kind: 'folder', parent, owner, modified, collections: [], state: 'active' }) as Item;

const file = (
  id: string,
  name: string,
  parent: string | null,
  owner: PersonId,
  modified: string,
  size: number,
  extra: Partial<Item> = {},
): Item => ({
  id,
  name,
  kind: kindOf(name),
  parent,
  owner,
  modified,
  size: Math.round(size),
  collections: [],
  state: 'active',
  ...extra,
});

export const ITEMS: Item[] = [
  folder('proposals', 'Proposals', 'maya', '2026-11-09T16:05:00Z'),
  folder('contracts', 'Contracts', 'elena', '2026-11-04T10:12:00Z'),
  folder('decks', 'Decks', 'priya', '2026-11-07T13:40:00Z'),
  folder('recordings', 'Call recordings', 'jonas', '2026-11-10T11:02:00Z'),
  folder('security', 'Security reviews', 'daniel', '2026-10-28T09:30:00Z'),
  folder('planning', '2027 planning', 'maya', '2026-11-02T08:15:00Z'),
  { ...folder('q4-2026', 'Q4 2026', 'maya', '2026-11-09T16:05:00Z'), parent: 'proposals' },

  file(
    'sales-playbook',
    'Lumen Studio sales playbook.docx',
    null,
    'maya',
    '2026-11-06T14:22:00Z',
    0.31 * MB,
    { pinned: true, collections: ['onboarding'] },
  ),
  file(
    'pricing-one-pager',
    'Orbit pricing one-pager.pdf',
    null,
    'maya',
    '2026-10-21T09:10:00Z',
    1.4 * MB,
  ),
  file('q4-forecast', 'Q4 forecast.xlsx', null, 'priya', '2026-11-10T09:41:00Z', 0.86 * MB, {
    pinned: true,
    sharedWithMe: true,
  }),
  file(
    'pipeline-review',
    'November pipeline review.pptx',
    null,
    'tom',
    '2026-11-03T17:55:00Z',
    14.2 * MB,
  ),

  file(
    'halcyon-proposal',
    'Halcyon Freight proposal.pdf',
    'proposals',
    'jonas',
    '2026-11-05T12:30:00Z',
    2.6 * MB,
  ),
  file(
    'northwind-proposal',
    'Northwind Health proposal.pdf',
    'proposals',
    'priya',
    '2026-10-30T15:48:00Z',
    3.1 * MB,
    { collections: ['q4'] },
  ),
  file(
    'proposal-template',
    'Proposal template.docx',
    'proposals',
    'maya',
    '2026-09-18T10:05:00Z',
    0.18 * MB,
    { pinned: true },
  ),
  file(
    'kestrel-proposal',
    'Kestrel Analytics proposal.pdf',
    'q4-2026',
    'tom',
    '2026-11-09T16:05:00Z',
    2.2 * MB,
    { collections: ['q4'] },
  ),
  file(
    'atlas-proposal',
    'Atlas Robotics expansion proposal.pdf',
    'q4-2026',
    'elena',
    '2026-11-08T11:20:00Z',
    4.8 * MB,
    { collections: ['q4'], sharedWithMe: true },
  ),
  file(
    'cobalt-proposal',
    'Cobalt Security renewal proposal.pdf',
    'q4-2026',
    'jonas',
    '2026-11-04T13:02:00Z',
    1.9 * MB,
    { collections: ['q4', 'security'] },
  ),

  file(
    'juniper-msa',
    'Juniper Legal master services agreement.pdf',
    'contracts',
    'elena',
    '2026-11-04T10:12:00Z',
    0.94 * MB,
  ),
  file(
    'marlow-order',
    'Marlow & Finch order form.pdf',
    'contracts',
    'elena',
    '2026-10-26T16:40:00Z',
    0.42 * MB,
  ),
  file(
    'tidewater-nda',
    'Tidewater Energy NDA.pdf',
    'contracts',
    'leo',
    '2026-10-14T08:55:00Z',
    0.36 * MB,
  ),
  file(
    'nda-template',
    'Mutual NDA template.docx',
    'contracts',
    'elena',
    '2026-08-27T12:00:00Z',
    0.09 * MB,
    { collections: ['security'] },
  ),

  file(
    'company-overview',
    'Orbit company overview.pptx',
    'decks',
    'priya',
    '2026-11-07T13:40:00Z',
    21.6 * MB,
    { pinned: true, collections: ['onboarding'] },
  ),
  file(
    'halcyon-qbr',
    'Halcyon Freight QBR.pptx',
    'decks',
    'jonas',
    '2026-10-29T10:18:00Z',
    9.3 * MB,
  ),
  file(
    'atlas-kickoff',
    'Atlas Robotics kickoff.pptx',
    'decks',
    'nina',
    '2026-11-02T15:26:00Z',
    6.7 * MB,
    { sharedWithMe: true, collections: ['onboarding'] },
  ),

  file(
    'kestrel-call',
    'Kestrel Analytics discovery call.mp4',
    'recordings',
    'tom',
    '2026-11-10T11:02:00Z',
    312 * MB,
    { sharedWithMe: true },
  ),
  file(
    'northwind-demo',
    'Northwind Health demo.mp4',
    'recordings',
    'priya',
    '2026-11-06T17:15:00Z',
    486 * MB,
  ),
  file(
    'cobalt-call',
    'Cobalt Security pricing call.m4a',
    'recordings',
    'jonas',
    '2026-10-31T14:44:00Z',
    38 * MB,
  ),

  file(
    'soc2',
    'SOC 2 Type II report 2026.pdf',
    'security',
    'daniel',
    '2026-10-28T09:30:00Z',
    3.7 * MB,
    { collections: ['security'] },
  ),
  file(
    'cobalt-questionnaire',
    'Cobalt security questionnaire.xlsx',
    'security',
    'daniel',
    '2026-10-22T11:48:00Z',
    0.24 * MB,
    { collections: ['security'], sharedWithMe: true },
  ),
  file(
    'dpa',
    'Data processing addendum.pdf',
    'security',
    'daniel',
    '2026-09-30T10:00:00Z',
    0.51 * MB,
    { collections: ['security'] },
  ),

  file('q3-forecast', 'Q3 forecast.xlsx', null, 'priya', '2026-08-01T09:00:00Z', 0.71 * MB, {
    state: 'archived',
    putAway: '2026-10-02T10:15:00Z',
  }),
  file('pricing-2025', 'Pricing sheet 2025.pdf', null, 'maya', '2026-01-12T12:00:00Z', 0.88 * MB, {
    state: 'archived',
    putAway: '2026-09-15T08:30:00Z',
  }),
  file(
    'halcyon-draft',
    'Halcyon Freight proposal draft.docx',
    'proposals',
    'maya',
    '2026-10-20T10:30:00Z',
    0.22 * MB,
    { state: 'trashed', putAway: '2026-11-06T09:12:00Z' },
  ),
  file(
    'tidewater-notes',
    'Tidewater Energy call notes.docx',
    null,
    'leo',
    '2026-10-12T16:20:00Z',
    0.05 * MB,
    { state: 'trashed', putAway: '2026-10-28T13:40:00Z' },
  ),
];

export type SortKey = 'modified' | 'name' | 'size';
export const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'modified', label: 'Last modified' },
  { value: 'name', label: 'Name' },
  { value: 'size', label: 'Size' },
];

export const typeOptions = Object.entries(KIND_LABEL).map(([value, label]) => ({
  value,
  label: `${label}s`,
}));

/** Where the page is looking: a fixed place, or one collection (`c:` and its id). */
export type PlaceId = 'all' | 'pinned' | 'shared' | 'recent' | 'archive' | 'trash' | `c:${string}`;

export const PLACE_LABEL: Record<Exclude<PlaceId, `c:${string}`>, string> = {
  all: 'All files',
  pinned: 'Pinned',
  shared: 'Shared with me',
  recent: 'Recent',
  archive: 'Archive',
  trash: 'Trash',
};

export type View = 'list' | 'grid';
