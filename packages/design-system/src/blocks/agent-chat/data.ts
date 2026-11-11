import {
  type RemixiconComponentType,
  RiBarChartBoxLine,
  RiBugLine,
  RiGitPullRequestLine,
  RiListCheck3,
  RiQuillPenLine,
  RiSearchEyeLine,
} from '@remixicon/react';

import type { AgentTurn, Mode, Prose, ThreadGroup, Turn } from './model';
import type { Model } from './model-menu';

/*
  Tandem, an agent workspace with two modes, at Lumen Studio, which makes meeting-room hardware
  (Lumen Display, Lumen Hub) and the booking app `lumen-app`. Ines Navarro, a product engineer,
  is signed in. The open chat is "Launch announcement" in the Hub 2 launch project: she asked for
  the Lumen Hub 2 announcement, Tandem read two files (one outside the project, after she allowed
  it), wrote the document, and made a second version after her next message. Every figure agrees
  with the files Tandem read: $349, out on November 17, 2026, $100 trade-in until January 31.
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

/* The document Tandem wrote in the open chat, as its two versions. */

const versionOne: Prose[] = [
  { kind: 'title', text: 'Introducing Lumen Hub 2' },
  {
    kind: 'paragraph',
    text: 'For three years the first Lumen Hub has been the quiet box behind thousands of meeting rooms. Today we are introducing its successor. Lumen Hub 2 connects the display, the camera and the door panel through a single cable, and it sets a room up in less time than it takes to book one.',
  },
  { kind: 'heading', text: 'What is new' },
  {
    kind: 'paragraph',
    text: 'Setting up a room used to mean three cables and an afternoon. Hub 2 needs one USB-C cable to the display and finds the camera and the microphones on its own. In the October pilot the median room was ready in nine minutes.',
  },
  {
    kind: 'paragraph',
    text: 'The room now knows its own calendar. Hub 2 shows the next booking on the door panel, starts the call when the first person walks in, and frees the room when nobody has shown up after ten minutes.',
  },
  {
    kind: 'paragraph',
    text: 'It is also less to look after. Updates install overnight, and IT sees every room on one page in the Lumen app instead of walking the floor.',
  },
  { kind: 'heading', text: 'Price and availability' },
  {
    kind: 'paragraph',
    text: 'Lumen Hub 2 costs $349 and is out on November 17, 2026. Teams with a first-generation Hub can trade it in for $100 off until January 31, 2027. Order at lumenstudio.example/hub-2.',
  },
];

const versionTwo: Prose[] = [
  { kind: 'title', text: 'Lumen Hub 2: every room on one cable, from $349' },
  {
    kind: 'paragraph',
    text: 'Lumen Hub 2 is out on November 17, 2026 for $349, $50 less than the first Hub. It connects the display, the camera and the door panel through a single cable, and the median room in our pilot was ready in nine minutes.',
  },
  { kind: 'heading', text: 'What is new' },
  {
    kind: 'list',
    items: [
      '**One cable.** USB-C to the display; Hub 2 finds the camera and the microphones on its own.',
      '**A room that knows its calendar.** It shows the next booking on the door panel, starts the call when people walk in, and frees the room after ten minutes of nobody.',
      '**Less to look after.** Updates install overnight, and IT sees every room on one page in the Lumen app.',
    ],
  },
  { kind: 'heading', text: 'Trade-in' },
  {
    kind: 'paragraph',
    text: 'Teams with a first-generation Hub get $100 off until January 31, 2027. Order at lumenstudio.example/hub-2.',
  },
];

/**
 * The document and its versions. A version is there once the step that wrote it has run; the
 * first came with the first answer. `card` is the name its card block in the transcript carries.
 */
export const launchDocument = {
  title: 'Lumen Hub 2 launch announcement',
  versions: [
    { card: 'version-1', step: undefined, prose: versionOne },
    { card: 'version-2', step: 'edit-document', prose: versionTwo },
  ],
};

/* The open chat. */

const launchAnnouncement: Turn[] = [
  {
    id: 'launch-1',
    role: 'user',
    text: 'Draft the launch announcement for Lumen Hub 2. Use the positioning doc, and take the prices from Finance’s price list.',
  },
  {
    id: 'launch-2',
    role: 'agent',
    blocks: [
      {
        kind: 'reasoning',
        id: 'launch-2-thought',
        seconds: 12,
        text: 'An announcement needs a promise, the proof and the price. The positioning doc should have the first two. The price list has the third, but it lives with Finance, outside this project, so I have to ask before I read it. I will open with the story of the first Hub, cover the three changes, and close with price and availability.',
      },
      {
        kind: 'steps',
        id: 'launch-2-files',
        label: 'Read 2 files',
        steps: [
          {
            id: 'read-positioning',
            label: 'Read `hub-2-positioning.md`',
            active: 'Reading `hub-2-positioning.md`',
            result: '31 lines',
            status: 'done',
            detail: {
              kind: 'output',
              lines: [
                '# Lumen Hub 2 positioning',
                'Audience: IT and workplace leads, 20 to 500 rooms',
                'Promise: every room ready in minutes, on one cable',
                'Proof: 9 min median setup in the October pilot, 41 rooms',
              ],
            },
          },
          {
            id: 'read-prices',
            label: 'Read `Finance/price-list-2026.csv`',
            active: 'Reading `Finance/price-list-2026.csv`',
            result: '3 rows',
            status: 'done',
            approval: {
              title: 'Read a file outside this project',
              command: 'Finance/price-list-2026.csv',
              reason:
                'The price list has the launch price and the trade-in credit. Tandem reads it and changes nothing.',
              scope: 'this project',
              answer: 'once',
            },
            detail: {
              kind: 'output',
              lines: [
                'sku,name,price_usd,available',
                'LH2-STD,Lumen Hub 2,349,2026-11-17',
                'LH1-STD,Lumen Hub,399,2023-09-12',
                'LH2-TRADE,Hub 2 trade-in credit,-100,2026-11-17',
              ],
            },
          },
        ],
      },
      {
        kind: 'text',
        id: 'launch-2-answer',
        prose: [
          {
            kind: 'paragraph',
            text: 'Here is a first draft, built on `hub-2-positioning.md`: the story of the first Hub, the three changes, then the price and the trade-in.',
          },
        ],
      },
      { kind: 'card', id: 'launch-2-document', card: 'version-1' },
    ],
  },
  {
    id: 'launch-3',
    role: 'user',
    text: 'Shorter, and lead with the price. Then give me the launch block for the site config.',
  },
  {
    id: 'launch-4',
    role: 'agent',
    blocks: [
      {
        kind: 'reasoning',
        id: 'launch-4-thought',
        seconds: 4,
        text: 'She wants it tighter, with the price first. $349 against $399 for the first Hub is the strongest line, so that opens it. The three feature paragraphs can become one list, and the story of the first Hub can go. The site banner reads its dates from the launch block in the site config.',
      },
      {
        kind: 'step',
        id: 'edit-document',
        label: 'Edited the document',
        active: 'Editing the document',
        result: 'Version 2',
        status: 'done',
        ms: 2600,
        detail: {
          kind: 'diff',
          lines: [
            '-Introducing Lumen Hub 2',
            '+Lumen Hub 2: every room on one cable, from $349',
            ' ',
            '-For three years the first Lumen Hub has been the quiet box behind thousands of meeting rooms. Today we are introducing its successor.',
            '+Lumen Hub 2 is out on November 17, 2026 for $349, $50 less than the first Hub.',
          ],
        },
      },
      {
        kind: 'text',
        id: 'launch-4-answer',
        prose: [
          {
            kind: 'paragraph',
            text: 'Version 2 is a third shorter and opens with the price.',
          },
          {
            kind: 'list',
            items: [
              'The first line is the price and the date: **$349**, out on November 17.',
              'The three feature paragraphs are now one list.',
              'The story of the first Hub is gone.',
            ],
          },
          { kind: 'paragraph', text: 'For the banner, add this block to `site.config.json`:' },
          {
            kind: 'code',
            language: 'JSON',
            lines: [
              '"launch": {',
              '  "startsAt": "2026-11-17T09:00:00-08:00",',
              '  "banner": "Lumen Hub 2 is here, from $349"',
              '}',
            ],
          },
        ],
      },
      { kind: 'card', id: 'launch-4-document', card: 'version-2' },
    ],
  },
];

/** The chat that opens with the block, and whose document the pane shows. */
export const OPEN_CHAT = 'launch-announcement';

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
      { id: OPEN_CHAT, title: 'Launch announcement', turns: launchAnnouncement },
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
