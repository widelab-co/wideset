import type { StatusBadgeProps } from '@wideset/react';

import { codeGroups as sessions, withThread } from './canon';

/*
  This block is the page that lists every Code session of the canon, so the sidebar has none
  open. The sessions on the page are the sidebar's eight, with what the sidebar has no room for:
  the branch, the pull request, the last thing each did and how long it has run. It is 11:24 AM
  on November 10, 2026: "CSV export for bookings" is at work with its subagent, so here its row
  in the sidebar says so too. Everything else is the canon's.
*/

export const NOW = '2026-11-10T11:24:00';

/** The canon's sessions, as they stand at this hour. */
export const codeGroups = withThread(sessions, 'csv-export', (thread) => ({
  ...thread,
  state: 'working',
}));

/* The page. */

export type SessionState = 'needs-you' | 'working' | 'paused' | 'failed' | 'done';

/**
 * A state in the colour of its meaning: working is in progress, needs you and paused wait for
 * someone, failed is failed, done is done. Listed in the order the filter offers them.
 */
export const STATES: Record<
  SessionState,
  { label: string; color: NonNullable<StatusBadgeProps['color']> }
> = {
  'needs-you': { label: 'Needs you', color: 'notice' },
  working: { label: 'Working', color: 'info' },
  paused: { label: 'Paused', color: 'notice' },
  failed: { label: 'Failed', color: 'negative' },
  done: { label: 'Done', color: 'positive' },
};

export const stateOptions = (Object.keys(STATES) as SessionState[]).map((value) => ({
  value,
  label: STATES[value].label,
}));

/**
 * What a session waits for. An approval names the command it wants to run; a question comes with
 * the answers the agent offered. Either is answered from the row.
 */
export type SessionRequest =
  | { kind: 'approval'; command: string; reason: string }
  | { kind: 'question'; text: string; options: string[] };

/** A pull request with its checks summed up: how many ran and how many of them failed. */
export type PullRequest = {
  number: number;
  state: 'Draft' | 'Open' | 'Merged';
  checks: { total: number; failed: number };
};

export type CodeSession = {
  id: string;
  title: string;
  state: SessionState;
  /** A subagent of the session above it. */
  child?: boolean;
  branch: string;
  pullRequest?: PullRequest;
  /** The last thing it did; `code` in backticks. */
  last: string;
  lastAt: string;
  /** How long the agent has worked in it, in minutes. */
  minutes: number;
  request?: SessionRequest;
};

export type Repository = { id: string; name: string; sessions: CodeSession[] };

/**
 * Every Code session, by repository, in the order to work through: a repository with a session
 * that needs you comes first, and in each one the sessions that need you lead. A subagent follows
 * its parent.
 */
export const repositories: Repository[] = [
  {
    id: 'billing-service',
    name: 'billing-service',
    sessions: [
      {
        id: 'vat-rounding',
        title: 'Invoice rounding for VAT',
        state: 'needs-you',
        branch: 'fix/vat-rounding',
        last: 'Asked to run `pnpm db:migrate --dry-run`',
        lastAt: '2026-11-10T11:18:00',
        minutes: 4,
        request: {
          kind: 'approval',
          command: 'pnpm db:migrate --dry-run',
          reason: 'A dry run lists the invoices whose total would change, and writes nothing.',
        },
      },
    ],
  },
  {
    id: 'lumen-app',
    name: 'lumen-app',
    sessions: [
      {
        id: 'flaky-sync',
        title: 'Flaky calendar sync test',
        state: 'needs-you',
        branch: 'fix/calendar-sync-clock',
        last: 'Found it: the test crosses midnight UTC',
        lastAt: '2026-11-10T11:02:00',
        minutes: 3,
        request: {
          kind: 'question',
          text: 'Freeze the clock in this test only, or in the setup for every test?',
          options: ['This test only', 'Every test'],
        },
      },
      {
        id: 'csv-export',
        title: 'CSV export for bookings',
        state: 'working',
        branch: 'feature/bookings-csv-export',
        pullRequest: { number: 482, state: 'Draft', checks: { total: 5, failed: 1 } },
        last: 'Handed the failing E2E test to a subagent',
        lastAt: '2026-11-10T11:21:00',
        minutes: 47,
      },
      {
        id: 'e2e-fix',
        title: 'Debug the E2E timeout',
        state: 'working',
        child: true,
        branch: 'feature/bookings-csv-export',
        last: 'Ran `pnpm test:e2e bookings`: 1 failed',
        lastAt: '2026-11-10T11:23:00',
        minutes: 3,
      },
      {
        id: 'rename-room',
        title: 'Rename Room to Space',
        state: 'paused',
        branch: 'refactor/room-to-space',
        last: 'Usage limit reached; resumes at 4:00 PM',
        lastAt: '2026-11-10T10:09:00',
        minutes: 72,
      },
      {
        id: 'room-filter',
        title: 'Room filter on bookings',
        state: 'done',
        branch: 'feature/bookings-room-filter',
        pullRequest: { number: 476, state: 'Merged', checks: { total: 5, failed: 0 } },
        last: 'Answered the last review comment',
        lastAt: '2026-11-09T16:40:00',
        minutes: 26,
      },
    ],
  },
  {
    id: 'lumen-web',
    name: 'lumen-web',
    sessions: [
      {
        id: 'next-upgrade',
        title: 'Upgrade to Next.js 16',
        state: 'failed',
        branch: 'chore/next-16',
        last: 'Build failed on `next-image-export`',
        lastAt: '2026-11-10T09:31:00',
        minutes: 9,
      },
      {
        id: 'pricing-page',
        title: 'Pricing page for Hub 2',
        state: 'done',
        branch: 'feature/hub-2-pricing',
        last: 'Added Hub 2 at $349 with the trade-in line',
        lastAt: '2026-11-10T08:47:00',
        minutes: 18,
      },
    ],
  },
];
