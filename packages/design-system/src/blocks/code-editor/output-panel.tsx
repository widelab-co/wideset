import { RiCheckboxCircleFill, RiCloseCircleFill } from '@remixicon/react';
import { cn, Tabs } from '@wideset/react';

import { type FileProblem, ProblemList } from './problem-list';
import { TestOutput } from './test-output';
import type { TestRun } from './test-run';

export type OutputTab = 'output' | 'problems';

type OutputPanelProps = {
  tab: OutputTab;
  onTabChange: (tab: OutputTab) => void;
  run?: TestRun;
  running: boolean;
  problems: FileProblem[];
  onReveal: (item: FileProblem) => void;
};

/** The last run's verdict, in its judgement's colour, announced when it changes. */
function RunStatus({ run, running }: { run?: TestRun; running: boolean }) {
  const passed = run?.status === 'passed';
  const Icon = passed ? RiCheckboxCircleFill : RiCloseCircleFill;
  return (
    <p
      aria-live="polite"
      className="typography-label-sm text-ws-static-base gap-ws-3 flex items-center"
    >
      {run && !running && (
        <>
          <Icon
            aria-hidden="true"
            className={cn(
              'size-ws-9 shrink-0',
              passed ? 'text-ws-semantic-positive' : 'text-ws-semantic-negative',
            )}
          />
          {run.status === 'passed'
            ? `Test passed in ${run.ms} ms`
            : 'Test failed on a syntax error'}
        </>
      )}
    </p>
  );
}

/**
 * The panel under the editor, split from it by a line: a test run's output and the code's
 * problems, as two tabs without counts (the wavy marks in the code already say where to look).
 * The last run's verdict sits at the end of the tab row, so it shows from either tab. Its height
 * is fixed and its content scrolls, so the editor keeps its room.
 */
export function OutputPanel({
  tab,
  onTabChange,
  run,
  running,
  problems,
  onReveal,
}: OutputPanelProps) {
  return (
    <Tabs
      value={tab}
      onValueChange={(value) => onTabChange(value as OutputTab)}
      divider={false}
      className="border-ws-static-base h-[15rem] shrink-0 border-t"
    >
      {/* The tabs share their row with the verdict, so the row draws the line, not the list. */}
      <div className="border-ws-static-subtle px-ws-9 gap-ws-9 flex items-center justify-between border-b">
        <Tabs.List aria-label="Test output and problems">
          <Tabs.Item value="output">
            <Tabs.Label>Output</Tabs.Label>
          </Tabs.Item>
          <Tabs.Item value="problems">
            <Tabs.Label>Problems</Tabs.Label>
          </Tabs.Item>
        </Tabs.List>
        <RunStatus run={run} running={running} />
      </div>
      <Tabs.Content value="output" className="px-ws-9 py-ws-7 min-h-0 flex-1 overflow-y-auto">
        <TestOutput run={run} running={running} />
      </Tabs.Content>
      <Tabs.Content value="problems" className="px-ws-9 py-ws-5 min-h-0 flex-1 overflow-y-auto">
        <ProblemList problems={problems} onReveal={onReveal} />
      </Tabs.Content>
    </Tabs>
  );
}
