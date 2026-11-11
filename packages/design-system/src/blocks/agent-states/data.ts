import type { AgentTurn, Block, Step, Thread, ThreadGroup, ThreadState, Turn } from './model';
import type { Model } from './model-menu';
import { playTurn } from './run';

/*
  Tandem in Code mode at Lumen Studio, Ines Navarro signed in. One session, "CSV export for
  bookings" in `lumen-app` (draft pull request #482), at eight moments it has to handle. Every
  scene starts from the same first exchange (the export itself); then Ines asks for Tom Becker's
  two review comments to be handled, and the scene stops that turn at one clear point. `resumed`
  is the turn whole, for the way out to play from where it stopped. It is 1:46 PM on
  November 10, 2026; the usage limit resets at 4:00 PM.
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

/** The usage limit: when it resets, and the model that can go on meanwhile. */
export const limit = { resetsIn: '2 hours 14 minutes', resetsAt: '4:00 PM', fallback: models[1] };

/** The connector that lost its access, and the issue the step wanted from it. */
export const connector = { name: 'Tasklane', issue: 'LUM-2291', expired: 'November 8' };

/** How full the context is, in percent, before compacting. */
export const contextUsed = 92;

/* The session's first exchange, the same in every scene. */

const step = (id: string, label: string, result: string, more?: Partial<Step>): Step => ({
  id,
  label,
  active: label
    .replace(/^Read/, 'Reading')
    .replace(/^Edited/, 'Editing')
    .replace(/^Ran/, 'Running')
    .replace(/^Replied/, 'Replying'),
  result,
  status: 'done',
  ...more,
});

const paragraph = (id: string, ...texts: string[]): Block => ({
  kind: 'text',
  id,
  prose: texts.map((text) => ({ kind: 'paragraph', text })),
});

const first: Turn[] = [
  { id: 'csv-ask', role: 'user', text: 'Add a CSV export to the bookings table.' },
  {
    id: 'csv',
    role: 'agent',
    blocks: [
      {
        kind: 'reasoning',
        id: 'csv-thought',
        seconds: 12,
        text: 'The table already has the rows it shows, so the export can be built from them on the client. Dates need care: the page shows local time, and a file should not depend on who opens it.',
      },
      {
        kind: 'steps',
        id: 'csv-read',
        label: 'Read 3 files',
        steps: [
          step('csv-read-table', 'Read `src/features/bookings/bookings-table.tsx`', '212 lines'),
          step('csv-read-toolbar', 'Read `src/features/bookings/bookings-toolbar.tsx`', '88 lines'),
          step('csv-read-date', 'Read `src/lib/format-date.ts`', '31 lines'),
        ],
      },
      {
        kind: 'steps',
        id: 'csv-edit',
        label: 'Edited 5 files',
        steps: [
          step('csv-edit-export', 'Edited `src/features/bookings/export-csv.ts`', '+64'),
          step('csv-edit-test', 'Edited `src/features/bookings/export-csv.test.ts`', '+48'),
          step('csv-edit-table', 'Edited `src/features/bookings/bookings-table.tsx`', '+18 −4'),
          step('csv-edit-toolbar', 'Edited `src/features/bookings/bookings-toolbar.tsx`', '+12 −1'),
          step('csv-edit-date', 'Edited `src/lib/format-date.ts`', '+6 −2'),
        ],
      },
      { kind: 'step', ...step('csv-test', 'Ran `pnpm test bookings`', '14 passed · 3.2s') },
      paragraph(
        'csv-answer',
        'The export is on `feature/bookings-csv-export` as draft pull request #482: five files, +148 −7. The unit tests pass, 14 of 14.',
      ),
    ],
  },
];

/* The second exchange: Tom Becker's two review comments. Its parts, shared by the scenes. */

const ask: Turn = {
  id: 'review-ask',
  role: 'user',
  text: 'Handle Tom’s two review comments on #482.',
};

const thought: Block = {
  kind: 'reasoning',
  id: 'review-thought',
  seconds: 5,
  text: 'Two comments. A note with a line break splits its row, because only commas and quotes are escaped: quote line breaks too. And the file is named for the UTC day, which is still yesterday in Berlin until 1 AM: use the local day.',
};

const readPr: Block = {
  kind: 'step',
  ...step('review-read-pr', 'Read pull request #482', '2 comments'),
};

const plan = paragraph(
  'review-plan',
  'Both comments are right. I will quote values with a line break and add a test for a two-line note, name the file for the local day, then run the checks and push.',
);

const editSteps: Step[] = [
  step('review-edit-export', 'Edited `src/features/bookings/export-csv.ts`', '+1 −1', {
    detail: {
      kind: 'diff',
      lines: [
        ' function escape(value: string) {',
        '-  return /[",]/.test(value) ? quote(value) : value;',
        '+  return /[",\\r\\n]/.test(value) ? quote(value) : value;',
        ' }',
      ],
    },
  }),
  step('review-edit-test', 'Edited `src/features/bookings/export-csv.test.ts`', '+9'),
  step('review-edit-table', 'Edited `src/features/bookings/bookings-table.tsx`', '+3 −1'),
];

const edits: Block = {
  kind: 'steps',
  id: 'review-edits',
  label: 'Edited 3 files',
  steps: editSteps,
};

const test: Block = {
  kind: 'step',
  ...step('review-test', 'Ran `pnpm test bookings`', '15 passed · 3.3s', { ms: 2000 }),
};

const typecheck: Step = step('review-typecheck', 'Ran `pnpm typecheck`', 'No errors · 48s', {
  ms: 2400,
});

const PUSH = 'Ran `git push`';

const push: Block = { kind: 'step', ...step('review-push', PUSH, 'Pushed to #482', { ms: 1800 }) };

const done = paragraph(
  'review-done',
  'Both comments are handled and pushed to #482. A value with a line break is now quoted, with a test for a two-line note, and the file is named for the local day. The unit tests pass, 15 of 15.',
);

const turn = (...blocks: Block[]): AgentTurn => ({ id: 'review', role: 'agent', blocks });

/** How far into its run a turn is once these blocks are done: where the way out picks it up. */
const clockAfter = (...blocks: Block[]) => playTurn(turn(...blocks), Infinity).clock;

/** The turn up to its checks, and the turn whole. */
const checked: Block[] = [thought, readPr, plan, edits, test, { kind: 'step', ...typecheck }];
const whole = turn(...checked, push, done);

/* A step failed: the push was rejected, because Tom pushed to the branch meanwhile. */

/** The command that exited 1, as the step it is; its error lines are the ones that matter. */
export const failedPush: Step = step('review-push-failed', PUSH, 'Exit 1', {
  status: 'failed',
  ms: 0,
  detail: {
    kind: 'output',
    lines: [
      '$ git push origin feature/bookings-csv-export',
      ' ! [rejected]  feature/bookings-csv-export -> feature/bookings-csv-export (fetch first)',
      "error: failed to push some refs to 'git.lumenstudio.example:lumen/lumen-app.git'",
      'hint: Updates were rejected because the remote contains work that you do',
      'hint: not have locally. Integrate the remote changes before pushing again.',
    ],
    errors: [1, 2],
  },
});

/** Why it failed, in a sentence, and what Fix it does about it. */
export const failedNote =
  'Tom Becker pushed 1 commit to this branch 12 minutes ago, so Tandem stopped here. Fix it pulls his commit in, runs the tests again and pushes.';

const fix: Block[] = [
  paragraph(
    'review-rebase-plan',
    'Tom pushed one commit to the branch while I worked. I will put my changes on top of his, run the tests again and push.',
  ),
  {
    kind: 'step',
    ...step('review-rebase', 'Ran `git pull --rebase`', '1 commit · no conflicts', { ms: 1800 }),
  },
  {
    kind: 'step',
    ...step('review-test-again', 'Ran `pnpm test bookings`', '15 passed · 3.3s', { ms: 2000 }),
  },
];

/* A connector needs reconnecting: the comments are also tracked in an issue. */

const issueAsk: Turn = {
  id: 'review-ask',
  role: 'user',
  text: `Tom’s comments on #482 are tracked in ${connector.issue}. Read the issue and handle what it asks for.`,
};

const issueThought: Block = {
  kind: 'reasoning',
  id: 'review-thought',
  seconds: 3,
  text: 'The comments are on the pull request, but the issue may say more about what handled means. I will read both before I touch the code.',
};

/** The step that could not read from the issue tracker, as it waits. */
export const issueStep: Step = step(
  'review-read-issue',
  `Read \`${connector.issue}\` in ${connector.name}`,
  'Waiting for you',
  { status: 'waiting', ms: 1800 },
);

/* A question from the agent: one of the two comments is a product decision. */

/** What the agent needs decided, and the answers it can act on at once. */
export const question = {
  title: 'Which day should the file name use?',
  options: [
    {
      value: 'viewer',
      label: 'The local day of whoever exports',
      description: 'What Tom asked for. Two people can get different names for the same file.',
    },
    {
      value: 'workspace',
      label: 'The workspace’s time zone',
      description: 'Europe/Berlin for everyone at Lumen Studio. One name a day, wherever it is.',
    },
    {
      value: 'utc',
      label: 'Keep UTC and say so in the name',
      description: 'bookings-2026-11-10-utc.csv. Nothing changes but the name.',
    },
  ],
};

const decision = turn(
  {
    kind: 'reasoning',
    id: 'review-thought',
    seconds: 4,
    text: 'Two comments. The line break is a plain bug: quote the value. The file name depends on whose day it is, and what Tom asks for is one of three fair readings. That is a product decision, not mine.',
  },
  readPr,
  { kind: 'steps', id: 'review-edits', label: 'Edited 2 files', steps: editSteps.slice(0, 2) },
  paragraph(
    'review-plan',
    'The second comment is fixed: a value with a line break is now quoted, and a test covers a two-line note. The first one needs your call before I rename the file.',
  ),
  { kind: 'card', id: 'review-question', card: 'question' },
);

/** What Tandem does once the question is answered, whichever way. */
const decided = (id: string): AgentTurn => ({
  id,
  role: 'agent',
  blocks: [
    {
      kind: 'step',
      ...step(`${id}-edit`, 'Edited `src/features/bookings/bookings-table.tsx`', '+3 −1', {
        ms: 1600,
      }),
    },
    {
      kind: 'step',
      ...step(`${id}-test`, 'Ran `pnpm test bookings`', '15 passed · 3.3s', { ms: 2000 }),
    },
    paragraph(
      `${id}-answer`,
      'Done. The file name follows your answer, and both of Tom’s comments are handled. The unit tests pass, 15 of 15.',
    ),
  ],
});

/** What Tandem says to anything this sample has no answer for. */
const fallback = (id: string): AgentTurn => ({
  id,
  role: 'agent',
  blocks: [
    {
      kind: 'reasoning',
      id: `${id}-thought`,
      seconds: 2,
      text: 'The message is short, and nothing here says which files to use. Asking is quicker than guessing.',
    },
    paragraph(
      `${id}-answer`,
      'I do not have enough to act on that yet. Tell me which files to use and what the result should be, and I will start.',
    ),
  ],
});

/* Messages queued: what waits, and what Tandem does with each once its turn comes. */

const queued = [
  'Reply to Tom on the pull request that both are fixed.',
  'Then mark the pull request ready for review.',
];

const afterQueue = (id: string, text: string): AgentTurn =>
  text === queued[0]
    ? {
        id,
        role: 'agent',
        blocks: [
          {
            kind: 'step',
            ...step(`${id}-reply`, 'Replied to Tom Becker on #482', '2 replies', { ms: 1600 }),
          },
          paragraph(
            `${id}-answer`,
            'I replied to both of Tom’s comments on #482 with what changed: line breaks are quoted in `export-csv.ts`, and the file is named for the local day.',
          ),
        ],
      }
    : text === queued[1]
      ? {
          id,
          role: 'agent',
          blocks: [
            paragraph(
              `${id}-answer`,
              'Not yet: the E2E check on #482 still fails, and the subagent on it has not finished. I will mark the pull request ready as soon as that check passes.',
            ),
          ],
        }
      : fallback(id);

/* The scenes. */

export type SceneId =
  'limit' | 'failed' | 'connector' | 'question' | 'context' | 'offline' | 'queued' | 'stopped';

export type Scene = {
  id: SceneId;
  /** Its name in the switch. */
  label: string;
  /** The session's mark in the sidebar while the moment lasts. */
  mark?: ThreadState;
  turns: Turn[];
  /** The last turn whole: the way out plays it from where the scene stopped it. */
  resumed?: AgentTurn;
  /** Where in that turn the way out starts, in milliseconds. */
  from?: number;
  /** The agent's turn in answer to a new message. */
  reply: (id: string, text: string) => AgentTurn;
  /** Messages already waiting their turn. */
  queue?: string[];
  /** What was being written when the scene began. */
  draft?: string;
  /** The transcript once the earlier messages are summarized. */
  compacted?: Turn[];
};

/** In the switch's order: what holds the run until you act, then what goes on around it. */
export const scenes: Scene[] = [
  {
    id: 'limit',
    label: 'Usage limit reached',
    mark: 'needs-you',
    turns: [
      ...first,
      ask,
      turn(thought, readPr, plan, edits, test, { kind: 'card', id: 'review-limit', card: 'limit' }),
    ],
    resumed: whole,
    from: clockAfter(thought, readPr, plan, edits, test),
    reply: fallback,
  },
  {
    id: 'failed',
    label: 'A step failed',
    mark: 'failed',
    turns: [...first, ask, turn(...checked, { kind: 'card', id: 'review-failed', card: 'failed' })],
    resumed: turn(...checked, { kind: 'step', ...failedPush }, ...fix, push, done),
    from: clockAfter(...checked),
    reply: fallback,
  },
  {
    id: 'connector',
    label: 'Connector to reconnect',
    mark: 'needs-you',
    turns: [
      ...first,
      issueAsk,
      turn(issueThought, readPr, { kind: 'card', id: 'review-connector', card: 'connector' }),
    ],
    resumed: turn(
      issueThought,
      readPr,
      { kind: 'step', ...issueStep, status: 'done', result: '2 comments linked' },
      paragraph(
        'review-answer',
        `${connector.issue} wants both of Tom’s comments handled before the pull request is marked ready: a value with a line break must be quoted, and the file name should use the local day. I will start with the quoting, since it can break a file.`,
      ),
    ),
    from: clockAfter(issueThought, readPr),
    reply: fallback,
  },
  {
    id: 'question',
    label: 'A question from Tandem',
    mark: 'needs-you',
    turns: [...first, ask, decision],
    reply: decided,
  },
  {
    id: 'context',
    label: 'Context nearly full',
    turns: [...first, ask, whole],
    compacted: [ask, whole],
    reply: fallback,
  },
  {
    id: 'offline',
    label: 'Connection lost',
    turns: [...first, ask, whole],
    draft: queued[0],
    reply: fallback,
  },
  {
    id: 'queued',
    label: 'Messages queued',
    mark: 'working',
    turns: [
      ...first,
      ask,
      turn(thought, readPr, plan, edits, test, {
        kind: 'step',
        ...typecheck,
        status: 'running',
        result: undefined,
      }),
    ],
    resumed: whole,
    // The typecheck is the long step; once it is through, the rest plays.
    from: clockAfter(...checked),
    queue: queued,
    reply: afterQueue,
  },
  {
    id: 'stopped',
    label: 'Stopped by you',
    // Stopped 17 words into the answer.
    turns: [...first, ask, { ...whole, stoppedAt: clockAfter(...checked, push) + 17 * 32 }],
    reply: fallback,
  },
];

/** What the summary that replaces the earlier messages says. */
export const summary = [
  'Added `exportBookingsCsv` and an Export button to the bookings toolbar; dates are written as UTC ISO strings.',
  'Draft pull request #482 on `feature/bookings-csv-export`: five files, +148 −7. The unit tests pass, 14 of 14.',
  'Still open: the E2E test that times out (a subagent is on it) and two review comments from Tom Becker.',
];

/**
 * The queued scene opens with the turn 23 seconds in, on its typecheck, which is through 40
 * seconds later.
 */
export const working = { activity: 'Running `pnpm typecheck`', since: 23, until: 63 };

/* The sidebar: the same chats and sessions as everywhere in Tandem, this session open. */

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

/** The sessions by repository, the open one in the state its scene puts it in. */
export const codeGroups = (mark?: ThreadState): ThreadGroup[] => [
  {
    id: 'lumen-app',
    label: 'lumen-app',
    threads: [
      thread(OPEN_SESSION, 'CSV export for bookings', {
        state: mark,
        pullRequest: { number: 482, comments: 2 },
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
