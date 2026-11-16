import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Fill,
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
  RiTeamLine,
} from '@remixicon/react';

/*
  Maya imports the customers her team gathered this quarter from a CSV file, the way the help
  article "Import customers from a CSV file" explains it: the same columns (only `name` is
  required, `domain` finds duplicates), the same limits (5,000 rows, 10 MB). Today is
  10 November 2026; Lumen Studio has 1,284 customers in Orbit before the import. The file is
  simulated: whatever is chosen stands for customers-q4.csv, 248 rows, read as below.
*/

/** The product is Orbit; the workspace using it is Lumen Studio. */
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
  {
    id: 'customers',
    label: 'Customers',
    icon: RiContactsBook3Line,
    activeIcon: RiContactsBook3Fill,
  },
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

export const TODAY = '2026-11-10';

/** What one import takes, as the help article states it. */
export const LIMITS = { rows: 5000, megabytes: 10 };

/** The help article this screen follows. */
export const guide = { title: 'Import customers from a CSV file', href: '#import-customers-csv' };

/** The customers in Orbit before this import. */
export const CUSTOMERS_BEFORE = 1284;

/** The Orbit fields a column can fill, named after the columns the article lists. */
export const fields = [
  { value: 'name', label: 'Name', column: 'name', required: true, holds: 'The company’s name' },
  { value: 'domain', label: 'Domain', column: 'domain', holds: 'Its website, to find duplicates' },
  {
    value: 'owner_email',
    label: 'Owner e-mail',
    column: 'owner_email',
    holds: 'The teammate who owns it',
  },
  { value: 'stage', label: 'Stage', column: 'stage', holds: 'Lead, Prospect, Customer or Churned' },
  {
    value: 'annual_value',
    label: 'Annual value',
    column: 'annual_value',
    holds: 'Expected revenue a year, in dollars',
  },
];

/** The choice that leaves a column out. */
export const SKIP = 'skip';

/** The file as Orbit read it. */
export const file = { name: 'customers-q4.csv', rows: 248, size: '38 KB' };

export type FileColumn = {
  id: string;
  /** The column's name in the file's first row. */
  header: string;
  /** Its value in the first customer's row. */
  sample: string;
  /** The field Orbit chose: the same name matches; an ID column is left out; else nothing. */
  match: string | null;
  /** Why Orbit chose as it did, in a few words. */
  note?: string;
};

export const fileColumns: FileColumn[] = [
  { id: 'company', header: 'Company', sample: 'Halcyon Freight', match: null },
  {
    id: 'domain',
    header: 'domain',
    sample: 'halcyonfreight.com',
    match: 'domain',
    note: 'Matched by name',
  },
  {
    id: 'owner_email',
    header: 'owner_email',
    sample: 'jonas@lumenstudio.co',
    match: 'owner_email',
    note: 'Matched by name',
  },
  {
    id: 'record_id',
    header: 'Record ID',
    sample: '40118',
    match: SKIP,
    note: 'Orbit gives customers its own IDs',
  },
];

/** What the rows come to: new companies, ones Orbit has by domain, and rows it cannot read. */
export const counts = { fresh: 212, existing: 31, invalid: 5 };

export type Duplicates = 'update' | 'skip' | 'create';

/** What happens to the 31 rows whose domain Orbit already has. */
export const duplicateChoices: { value: Duplicates; label: string; description: string }[] = [
  {
    value: 'update',
    label: 'Update them',
    description: 'The file’s values replace the ones in Orbit. This can’t be undone.',
  },
  {
    value: 'skip',
    label: 'Skip them',
    description: 'The customers in Orbit stay as they are.',
  },
  {
    value: 'create',
    label: 'Create them anyway',
    description: 'Adds a second customer with the same domain.',
  },
];

/** What an import does with each kind of row, for the figures and the button. */
export function outcome(duplicates: Duplicates) {
  const { fresh, existing, invalid } = counts;
  return {
    added: duplicates === 'create' ? fresh + existing : fresh,
    updated: duplicates === 'update' ? existing : 0,
    skipped: duplicates === 'skip' ? invalid + existing : invalid,
  };
}

export type SkippedRow = {
  /** The row's line in the file, counting the column names as line 1. */
  row: number;
  name: string;
  domain: string;
  reason: string;
};

/** The rows Orbit cannot read, and why. A row without a name is not a customer. */
export const skippedRows: SkippedRow[] = [
  { row: 17, name: '', domain: 'brightline.io', reason: 'No name' },
  {
    row: 42,
    name: 'Orchid Labs',
    domain: 'orchidlabs.com',
    reason: 'Owner e-mail is incomplete',
  },
  { row: 88, name: '', domain: 'westgate-logistics.com', reason: 'No name' },
  {
    row: 131,
    name: 'Fernhill Dental',
    domain: 'fernhilldental.co.uk',
    reason: 'Owner e-mail is incomplete',
  },
  { row: 203, name: '', domain: 'sablepoint.com', reason: 'No name' },
];

export type PastImport = {
  id: string;
  file: string;
  /** The calendar day it ran. */
  date: string;
  by: string;
  added: number;
  updated: number;
  skipped: number;
};

/** The imports before this one, newest first. */
export const pastImports: PastImport[] = [
  {
    id: 'q3',
    file: 'customers-q3.csv',
    date: '2026-08-04',
    by: 'Jonas Weber',
    added: 186,
    updated: 12,
    skipped: 3,
  },
  {
    id: 'hubspot',
    file: 'hubspot-companies.csv',
    date: '2026-05-21',
    by: 'Maya Okafor',
    added: 1040,
    updated: 0,
    skipped: 14,
  },
];

/** The first lines of the sample file: every column, one customer. */
export const sampleCsv = [
  fields.map((field) => field.column),
  ['Halcyon Freight', 'halcyonfreight.com', 'jonas@lumenstudio.co', 'Customer', '48000'],
];

/** The customers the signed-in person owns, for an export of only hers. */
export const OWNED_BY_ME = 162;

/**
 * A few of the customers an export writes, in the columns an import reads, so a file can go out,
 * be edited and come back in. A real export writes every customer chosen.
 */
export const exportSample = [
  ['Halcyon Freight', 'halcyonfreight.com', 'jonas@lumenstudio.co', 'Customer', 48000],
  ['Northwind Health', 'northwindhealth.com', 'priya@lumenstudio.co', 'Customer', 96000],
  ['Kestrel Analytics', 'kestrelanalytics.io', 'maya@lumenstudio.co', 'Prospect', 36000],
  ['Atlas Robotics', 'atlasrobotics.com', 'tom@lumenstudio.co', 'Customer', 72000],
  ['Cobalt Security', 'cobaltsecurity.com', 'elena@lumenstudio.co', 'Lead', 24000],
  ['Juniper Legal', 'juniperlegal.co.uk', 'daniel@lumenstudio.co', 'Customer', 30000],
  ['Marlow & Finch', 'marlowfinch.com', 'maya@lumenstudio.co', 'Customer', 54000],
  ['Tidewater Energy', 'tidewaterenergy.com', 'leo@lumenstudio.co', 'Churned', 0],
];
