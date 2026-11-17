import {
  type RemixiconComponentType,
  RiBankCardLine,
  RiContactsBook3Line,
  RiFlowChart,
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
  The Lead scoring automation's code step: score-lead.js scores each new lead from 0 to 100, and
  Orbit routes a lead that scores 70 or more to sales. Version 4 was saved by Maya at 10:12 today;
  it is 10:14 now. The sample lead is Halcyon Freight, which this version scores 77.
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
  { id: 'automations', label: 'Automations', icon: RiFlowChart },
];

export const settingsLinks: NavLink[] = [
  { id: 'general', label: 'General', icon: RiSettings3Line },
  { id: 'members', label: 'Members', icon: RiTeamLine },
  { id: 'billing', label: 'Billing', icon: RiBankCardLine },
  { id: 'integrations', label: 'Integrations', icon: RiPlugLine },
  { id: 'api-keys', label: 'API keys', icon: RiKey2Line },
];

export const helpLink: NavLink = { id: 'help', label: 'Help and support', icon: RiQuestionLine };

/** "Now" for every time on the page, so the screen reads the same on any day. */
export const NOW = '2026-11-10T10:14:00Z';

export type Person = { name: string; initials: string; color?: AvatarColor };

export const PEOPLE = {
  maya: { name: account.name, initials: account.initials, color: 'orange' },
  jonas: { name: 'Jonas Weber', initials: 'JW' },
  priya: { name: 'Priya Raman', initials: 'PR' },
} satisfies Record<string, Person>;

export type PersonId = keyof typeof PEOPLE;

export type FileId = 'score-lead' | 'helpers' | 'readme';

export type ScriptFile = {
  id: FileId;
  name: string;
  /** Its folder inside the step, if any. */
  folder?: string;
  /** JavaScript is coloured and checked; Markdown is plain text. */
  language: 'js' | 'md';
};

export const FILES: ScriptFile[] = [
  { id: 'score-lead', name: 'score-lead.js', language: 'js' },
  { id: 'helpers', name: 'helpers.js', folder: 'lib', language: 'js' },
  { id: 'readme', name: 'README.md', language: 'md' },
];

export const fileById = (id: FileId) => FILES.find((file) => file.id === id)!;

export type Sources = Record<FileId, string>;

const SCORE_LEAD = `// Scores a new lead from 0 to 100. Orbit runs this step in
// Lead scoring and sends leads that score 70 or more to sales.
import { clamp, daysSince } from './lib/helpers.js';

const TARGET_INDUSTRIES = ['Logistics', 'Healthcare', 'Energy'];

export default function scoreLead(lead, { log }) {
  let score = 0;
  const region = lead.country === 'US' ? 'na' : 'intl';

  if (lead.employees >= 200) score += 25;
  else if (lead.employees >= 50) score += 15;

  if (TARGET_INDUSTRIES.includes(lead.industry)) score += 20;
  if (lead.source === 'Referral') score += 30;

  // Visits show intent; a lead gone quiet cools off.
  score += Math.min(lead.visits * 2, 20);
  if (daysSince(lead.lastSeen) > 30) score -= 10;

  log(\`Scored \${lead.company}: \${score}\`);
  return clamp(score, 0, 100);
}
`;

const HELPERS = `// Small helpers shared by the steps in Lead scoring.
const DAY = 24 * 60 * 60 * 1000;

/** Keeps a number between two bounds. */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Whole days between an ISO date and now. */
export function daysSince(iso) {
  return Math.floor((Date.now() - Date.parse(iso)) / DAY);
}
`;

const README = `# Lead scoring

Scores every new lead from 0 to 100 when it enters Orbit.
Leads that score 70 or more go to the sales queue; the rest
stay in nurture.

## Files

- score-lead.js: the step Orbit runs for each lead.
- lib/helpers.js: helpers shared by the steps.

## Testing

Run test scores the sample lead, Halcyon Freight.
Change the sample in the workflow's test data.
`;

export type Version = {
  number: number;
  /** ISO date and time it was saved. */
  savedAt: string;
  by: PersonId;
  /** Set when the version is an older one brought back. */
  restoredFrom?: number;
  sources: Sources;
};

const v4: Sources = { 'score-lead': SCORE_LEAD, helpers: HELPERS, readme: README };
const v3: Sources = { ...v4, 'score-lead': SCORE_LEAD.replace('score += 30', 'score += 25') };
const v2: Sources = {
  ...v3,
  'score-lead': v3['score-lead'].replace('  if (daysSince(lead.lastSeen) > 30) score -= 10;\n', ''),
};
const v1: Sources = {
  ...v2,
  'score-lead': v2['score-lead'].replace("'Logistics', 'Healthcare', 'Energy'", "'Logistics'"),
};

/** Newest first, as the history menu lists them. */
export const VERSIONS: Version[] = [
  { number: 4, savedAt: '2026-11-10T10:12:00Z', by: 'maya', sources: v4 },
  { number: 3, savedAt: '2026-11-09T16:40:00Z', by: 'jonas', sources: v3 },
  { number: 2, savedAt: '2026-11-06T11:05:00Z', by: 'priya', sources: v2 },
  { number: 1, savedAt: '2026-11-02T09:30:00Z', by: 'maya', sources: v1 },
];

/** The record Run test scores: one of the workspace's real leads, as Orbit passes it in. */
export const SAMPLE_LEAD = {
  company: 'Halcyon Freight',
  employees: 120,
  industry: 'Logistics',
  country: 'US',
  source: 'Referral',
  visits: 6,
  lastSeen: '2026-11-08',
};
