/** How a task or a background run stands. */
export type RunState = 'todo' | 'running' | 'done' | 'stopped';

/** What a step did, which picks its icon. */
export type StepKind = 'read' | 'write' | 'edit' | 'run' | 'agent';

/** One thing the agent did for a task. A name in backticks is code. */
export type Step = {
  kind: StepKind;
  label: string;
  /** What came of it, said quietly at the end of the row: lines changed, tests passed. */
  result?: string;
  /** The result is a failure, so it takes the failure's colour. */
  failed?: boolean;
};

/** A file a task wrote or changed, from the repository root. */
export type TouchedFile = { path: string; change: 'added' | 'modified' };

export type Task = {
  id: string;
  /** A name in backticks is code. */
  title: string;
  state: Exclude<RunState, 'stopped'>;
  /** What a running task is doing right now. */
  now?: string;
  /** How long a running task had been going when the pane opened, in seconds. */
  seconds?: number;
  steps: Step[];
  files: TouchedFile[];
};

const BOOKINGS = 'src/features/bookings';

/**
 * The session's plan, in the order the agent set it. The first unit test run failed on a start
 * time written in local time; the agent put "Dates as UTC ISO strings" before the tests and ran
 * them again.
 */
export const TASKS: Task[] = [
  {
    id: 'export',
    title: 'Add `exportBookingsCsv`',
    state: 'done',
    steps: [
      { kind: 'read', label: 'Read `bookings-table.tsx`' },
      { kind: 'read', label: 'Read `types.ts`' },
      { kind: 'write', label: 'Wrote `export-csv.ts`', result: '+64' },
    ],
    files: [{ path: `${BOOKINGS}/export-csv.ts`, change: 'added' }],
  },
  {
    id: 'button',
    title: 'Export button in the toolbar',
    state: 'done',
    steps: [
      { kind: 'read', label: 'Read `bookings-toolbar.tsx`' },
      { kind: 'edit', label: 'Edited `bookings-toolbar.tsx`', result: '+12 −1' },
      { kind: 'edit', label: 'Edited `bookings-table.tsx`', result: '+18 −4' },
    ],
    files: [
      { path: `${BOOKINGS}/bookings-toolbar.tsx`, change: 'modified' },
      { path: `${BOOKINGS}/bookings-table.tsx`, change: 'modified' },
    ],
  },
  {
    id: 'utc',
    title: 'Dates as UTC ISO strings',
    state: 'done',
    steps: [
      { kind: 'read', label: 'Read `format-date.ts`' },
      { kind: 'edit', label: 'Edited `format-date.ts`', result: '+6 −2' },
    ],
    files: [{ path: 'src/lib/format-date.ts', change: 'modified' }],
  },
  {
    id: 'tests',
    title: 'Unit tests',
    state: 'done',
    steps: [
      { kind: 'write', label: 'Wrote `export-csv.test.ts`', result: '+48' },
      {
        kind: 'run',
        label: 'Ran `pnpm test bookings`',
        result: '13 passed, 1 failed',
        failed: true,
      },
      { kind: 'run', label: 'Ran `pnpm test bookings`', result: '14 passed · 3.2s' },
    ],
    files: [{ path: `${BOOKINGS}/export-csv.test.ts`, change: 'added' }],
  },
  {
    id: 'e2e',
    title: 'Fix the failing E2E test',
    state: 'running',
    now: 'Running `pnpm test:e2e bookings` with a trace',
    seconds: 134,
    steps: [
      { kind: 'read', label: 'Read the log of the E2E check', result: 'timed out' },
      { kind: 'read', label: 'Read `bookings-export.spec.ts`' },
      { kind: 'agent', label: 'Started a subagent on the timeout' },
    ],
    files: [],
  },
  {
    id: 'ready',
    title: 'Mark the PR ready for review',
    state: 'todo',
    steps: [],
    files: [],
  },
];

/** Something the session left going beside the plan: a process, or a subagent with its own task. */
export type BackgroundRun = {
  id: string;
  /** A name in backticks is code. */
  title: string;
  /** What it is and where it has got to. A name in backticks is code. */
  detail: string;
  state: 'running' | 'done';
  /** How long it had been going when the pane opened, or how long it took, in seconds. */
  seconds: number;
};

/** What is still going first, then what finished. */
export const BACKGROUND: BackgroundRun[] = [
  {
    id: 'dev',
    title: 'Dev server',
    detail: '`pnpm dev` on localhost:3000',
    state: 'running',
    seconds: 1445,
  },
  {
    id: 'timeout',
    title: 'Investigate the E2E timeout',
    detail: 'Subagent · read `bookings-export.spec.ts` and 5 more files',
    state: 'running',
    seconds: 98,
  },
  {
    id: 'uses',
    title: 'Find every use of `formatTimestamp`',
    detail: 'Subagent · used in `export-csv.ts` and `bookings-table.tsx`, nowhere else',
    state: 'done',
    seconds: 52,
  },
];
