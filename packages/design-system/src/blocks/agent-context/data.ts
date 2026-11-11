import {
  type RemixiconComponentType,
  RiBugLine,
  RiChat3Line,
  RiGitRepositoryLine,
} from '@remixicon/react';

import type { AgentTurn, Thread, ThreadGroup, Turn } from './model';
import type { Model } from './model-menu';

/*
  Tandem at Lumen Studio, in Code mode; Ines Navarro is signed in. The open session is "CSV export
  for bookings" in `lumen-app`, at rest: the export is written, the unit tests pass and draft pull
  request #482 is open. The block is about what surrounds that session: how full its context is,
  the connectors it can reach, what it produced. The sidebar's lists are the ones every agent
  block shows; the other threads are listed, not opened, so they carry no turns. Every figure
  agrees with the Code canon: five files, +148 −7, 14 tests in 3.2s, #482.
*/

export const product = 'Tandem';
export const workspace = 'Lumen Studio';
export const account = { name: 'Ines Navarro', email: 'ines@lumenstudio.co', initials: 'IN' };

export const models: Model[] = [
  { id: 'pro', name: 'Tandem Pro', note: 'Everyday work' },
  { id: 'fast', name: 'Tandem Fast', note: 'Quick answers, lighter reasoning' },
  { id: 'max', name: 'Tandem Max', note: 'Long, hard problems' },
];

export const efforts = ['Low', 'Medium', 'High'];

/** How much Tandem may do in a repository without asking. */
export const permissions = ['Ask before edits', 'Accept edits', 'Plan'];

/* The session's environment, as the popover shows it. */

/**
 * What fills the context window, in tokens. Compacting replaces the earlier messages and tool
 * results with a summary (`compacted` is what is left of them); files and instructions stay.
 */
export const context = {
  window: 200_000,
  parts: [
    { label: 'Messages', tokens: 21_400, compacted: 4_200 },
    { label: 'Tools', tokens: 18_600, compacted: 2_600 },
    { label: 'Files', tokens: 12_200 },
    { label: 'Instructions', tokens: 5_800 },
  ],
};

export type Connector = {
  id: string;
  /** Named for what it is, as the Checks pane says "the git host". */
  name: string;
  icon: RemixiconComponentType;
  /** `expired`: its sign-in ran out, so the session cannot reach it until it is reconnected. */
  state: 'connected' | 'expired';
};

export const connectors: Connector[] = [
  { id: 'git', name: 'Git host', icon: RiGitRepositoryLine, state: 'connected' },
  { id: 'issues', name: 'Issue tracker', icon: RiBugLine, state: 'connected' },
  { id: 'chat', name: 'Team chat', icon: RiChat3Line, state: 'expired' },
];

/** A file the session wrote or changed; nothing removed in a new file. */
export type ChangedFile = { path: string; added: number; removed: number };

export const changedFiles: ChangedFile[] = [
  { path: 'src/features/bookings/export-csv.ts', added: 64, removed: 0 },
  { path: 'src/features/bookings/export-csv.test.ts', added: 48, removed: 0 },
  { path: 'src/features/bookings/bookings-table.tsx', added: 18, removed: 4 },
  { path: 'src/features/bookings/bookings-toolbar.tsx', added: 12, removed: 1 },
  { path: 'src/lib/format-date.ts', added: 6, removed: 2 },
];

/** The document the session wrote beside the code: the file's format, for whoever reads it. */
export const documents = [{ id: 'csv-format', title: 'Bookings CSV format' }];

export const pullRequests = [
  { number: 482, title: 'Add CSV export to the bookings table', state: 'Draft' },
];

/* The open session: short, and at rest. */

const csvExport: Turn[] = [
  { id: 'csv-1', role: 'user', text: 'Add a CSV export to the bookings table.' },
  {
    id: 'csv-2',
    role: 'agent',
    blocks: [
      {
        kind: 'reasoning',
        id: 'csv-2-thought',
        seconds: 9,
        text: 'The table already has the rows it shows, so the export can be built from them: one function that turns bookings into CSV, and a button in the toolbar. Start times should be UTC ISO strings, so the file reads the same in every time zone. The format is worth writing down for whoever opens the file.',
      },
      {
        kind: 'steps',
        id: 'csv-2-files',
        label: 'Edited 5 files',
        steps: [
          {
            id: 'write-export',
            label: 'Wrote `export-csv.ts`',
            active: 'Writing `export-csv.ts`',
            result: '+64',
            status: 'done',
          },
          {
            id: 'write-test',
            label: 'Wrote `export-csv.test.ts`',
            active: 'Writing `export-csv.test.ts`',
            result: '+48',
            status: 'done',
          },
          {
            id: 'edit-table',
            label: 'Edited `bookings-table.tsx`',
            active: 'Editing `bookings-table.tsx`',
            result: '+18 −4',
            status: 'done',
          },
          {
            id: 'edit-toolbar',
            label: 'Edited `bookings-toolbar.tsx`',
            active: 'Editing `bookings-toolbar.tsx`',
            result: '+12 −1',
            status: 'done',
          },
          {
            id: 'edit-format',
            label: 'Edited `format-date.ts`',
            active: 'Editing `format-date.ts`',
            result: '+6 −2',
            status: 'done',
          },
        ],
      },
      {
        kind: 'step',
        id: 'run-tests',
        label: 'Ran `pnpm test bookings`',
        active: 'Running `pnpm test bookings`',
        result: '14 passed · 3.2s',
        status: 'done',
        ms: 2400,
        detail: {
          kind: 'output',
          lines: [
            '$ pnpm test bookings',
            ' ✓ bookings-table.test.tsx (6)',
            ' ✓ bookings-toolbar.test.tsx (3)',
            ' ✓ export-csv.test.ts (5)',
            ' 14 passed (3.2s)',
          ],
        },
      },
      {
        kind: 'step',
        id: 'write-document',
        label: 'Wrote the document **Bookings CSV format**',
        active: 'Writing the document **Bookings CSV format**',
        status: 'done',
      },
      {
        kind: 'step',
        id: 'open-pull-request',
        label: 'Opened pull request #482',
        active: 'Opening a pull request',
        result: 'Draft',
        status: 'done',
      },
      {
        kind: 'text',
        id: 'csv-2-answer',
        prose: [
          {
            kind: 'paragraph',
            text: 'The export is on `feature/bookings-csv-export` as draft pull request #482: five files, +148 −7. The unit tests pass, 14 of 14, and the columns and the UTC dates are written down in **Bookings CSV format**.',
          },
          {
            kind: 'paragraph',
            text: 'Two things are open: the E2E test “bookings export › downloads the file” times out, and Tom Becker left two comments.',
          },
        ],
      },
    ],
  },
];

/** The session that opens with the block. */
export const OPEN_SESSION = 'csv-export';

const thread = (id: string, title: string, more?: Partial<Thread>): Thread => ({
  id,
  title,
  turns: [],
  ...more,
});

export const chatGroups: ThreadGroup[] = [
  {
    id: 'hub-2-launch',
    label: 'Hub 2 launch',
    threads: [
      thread('launch-announcement', 'Launch announcement'),
      thread('partner-version', 'Partner version', { child: true, state: 'unread' }),
      thread('press-kit', 'Press kit checklist'),
      thread('launch-timeline', 'Launch day timeline', { state: 'needs-you' }),
    ],
  },
  {
    id: 'customer-research',
    label: 'Customer research',
    threads: [
      thread('hardware-pricing', 'Room booking hardware pricing', { state: 'working' }),
      thread('interview-themes', 'Interview themes, October'),
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing',
    threads: [
      thread('price-tiers', 'Hub 2 price tiers'),
      thread('education-discount', 'Education discount memo', { state: 'failed' }),
    ],
  },
  {
    id: 'recents',
    label: 'Recents',
    fixed: true,
    threads: [
      thread('onboarding-email', 'Rewrite the onboarding email'),
      thread('support-tickets', 'Support tickets in Q3'),
      thread('release-notes', 'Release notes for app 4.2'),
    ],
  },
];

export const codeGroups: ThreadGroup[] = [
  {
    id: 'lumen-app',
    label: 'lumen-app',
    threads: [
      thread(OPEN_SESSION, 'CSV export for bookings', {
        pullRequest: { number: 482, comments: 2 },
        turns: csvExport,
      }),
      thread('e2e-fix', 'Fix the failing E2E test', { child: true, state: 'working' }),
      thread('room-filter', 'Room filter on bookings'),
    ],
  },
  {
    id: 'lumen-web',
    label: 'lumen-web',
    threads: [
      thread('pricing-page', 'Pricing page for Hub 2', { state: 'unread' }),
      thread('next-upgrade', 'Upgrade to Next.js 16', { state: 'failed' }),
    ],
  },
  {
    id: 'billing-service',
    label: 'billing-service',
    threads: [thread('vat-rounding', 'Invoice rounding for VAT', { state: 'needs-you' })],
  },
  {
    id: 'recents',
    label: 'Recents',
    fixed: true,
    threads: [
      thread('flaky-sync', 'Flaky calendar sync test'),
      thread('rename-room', 'Rename Room to Space'),
    ],
  },
];

/** What Tandem says to anything this sample has no answer for. */
export const fallback = (id: string): AgentTurn => ({
  id,
  role: 'agent',
  blocks: [
    {
      kind: 'reasoning',
      id: `${id}-thought`,
      seconds: 2,
      text: 'The message is short, and nothing here says which files to touch. Asking is quicker than guessing.',
    },
    {
      kind: 'text',
      id: `${id}-answer`,
      prose: [
        {
          kind: 'paragraph',
          text: 'I do not have enough to act on that yet. Tell me which files to change and what the result should be, and I will start.',
        },
      ],
    },
  ],
});
