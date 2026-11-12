import {
  type RemixiconComponentType,
  RiBarChartBoxLine,
  RiBugLine,
  RiGitPullRequestLine,
  RiListCheck3,
  RiQuillPenLine,
  RiSearchEyeLine,
} from '@remixicon/react';

import type { AgentTurn, Context, Mode, Model, Thread, ThreadGroup, Turn } from './model';

/*
  The canon: the one world every agent block shows. Tandem, an agent workspace with two modes, at
  Lumen Studio, which makes meeting-room hardware (Lumen Display, Lumen Hub) and the booking app
  `lumen-app`. Ines Navarro, a product engineer, is signed in. The sidebar lists the same chats
  and sessions in every block, with the same names and states; each carries a short transcript,
  enough to open it. A block puts its own thread in with `withThread` (its full turns, and the
  mark its screen implies) and keeps everything else as it is here.
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
/** Files in the workspace, by name: what Add files puts on the composer's tray, one after another. */
export const files = ['hub-2-positioning.md', 'price-list-2026.csv', 'bookings-export.spec.ts'];

/** A session's context before much has happened: 58K of 200K tokens, 29%, and what it is made of. */
export const context: Context = {
  used: 58_000,
  limit: 200_000,
  parts: [
    { label: 'Files read', tokens: 24_000 },
    { label: 'Conversation', tokens: 21_000 },
    { label: 'Command output', tokens: 13_000 },
  ],
};

/* The other threads: a question and a short answer each, enough to open them. */

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
    text: 'How do Roomline, Meetwise and Deskhaven price their meeting-room hardware?',
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
        text: 'The test passes on my machine and times out in CI, so it is waiting for something the CI browser never does. The export opens a blob URL; a headless browser may not raise a download for that.',
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
        pending: 'Run `pnpm db:migrate --dry-run`',
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

/** A session that waits for Ines with a question: the fix can go two ways (Code). */
const flakySync: Turn[] = [
  {
    id: 'sync-1',
    role: 'user',
    text: 'The calendar sync test fails about one run in ten. Find out why and fix it.',
  },
  {
    id: 'sync-2',
    role: 'agent',
    blocks: [
      {
        kind: 'step',
        id: 'run-sync',
        label: 'Ran `pnpm test calendar-sync` 20 times',
        active: 'Running `pnpm test calendar-sync` 20 times',
        result: '2 of 20 failed',
        status: 'done',
      },
      {
        kind: 'text',
        id: 'sync-2-finding',
        prose: [
          {
            kind: 'paragraph',
            text: 'Found it: the test books a room “in one hour” and fails when the run crosses midnight UTC. Freezing the clock fixes it, and there are two places to do that.',
          },
        ],
      },
      {
        kind: 'question',
        id: 'sync-2-question',
        title: 'Freeze the clock in this test only, or in the setup for every test?',
        options: [
          {
            value: 'one',
            label: 'This test only',
            description: 'One line in the test file. Other tests keep the real clock.',
          },
          {
            value: 'all',
            label: 'Every test',
            description: 'In the test setup. No test depends on the hour it runs at again.',
          },
        ],
      },
    ],
  },
];

/** What Tandem does once a question is answered, whichever way. */
const decided = (id: string): AgentTurn => ({
  id,
  role: 'agent',
  blocks: [
    {
      kind: 'step',
      id: `${id}-edit`,
      label: 'Edited 1 file',
      active: 'Editing 1 file',
      result: '+3 −1',
      status: 'done',
    },
    {
      kind: 'text',
      id: `${id}-answer`,
      prose: [
        {
          kind: 'paragraph',
          text: 'Done, the way you chose. The clock is frozen, and the test passed 20 runs out of 20.',
        },
      ],
    },
  ],
});

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
          'Draft the launch announcement for Lumen Hub 2.',
          'The announcement is written, in two versions. The second is a third shorter and opens with the price: $349, out on November 17.',
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

export const codeGroups: ThreadGroup[] = [
  {
    id: 'lumen-app',
    label: 'lumen-app',
    threads: [
      {
        id: 'csv-export',
        title: 'CSV export for bookings',
        pullRequest: { number: 482, comments: 2 },
        turns: brief(
          'csv',
          'Add a CSV export to the bookings table.',
          'The export is on `feature/bookings-csv-export` as draft pull request #482: five files, +148 −7. The unit tests pass, 14 of 14.',
          'Two things are open: the E2E test “bookings export › downloads the file” times out, and Tom Becker left two comments.',
        ),
      },
      {
        id: 'e2e-fix',
        title: 'Debug the E2E timeout',
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
      { id: 'flaky-sync', title: 'Flaky calendar sync test', state: 'needs-you', turns: flakySync },
      {
        id: 'rename-room',
        title: 'Rename Room to Space',
        state: 'paused',
        turns: brief(
          'rename',
          'Rename Room to Space across lumen-app.',
          'Paused at the usage limit, 31 of 86 files in. The components and their tests are renamed; the database column and the public API are next, and they need your word before I touch them. I go on at 4:00 PM.',
        ),
      },
    ],
  },
];

/** The mode's groups with one thread changed: a block's own thread, in its place in the canon. */
export const withThread = (
  groups: ThreadGroup[],
  id: string,
  change: (thread: Thread) => Thread,
): ThreadGroup[] =>
  groups.map((group) => ({
    ...group,
    threads: group.threads.map((thread) => (thread.id === id ? change(thread) : thread)),
  }));

const QUESTIONS = [flakySync].flatMap((turns) =>
  turns.flatMap((turn) =>
    turn.role === 'agent'
      ? turn.blocks.flatMap((block) => (block.kind === 'question' ? block.options : []))
      : [],
  ),
);

/**
 * What Tandem does about a message this sample has no turn for: it goes on when the message
 * answers one of its questions, and otherwise asks for more to go on.
 */
export const fallback = (id: string, text = ''): AgentTurn =>
  QUESTIONS.some((option) => option.label === text)
    ? decided(id)
    : {
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
      };
