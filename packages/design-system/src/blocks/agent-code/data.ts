import {
  type RemixiconComponentType,
  RiBarChartBoxLine,
  RiBugLine,
  RiGitPullRequestLine,
  RiListCheck3,
  RiQuillPenLine,
  RiSearchEyeLine,
} from '@remixicon/react';

import type { AgentTurn, Mode, ThreadGroup, Turn } from './model';
import type { Model } from './model-menu';
import { csvExport } from './session-data';

/*
  Tandem, an agent workspace with two modes, at Lumen Studio, which makes meeting-room hardware
  (Lumen Display, Lumen Hub) and the booking app `lumen-app`. Ines Navarro, a product engineer,
  is signed in. This block opens in Code, on the session "CSV export for bookings" (its turns
  are in `session-data.ts`); the chats and the other sessions are the ones every Tandem block
  lists, each with a question and a short answer, enough to open them.
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

/** How much Tandem may do in a repository without asking (Code). */
export const permissions = ['Ask before edits', 'Accept edits', 'Plan'];

/** The open session's context: 58K of 200K tokens, 29%, and what it is made of. */
export const context = {
  used: 58_000,
  limit: 200_000,
  parts: [
    { label: 'Files read', tokens: 24_000 },
    { label: 'Conversation', tokens: 21_000 },
    { label: 'Command output', tokens: 13_000 },
  ],
};

export const repositories = ['lumen-app', 'lumen-web', 'billing-service'];
export const branches = ['main', 'feature/bookings-csv-export', 'release/4.2'];

/** A way to start a new thread: the chip, and the words it puts in the composer. */
export type Starter = { label: string; icon: RemixiconComponentType; prompt: string };

export const starters: Record<Mode, Starter[]> = {
  chat: [
    { label: 'Draft a document', icon: RiQuillPenLine, prompt: 'Draft a one-page brief on ' },
    { label: 'Research a question', icon: RiSearchEyeLine, prompt: 'Research how ' },
    {
      label: 'Analyze a file',
      icon: RiBarChartBoxLine,
      prompt: 'Look at the attached file and tell me ',
    },
    { label: 'Plan a project', icon: RiListCheck3, prompt: 'Plan the work for ' },
  ],
  code: [
    {
      label: 'Fix a failing test',
      icon: RiBugLine,
      prompt: 'Find out why this test fails and fix it: ',
    },
    { label: 'Review a pull request', icon: RiGitPullRequestLine, prompt: 'Review pull request #' },
    { label: 'Plan a change', icon: RiListCheck3, prompt: 'Plan how to ' },
  ],
};

/* The threads: a question and a short answer each, enough to open them. */

const brief = (id: string, prompt: string, ...paragraphs: string[]): Turn[] => [
  { id: `${id}-1`, role: 'user', text: prompt },
  {
    id: `${id}-2`,
    role: 'agent',
    blocks: [
      {
        kind: 'text',
        id: `${id}-answer`,
        prose: paragraphs.map((text) => ({ kind: 'paragraph', text })),
      },
    ],
  },
];

/** A chat that waits for Ines: the agent wants a file from outside the project. */
const launchTimeline: Turn[] = [
  { id: 'timeline-1', role: 'user', text: 'Plan launch day, November 17, hour by hour.' },
  {
    id: 'timeline-2',
    role: 'agent',
    blocks: [
      {
        kind: 'reasoning',
        id: 'timeline-2-thought',
        seconds: 7,
        text: 'Launch day has fixed points: the store opens at 09:00 Pacific and the announcement goes out with it. Marketing schedules the newsletter and the social posts; their calendar is outside this project, so I have to ask before I read it.',
      },
      {
        kind: 'step',
        id: 'read-calendar',
        label: 'Read `Marketing/campaign-calendar.xlsx`',
        active: 'Reading `Marketing/campaign-calendar.xlsx`',
        result: '14 entries',
        status: 'waiting',
        approval: {
          title: 'Read a file outside this project',
          command: 'Marketing/campaign-calendar.xlsx',
          reason:
            'The campaign calendar has the newsletter and social slots for November 17. Tandem reads it and changes nothing.',
          scope: 'this project',
        },
      },
      {
        kind: 'text',
        id: 'timeline-2-answer',
        prose: [
          {
            kind: 'paragraph',
            text: 'Here is the day, in Pacific time. The newsletter and the social posts keep the slots Marketing gave them.',
          },
          {
            kind: 'list',
            items: [
              '**07:00** Last check of the store page and the trade-in form.',
              '**09:00** The store opens; the announcement and the newsletter go out.',
              '**10:30** Social posts, then replies through the day.',
              '**16:00** First numbers to the team: orders, trade-ins, support tickets.',
            ],
          },
        ],
      },
    ],
  },
];

/** The research chat, still running when it is opened. */
const hardwarePricing: Turn[] = [
  {
    id: 'pricing-1',
    role: 'user',
    text: 'How do Roomline, Meetwise and Deskhaven price their meeting-room hardware? I need it for the Hub 2 tiers.',
  },
  {
    id: 'pricing-2',
    role: 'agent',
    blocks: [
      {
        kind: 'reasoning',
        id: 'pricing-2-thought',
        seconds: 6,
        text: 'Three vendors, and what matters is the model: hardware sold once, a subscription, or both. Their pricing pages will say. I will search first, then read each vendor’s own page rather than a comparison site.',
      },
      {
        kind: 'step',
        id: 'search-web',
        label: 'Searched the web',
        active: 'Searching the web',
        result: '4 results',
        status: 'done',
        detail: {
          kind: 'results',
          items: [
            { title: 'Roomline pricing: hubs, panels and plans', source: 'roomline.example' },
            { title: 'Meetwise Room Kit: plans and pricing', source: 'meetwise.example' },
            { title: 'Deskhaven hardware store', source: 'deskhaven.example' },
            { title: 'Meeting room hardware compared, 2026', source: 'workplaceweekly.example' },
          ],
        },
      },
      {
        kind: 'steps',
        id: 'pricing-2-pages',
        label: 'Read 3 pages',
        steps: [
          {
            id: 'read-roomline',
            label: 'Read `roomline.example/pricing`',
            active: 'Reading `roomline.example/pricing`',
            status: 'done',
          },
          {
            id: 'read-meetwise',
            label: 'Read `meetwise.example/room-kit`',
            active: 'Reading `meetwise.example/room-kit`',
            status: 'done',
          },
          {
            id: 'read-deskhaven',
            label: 'Read `deskhaven.example/store`',
            active: 'Reading `deskhaven.example/store`',
            status: 'done',
          },
        ],
      },
      {
        kind: 'text',
        id: 'pricing-2-answer',
        prose: [
          {
            kind: 'paragraph',
            text: 'All three sell the hub outright and charge for software on top, so the fair comparison is the hardware plus the first year.',
          },
          {
            kind: 'list',
            items: [
              '**Roomline:** $429 a hub, then $12 a room a month.',
              '**Meetwise:** $299 a hub, sold only with the $19 a room a month plan.',
              '**Deskhaven:** $379 a hub, software included for the first year.',
            ],
          },
          {
            kind: 'paragraph',
            text: 'At $349 with no subscription, Hub 2 costs the least over a year in every case.',
          },
        ],
      },
    ],
  },
];

/** A chat whose last turn failed on a file it could not open. */
const educationDiscount: Turn[] = [
  {
    id: 'education-1',
    role: 'user',
    text: 'Turn last year’s education discount into a one-page memo for Hub 2.',
  },
  {
    id: 'education-2',
    role: 'agent',
    blocks: [
      {
        kind: 'step',
        id: 'read-memo',
        label: 'Read `education-discount-2025.docx`',
        result: 'File is locked',
        status: 'failed',
        detail: {
          kind: 'output',
          lines: [
            'Pricing/education-discount-2025.docx',
            'Locked for editing by Elena Silva since 9:12 AM',
          ],
          errors: [1],
        },
      },
      {
        kind: 'text',
        id: 'education-2-answer',
        prose: [
          {
            kind: 'paragraph',
            text: 'I could not open last year’s memo: Elena Silva has it open for editing. Ask her to close it and press Retry, or attach a copy here.',
          },
        ],
      },
    ],
  },
];

/** The subagent working on the failing E2E test of pull request #482 (Code). */
const e2eFix: Turn[] = [
  {
    id: 'e2e-1',
    role: 'user',
    text: 'Find out why “bookings export › downloads the file” times out in CI, and fix it.',
  },
  {
    id: 'e2e-2',
    role: 'agent',
    blocks: [
      {
        kind: 'reasoning',
        id: 'e2e-2-thought',
        seconds: 5,
        text: 'The test times out waiting for a download, so it is waiting for something the browser never does. The export opens a blob URL; a browser may not raise a download for that.',
      },
      {
        kind: 'step',
        id: 'read-spec',
        label: 'Read `e2e/bookings-export.spec.ts`',
        active: 'Reading `e2e/bookings-export.spec.ts`',
        result: '42 lines',
        status: 'done',
      },
      {
        kind: 'step',
        id: 'run-e2e',
        label: 'Ran `pnpm test:e2e bookings`',
        active: 'Running `pnpm test:e2e bookings`',
        result: '2 passed, 1 failed',
        status: 'failed',
        ms: 3200,
        detail: {
          kind: 'output',
          lines: [
            '$ pnpm test:e2e bookings',
            '  ✓ bookings › lists the day',
            '  ✓ bookings › filters by room',
            '  ✗ bookings export › downloads the file (30.0s)',
            '    Timeout 30000ms exceeded while waiting for event "download"',
            '      at e2e/bookings-export.spec.ts:15:27',
            '  3 tests, 1 failed',
          ],
          errors: [3, 4, 5],
        },
      },
      {
        kind: 'text',
        id: 'e2e-2-answer',
        prose: [
          {
            kind: 'paragraph',
            text: 'The test waits for a `download` event that never comes: the export opens a blob URL in a new tab instead of using a download link. Next I will change `export-csv.ts` to a link with the `download` attribute and run the test again.',
          },
        ],
      },
    ],
  },
];

/** A session that waits for Ines before it runs a command (Code). */
const vatRounding: Turn[] = [
  {
    id: 'vat-1',
    role: 'user',
    text: 'Invoice totals are off by a cent when VAT is 23%. Find it and fix it.',
  },
  {
    id: 'vat-2',
    role: 'agent',
    blocks: [
      {
        kind: 'reasoning',
        id: 'vat-2-thought',
        seconds: 4,
        text: 'A cent off at 23% points at rounding each line and then adding them up, instead of rounding the total. Before I change the query I want to see how many stored invoices would move.',
      },
      {
        kind: 'step',
        id: 'dry-run',
        label: 'Ran `pnpm db:migrate --dry-run`',
        active: 'Running `pnpm db:migrate --dry-run`',
        result: '212 rows would change',
        status: 'waiting',
        approval: {
          title: 'Run a command',
          command: 'pnpm db:migrate --dry-run',
          reason:
            'A dry run lists the invoices whose total would change. It reads the database and writes nothing.',
          scope: 'this repository',
        },
      },
      {
        kind: 'text',
        id: 'vat-2-answer',
        prose: [
          {
            kind: 'paragraph',
            text: 'The dry run shows 212 invoices off by one cent, all with three or more lines at 23%. I will round the total once in `invoice-totals.ts` and add a test with the smallest case.',
          },
        ],
      },
    ],
  },
];

export const chatGroups: ThreadGroup[] = [
  {
    id: 'hub-2-launch',
    label: 'Hub 2 launch',
    threads: [
      {
        id: 'launch-announcement',
        title: 'Launch announcement',
        turns: brief(
          'launch',
          'Draft the launch announcement for Lumen Hub 2. Use the positioning doc, and take the prices from Finance’s price list.',
          'The announcement is at version 2: it opens with the price, $349 from November 17, then the three changes as one list and the $100 trade-in until January 31.',
        ),
      },
      {
        id: 'partner-version',
        title: 'Partner version',
        child: true,
        state: 'unread',
        turns: brief(
          'partner',
          'Fork this for resellers: the same facts, but the trade-in terms first.',
          'Done, as its own document. It opens with the $100 trade-in credit and the January 31 deadline, then the three changes.',
        ),
      },
      {
        id: 'press-kit',
        title: 'Press kit checklist',
        turns: brief(
          'press',
          'What does the press kit still need before November 17?',
          'Four things are open: product photos on white, the spec sheet as a PDF, two customer quotes and the founder bio. The photos take longest; the studio delivers on November 12.',
        ),
      },
      {
        id: 'launch-timeline',
        title: 'Launch day timeline',
        state: 'needs-you',
        turns: launchTimeline,
      },
    ],
  },
  {
    id: 'customer-research',
    label: 'Customer research',
    threads: [
      {
        id: 'hardware-pricing',
        title: 'Room booking hardware pricing',
        state: 'working',
        turns: hardwarePricing,
      },
      {
        id: 'interview-themes',
        title: 'Interview themes, October',
        turns: brief(
          'interviews',
          'What came up most in the October customer interviews?',
          'Three themes, in this order: setup time (9 of 12 calls), rooms left booked but empty (7), and updates that interrupt meetings (5).',
        ),
      },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing',
    threads: [
      {
        id: 'price-tiers',
        title: 'Hub 2 price tiers',
        turns: brief(
          'tiers',
          'Sketch three price tiers for Hub 2 by number of rooms.',
          'A simple ladder holds up: $349 a hub up to 20 rooms, $329 from 21 to 100, and $309 above that, each with the same trade-in credit.',
        ),
      },
      {
        id: 'education-discount',
        title: 'Education discount memo',
        state: 'failed',
        turns: educationDiscount,
      },
    ],
  },
  {
    id: 'recents',
    label: 'Recents',
    fixed: true,
    threads: [
      {
        id: 'onboarding-email',
        title: 'Rewrite the onboarding email',
        turns: brief(
          'onboarding',
          'Make the onboarding email half as long.',
          'It is down from 240 words to 110. The three setup steps stay; the company story and the second call to action are gone.',
        ),
      },
      {
        id: 'support-tickets',
        title: 'Support tickets in Q3',
        turns: brief(
          'tickets',
          'What were the top reasons for support tickets in Q3?',
          'Pairing the camera led with 31% of tickets, then calendar sync at 22% and firmware updates at 14%.',
        ),
      },
      {
        id: 'release-notes',
        title: 'Release notes for app 4.2',
        turns: brief(
          'notes',
          'Write the release notes for Lumen app 4.2 from the changelog.',
          'Done: five lines for customers, led by the new room filter, with the fixes grouped under one heading.',
        ),
      },
    ],
  },
];

/** The session that opens with the block, and whose work the pane shows. */
export const OPEN_SESSION = 'csv-export';

export const codeGroups: ThreadGroup[] = [
  {
    id: 'lumen-app',
    label: 'lumen-app',
    threads: [
      {
        id: OPEN_SESSION,
        title: 'CSV export for bookings',
        // It waits for Ines: the mark gives way to the pull request once she has answered.
        state: 'needs-you',
        pullRequest: { number: 482, comments: 2 },
        turns: csvExport,
      },
      {
        id: 'e2e-fix',
        title: 'Fix the failing E2E test',
        child: true,
        state: 'working',
        turns: e2eFix,
      },
      {
        id: 'room-filter',
        title: 'Room filter on bookings',
        turns: brief(
          'filter',
          'Add a filter by room to the bookings page.',
          'Merged as #476. The filter sits in `bookings-toolbar.tsx` and keeps its value in the URL.',
        ),
      },
    ],
  },
  {
    id: 'lumen-web',
    label: 'lumen-web',
    threads: [
      {
        id: 'pricing-page',
        title: 'Pricing page for Hub 2',
        state: 'unread',
        turns: brief(
          'page',
          'Add Hub 2 to the pricing page, with the trade-in note.',
          'The page shows Hub 2 at $349 with the trade-in line under it. It is on `feature/hub-2-pricing`, ready for a look.',
        ),
      },
      {
        id: 'next-upgrade',
        title: 'Upgrade to Next.js 16',
        state: 'failed',
        turns: brief(
          'upgrade',
          'Upgrade lumen-web to Next.js 16.',
          'The upgrade stopped at the build: `next-image-export` does not support Next.js 16 yet. Nothing was committed. Pin it and try again, or wait for its next release.',
        ),
      },
    ],
  },
  {
    id: 'billing-service',
    label: 'billing-service',
    threads: [
      {
        id: 'vat-rounding',
        title: 'Invoice rounding for VAT',
        state: 'needs-you',
        turns: vatRounding,
      },
    ],
  },
  {
    id: 'recents',
    label: 'Recents',
    fixed: true,
    threads: [
      {
        id: 'flaky-sync',
        title: 'Flaky calendar sync test',
        turns: brief(
          'sync',
          'The calendar sync test fails about one run in ten. Why?',
          'It depends on the clock: the test books a room “in one hour” and fails when the run crosses midnight UTC. Freezing the time in the test fixes it.',
        ),
      },
      {
        id: 'rename-room',
        title: 'Rename Room to Space',
        turns: brief(
          'rename',
          'How much work is renaming Room to Space across lumen-app?',
          'It touches 86 files, most of them mechanical. The database column and the public API are the two places that need a plan.',
        ),
      },
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
      text: 'The message is short, and nothing here says which files or sources to use. Asking is quicker than guessing.',
    },
    {
      kind: 'text',
      id: `${id}-answer`,
      prose: [
        {
          kind: 'paragraph',
          text: 'I do not have enough to act on that yet. Tell me which files or sources to use and what the result should be, and I will start.',
        },
      ],
    },
  ],
});
