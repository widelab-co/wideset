import { FILES } from './changes-data';
import { CHECKS } from './checks-data';
import type { StepDetail, Turn } from './model';
import { SHELLS } from './terminal-data';

/*
  The open session, "CSV export for bookings" in `lumen-app`, as its turns. Ines asked for the
  export with Plan mode on; Tandem read the files, proposed a plan she approved, made the
  changes, ran the unit tests (one failed on a start time in local time), fixed it, and opened
  draft pull request #482. Then E2E failed on the pull request: the newest turn stops at the
  command Tandem wants to run, with a subagent already on the timeout.

  What a step opens to is read from the panes' own data (the diff, the shells, the checks), so
  the transcript and the panes cannot disagree.
*/

const SIGN = { added: '+', removed: '-', context: ' ' };

/** A changed file's step: its counts as the result, its diff as the detail. */
const change = (name: string): { result: string; detail: StepDetail } => {
  const file = FILES.find(({ path }) => path.endsWith(`/${name}`))!;
  return {
    result: file.removed ? `+${file.added} −${file.removed}` : `+${file.added}`,
    detail: {
      kind: 'diff',
      lines: file.hunks.flatMap((hunk) => hunk.lines.map((line) => SIGN[line.kind] + line.text)),
    },
  };
};

/** A run in the tests' shell as a step's output: its lines, the failures marked. */
const testRun = (at: number): StepDetail => {
  const { command, output } = SHELLS[0].runs[at];
  const lines = output.filter((line) => line.length > 0);
  return {
    kind: 'output',
    lines: [
      `$ ${command}`,
      ...lines.map((line) =>
        line.map((span) => (typeof span === 'string' ? span : span[1])).join(''),
      ),
    ],
    errors: lines.flatMap((line, index) =>
      line.some((span) => typeof span !== 'string' && span[0] === 'negative') ? [index + 1] : [],
    ),
  };
};

/** The lines of the E2E check's log that say why it failed. */
const e2eLog = CHECKS.find((check) => check.id === 'e2e')?.log ?? [];

/** The plan Ines approved, before anything was changed. The Tasks pane shows how it went on. */
export const plan = [
  'Add `exportBookingsCsv` in `export-csv.ts`: the rows in, the CSV text out.',
  'Put an Export CSV button in the toolbar, disabled when no row matches.',
  'Cover quoting, empty values and dates with unit tests.',
  'Open a draft pull request, and mark it ready once its checks pass.',
];

/** The session's turns, oldest first; the newest waits for an approval. */
export const csvExport: Turn[] = [
  {
    id: 'csv-1',
    role: 'user',
    text: 'Add a CSV export to the bookings table: the rows the filters show, for Finance. Open a draft pull request when the tests pass.',
  },
  {
    id: 'csv-2',
    role: 'agent',
    blocks: [
      {
        kind: 'reasoning',
        id: 'csv-2-thought',
        seconds: 9,
        text: 'The table already holds its filtered rows, so the export can be one function over them and the button only has to call it. Finance opens the file in a spreadsheet: a value with a comma or a quote needs quoting, and dates should sort as text. Plan mode is on, so I read first and propose the steps before I change anything.',
      },
      {
        kind: 'steps',
        id: 'csv-2-read',
        label: 'Read 3 files',
        steps: [
          {
            id: 'read-table',
            label: 'Read `bookings-table.tsx`',
            active: 'Reading `bookings-table.tsx`',
            result: '31 lines',
            status: 'done',
          },
          {
            id: 'read-types',
            label: 'Read `types.ts`',
            active: 'Reading `types.ts`',
            result: '46 lines',
            status: 'done',
          },
          {
            id: 'read-toolbar',
            label: 'Read `bookings-toolbar.tsx`',
            active: 'Reading `bookings-toolbar.tsx`',
            result: '38 lines',
            status: 'done',
          },
        ],
      },
      { kind: 'card', id: 'csv-2-plan', card: 'plan' },
      {
        kind: 'steps',
        id: 'csv-2-changes',
        label: 'Changed 4 files',
        steps: [
          {
            id: 'write-export',
            label: 'Wrote `export-csv.ts`',
            active: 'Writing `export-csv.ts`',
            status: 'done',
            ...change('export-csv.ts'),
          },
          {
            id: 'edit-toolbar',
            label: 'Edited `bookings-toolbar.tsx`',
            active: 'Editing `bookings-toolbar.tsx`',
            status: 'done',
            ...change('bookings-toolbar.tsx'),
          },
          {
            id: 'edit-table',
            label: 'Edited `bookings-table.tsx`',
            active: 'Editing `bookings-table.tsx`',
            status: 'done',
            ...change('bookings-table.tsx'),
          },
          {
            id: 'write-test',
            label: 'Wrote `export-csv.test.ts`',
            active: 'Writing `export-csv.test.ts`',
            status: 'done',
            ...change('export-csv.test.ts'),
          },
        ],
      },
      {
        kind: 'step',
        id: 'test-failed',
        label: 'Ran `pnpm test bookings`',
        active: 'Running `pnpm test bookings`',
        result: '13 passed, 1 failed · 3.4s',
        status: 'failed',
        detail: testRun(0),
      },
      {
        kind: 'step',
        id: 'edit-format-date',
        label: 'Edited `format-date.ts`',
        active: 'Editing `format-date.ts`',
        status: 'done',
        ...change('format-date.ts'),
      },
      {
        kind: 'step',
        id: 'test-passed',
        label: 'Ran `pnpm test bookings`',
        active: 'Running `pnpm test bookings`',
        result: '14 passed · 3.2s',
        status: 'done',
        detail: testRun(1),
      },
      { kind: 'card', id: 'csv-2-terminal', card: 'terminal' },
      {
        kind: 'text',
        id: 'csv-2-answer',
        prose: [
          {
            kind: 'paragraph',
            text: 'The export is in: **Export CSV** in the toolbar downloads the rows the filters show. The first test run caught start times written in local time, so `formatTimestamp` now writes UTC, as `2026-11-10T09:00:00Z`.',
          },
        ],
      },
      { kind: 'card', id: 'csv-2-files', card: 'changes' },
      {
        kind: 'step',
        id: 'open-pull-request',
        label: 'Opened a draft pull request',
        active: 'Opening a draft pull request',
        result: '#482',
        status: 'done',
      },
      { kind: 'card', id: 'csv-2-pull-request', card: 'pull-request' },
    ],
  },
  {
    id: 'csv-3',
    role: 'user',
    text: 'E2E failed on the pull request. Find out why and fix it.',
  },
  {
    id: 'csv-4',
    role: 'agent',
    blocks: [
      {
        kind: 'reasoning',
        id: 'csv-4-thought',
        seconds: 5,
        text: 'Lint, typecheck, the unit tests and the preview deploy passed; only E2E failed. The unit tests cover the CSV text, so this is about the download itself, in a real browser. The log will say which test; a trace will say which step.',
      },
      {
        kind: 'step',
        id: 'read-log',
        label: 'Read the log of the E2E check',
        active: 'Reading the log of the E2E check',
        result: 'Timed out',
        status: 'done',
        detail: {
          kind: 'output',
          lines: e2eLog.map(({ text }) => text),
          errors: e2eLog.flatMap(({ error }, index) => (error ? [index] : [])),
        },
      },
      {
        kind: 'step',
        id: 'read-spec',
        label: 'Read `bookings-export.spec.ts`',
        active: 'Reading `bookings-export.spec.ts`',
        result: '42 lines',
        status: 'done',
      },
      {
        kind: 'step',
        id: 'subagent',
        label: 'Started a subagent on the timeout',
        active: 'Subagent investigating the timeout',
        status: 'running',
        ms: 1200,
      },
      {
        kind: 'text',
        id: 'csv-4-finding',
        prose: [
          {
            kind: 'paragraph',
            text: 'The test clicks **Export CSV**, then waits 30 seconds for a download that never starts. A subagent is reading how the file is saved; to see where the click goes, I want to run the tests once with a trace.',
          },
        ],
      },
      {
        kind: 'step',
        id: 'run-trace',
        label: 'Ran `pnpm test:e2e bookings --trace on`',
        active: 'Running `pnpm test:e2e bookings --trace on`',
        result: '1 of 3 failed',
        status: 'waiting',
        ms: 3600,
        approval: {
          title: 'Run a command',
          command: 'pnpm test:e2e bookings --trace on',
          reason:
            'A trace records every step of the failing test. The command runs the three E2E tests against the dev server and writes the trace to test-results.',
          scope: 'this repository',
        },
        detail: {
          kind: 'output',
          lines: [
            '$ pnpm test:e2e bookings --trace on',
            'Running 3 tests using 1 worker',
            ' ✓ bookings › lists the bookings for today (1.9s)',
            ' ✓ bookings › filters by room (2.3s)',
            ' × bookings export › downloads the file (30.0s)',
            '   Test timeout of 30000ms exceeded while waiting for the download',
            ' 1 failed | 2 passed (36.9s)',
            ' Trace: test-results/bookings-export-downloads-the-file/trace.zip',
          ],
          errors: [4, 5],
        },
      },
      {
        kind: 'text',
        id: 'csv-4-answer',
        prose: [
          {
            kind: 'paragraph',
            text: 'The trace shows it: the click on **Export CSV** opens the file in a new tab, so no download ever starts. The subagent is changing the export to a link with the `download` attribute; I will run E2E again when it is done.',
          },
        ],
      },
    ],
  },
];
