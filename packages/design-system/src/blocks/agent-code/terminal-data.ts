/** How a stretch of output is coloured: the handful of colours a terminal theme gives a log. */
export type Tone = 'subtle' | 'strong' | 'positive' | 'negative' | 'notice' | 'link';

/** A stretch of one line: plain, or in a tone. A `link` is an address, and opens it. */
export type Span = string | [tone: Tone, text: string];

/** One line of output; an empty one is a blank line. */
export type Line = Span[];

/** A process still going, one stopped by hand, or the code it exited with. */
export type RunState = 'running' | 'stopped' | number;

/** One command and what it printed. */
export type Run = {
  id: string;
  /** Who typed it: the agent, as a step of the session, or Ines at the prompt. */
  by: 'tandem' | 'you';
  command: string;
  state: RunState;
  output: Line[];
};

export type Shell = { id: string; name: string; runs: Run[] };

/** A state in words and in its meaning's colour: running is in progress, 0 is done, the rest failed. */
export const stateOf = (state: RunState) =>
  state === 'running'
    ? ({ label: 'Running', color: 'info' } as const)
    : state === 'stopped'
      ? ({ label: 'Stopped', color: 'neutral' } as const)
      : ({ label: `Exited ${state}`, color: state === 0 ? 'positive' : 'negative' } as const);

const DIR = 'src/features/bookings';

const file = (mark: Span, name: string, tests: string, ms: number): Line => [
  mark,
  `${DIR}/${name} `,
  ['subtle', `(${tests}) ${ms}ms`],
];
const PASS: Span = ['positive', ' ✓ '];
const FAIL: Span = ['negative', ' × '];

const summary = (label: string, ...counts: Span[]): Line => [['subtle', label], ...counts];
const OR: Span = ['subtle', ' | '];

/** `pnpm test bookings` once the dates are written as UTC: what the prompt answers with, too. */
export const PASSING_TESTS: Line[] = [
  file(PASS, 'bookings-table.test.tsx', '6 tests', 36),
  file(PASS, 'bookings-toolbar.test.tsx', '3 tests', 19),
  file(PASS, 'export-csv.test.ts', '5 tests', 15),
  [],
  summary(' Test files  ', ['positive', '3 passed'], ['subtle', ' (3)']),
  summary('      Tests  ', ['positive', '14 passed'], ['subtle', ' (14)']),
  summary('   Duration  ', '3.2s'),
];

/** The first run: the CSV wrote the start time in local time. */
const FAILING_TESTS: Line[] = [
  file(PASS, 'bookings-table.test.tsx', '6 tests', 38),
  file(PASS, 'bookings-toolbar.test.tsx', '3 tests', 21),
  file(FAIL, 'export-csv.test.ts', '5 tests | 1 failed', 17),
  [['negative', '   × exportBookingsCsv › writes start times as UTC ISO strings']],
  [],
  [
    [
      'negative',
      "     AssertionError: expected '2026-11-10T10:00:00+01:00' to be '2026-11-10T09:00:00Z'",
    ],
  ],
  [],
  [['positive', '     - Expected  2026-11-10T09:00:00Z']],
  [['negative', '     + Received  2026-11-10T10:00:00+01:00']],
  [],
  [['subtle', `     at ${DIR}/export-csv.test.ts:31:24`]],
  [],
  summary(
    ' Test files  ',
    ['negative', '1 failed'],
    OR,
    ['positive', '2 passed'],
    ['subtle', ' (3)'],
  ),
  summary(
    '      Tests  ',
    ['negative', '1 failed'],
    OR,
    ['positive', '13 passed'],
    ['subtle', ' (14)'],
  ),
  summary('   Duration  ', '3.4s'),
];

const request = (path: string, ms: number): Line => [
  ' GET ',
  path,
  ' ',
  ['positive', '200'],
  ['subtle', ` in ${ms}ms`],
];

const DEV_SERVER: Line[] = [
  [['subtle', '> lumen-app@3.8.0 dev']],
  [['subtle', '> next dev']],
  [],
  ['   Local    ', ['link', 'http://localhost:3000']],
  [],
  [PASS, 'Ready in 1.4s'],
  [['subtle', ' ○ Compiling /bookings ...']],
  [PASS, 'Compiled /bookings in 812ms'],
  request('/bookings', 946),
  request(
    '/api/bookings?from=2026-11-10T00:00:00Z&to=2026-11-10T23:59:59Z&room=all&sort=start',
    38,
  ),
  [['notice', ' ⚠ '], 'Workspace time zone is not set: times are shown in the browser zone'],
  [PASS, 'Compiled in 164ms'],
  request('/bookings', 52),
];

const E2E: Line[] = [
  [['subtle', 'Running 3 tests using 1 worker']],
  [],
  [PASS, 'bookings › lists the bookings for today ', ['subtle', '(1.9s)']],
  [PASS, 'bookings › filters by room ', ['subtle', '(2.3s)']],
  [FAIL, 'bookings export › downloads the file ', ['subtle', '(30.0s)']],
  [],
  [['negative', '   Test timeout of 30000ms exceeded while waiting for the download']],
  [],
  [' ', ['negative', '1 failed'], OR, ['positive', '2 passed'], ['subtle', ' (36.4s)']],
];

/** The session's shells: the tests the agent ran, the dev server it left up, and Ines's own. */
export const SHELLS: Shell[] = [
  {
    id: 'tests',
    name: 'pnpm test',
    runs: [
      {
        id: 'tests-1',
        by: 'tandem',
        command: 'pnpm test bookings',
        state: 1,
        output: FAILING_TESTS,
      },
      {
        id: 'tests-2',
        by: 'tandem',
        command: 'pnpm test bookings',
        state: 0,
        output: PASSING_TESTS,
      },
    ],
  },
  {
    id: 'dev',
    name: 'pnpm dev',
    runs: [
      { id: 'dev-1', by: 'tandem', command: 'pnpm dev', state: 'running', output: DEV_SERVER },
    ],
  },
  {
    id: 'zsh',
    name: 'zsh',
    runs: [
      {
        id: 'zsh-1',
        by: 'you',
        command: 'git branch --show-current',
        state: 0,
        output: [['feature/bookings-csv-export']],
      },
      { id: 'zsh-2', by: 'you', command: 'pnpm test:e2e bookings', state: 1, output: E2E },
    ],
  },
];

/** A shell's text as it would be selected and copied: the commands and what they printed. */
export const textOf = (shell: Shell) =>
  shell.runs
    .map(({ command, output }) =>
      [
        `$ ${command}`,
        ...output.map((line) =>
          line.map((span) => (typeof span === 'string' ? span : span[1])).join(''),
        ),
      ].join('\n'),
    )
    .join('\n\n');
