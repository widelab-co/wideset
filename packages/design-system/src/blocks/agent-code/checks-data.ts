/** The session's pull request: a draft from its branch into `main`. */
export const PULL_REQUEST = {
  number: 482,
  title: 'Add CSV export to the bookings table',
  state: 'Draft',
  head: 'feature/bookings-csv-export',
  base: 'main',
  href: 'https://git.lumenstudio.example/lumen-app/pull/482',
};

export type CheckState = 'passed' | 'failed';

/** A line of a check's log: its number in the full log, and whether it is the error itself. */
export type LogLine = { number: number; text: string; error?: boolean };

/** One check the pull request ran: how it ended, how long it took, and for a failure, why. */
export type Check = {
  id: string;
  name: string;
  state: CheckState;
  /** How long the check ran, in seconds. */
  seconds: number;
  /** What failed, in one line. */
  reason?: string;
  /** The lines of the log that say why, out of the whole of it. */
  log?: LogLine[];
  /** The whole log, on the git host. */
  logHref?: string;
};

/** The failing check first, since it is the one that needs something; the rest in the order they ran. */
export const CHECKS: Check[] = [
  {
    id: 'e2e',
    name: 'E2E',
    state: 'failed',
    seconds: 186,
    reason: 'bookings export › downloads the file timed out',
    log: [
      { number: 187, text: '$ pnpm test:e2e bookings' },
      { number: 193, text: 'Running 3 tests using 1 worker' },
      { number: 197, text: ' × bookings export › downloads the file (30.0s)', error: true },
      {
        number: 199,
        text: '   Test timeout of 30000ms exceeded while waiting for the download',
        error: true,
      },
      { number: 201, text: '   page.waitForEvent: waiting for event "download"' },
      { number: 204, text: '   at e2e/bookings-export.spec.ts:15:27' },
      { number: 208, text: ' 1 failed | 2 passed (41.8s)' },
    ],
    logHref: 'https://git.lumenstudio.example/lumen-app/pull/482/checks/e2e',
  },
  { id: 'lint', name: 'Lint', state: 'passed', seconds: 38 },
  { id: 'typecheck', name: 'Typecheck', state: 'passed', seconds: 72 },
  { id: 'unit', name: 'Unit tests', state: 'passed', seconds: 54 },
  { id: 'preview', name: 'Preview deploy', state: 'passed', seconds: 107 },
];
