import { fileById, type FileId, NOW, SAMPLE_LEAD } from './data';
import type { Problem } from './lint';

/** The page's clock starts at NOW when it loads, so log times read as today's. */
const LOADED = Date.now();

export type LogLine = { at: Date; text: string; level: 'info' | 'error' };

/** What one Run test produced: the score it returned, or why it could not run. */
export type TestRun =
  | { status: 'passed'; ranAt: Date; ms: number; score: number; log: LogLine[] }
  | { status: 'failed'; ranAt: Date; log: LogLine[] };

/**
 * A test run as the workflow's runner would report it. Orbit runs the code on its servers; here
 * a syntax error stops the run, as it would there, and otherwise the script scores the sample.
 */
export function runTest(problems: Record<FileId, Problem[]>): TestRun {
  // ponytail: the score is this version's answer for the sample, not the edited code's; run the
  // code in a sandboxed worker when the block needs to execute what was typed.
  const ranAt = new Date(Date.parse(NOW) + Date.now() - LOADED);
  const later = (ms: number) => new Date(ranAt.getTime() + ms);
  const start: LogLine = { at: ranAt, level: 'info', text: `Test run with ${SAMPLE_LEAD.company}` };

  for (const [id, list] of Object.entries(problems) as [FileId, Problem[]][]) {
    const error = list.find((problem) => problem.severity === 'error');
    if (!error) continue;
    return {
      status: 'failed',
      ranAt,
      log: [
        start,
        {
          at: later(3),
          level: 'error',
          text: `SyntaxError: ${error.message} (${fileById(id).name}, line ${error.line})`,
        },
      ],
    };
  }

  return {
    status: 'passed',
    ranAt,
    ms: 7,
    score: 77,
    log: [
      start,
      { at: later(5), level: 'info', text: `Scored ${SAMPLE_LEAD.company}: 77` },
      { at: later(7), level: 'info', text: 'Returned 77 in 7 ms' },
    ],
  };
}
