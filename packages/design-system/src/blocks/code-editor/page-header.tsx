// TODO(custom): page header (title, a line of description, the save state and actions on the right); no PageHeader in Wideset.
import { RiPlayLine } from '@remixicon/react';
import { Button } from '@wideset/react';

import type { Version } from './data';
import { VersionMenu } from './version-menu';

type PageHeaderProps = {
  /** "Saved 2 minutes ago" or "Unsaved changes". */
  state: string;
  dirty: boolean;
  running: boolean;
  versions: Version[];
  onPickVersion: (version: Version) => void;
  onRun: () => void;
  onSave: () => void;
};

/**
 * The script's name and what it does, then, on the right, whether it is saved, its versions, Run
 * test and Save. Save is the screen's one filled button and is enabled only with changes to save;
 * Ctrl+S or Cmd+S does the same. The save state is announced as it changes.
 */
export function PageHeader({
  state,
  dirty,
  running,
  versions,
  onPickVersion,
  onRun,
  onSave,
}: PageHeaderProps) {
  return (
    <header className="gap-ws-12 flex flex-wrap items-center justify-between">
      <div className="gap-ws-2 flex min-w-0 flex-col">
        <h1 className="typography-subtitle-md text-ws-static-strong">score-lead.js</h1>
        <p className="typography-body-md text-ws-static-subtle">
          The code step in Lead scoring: it scores each new lead from 0 to 100.
        </p>
      </div>
      <div className="gap-ws-5 flex items-center">
        <p
          aria-live="polite"
          className="typography-label-sm text-ws-static-subtle mr-ws-3 tabular-nums"
        >
          {state}
        </p>
        <VersionMenu versions={versions} onPick={onPickVersion} />
        <Button variant="secondary" preset="border" size="sm" disabled={running} onClick={onRun}>
          <Button.Icon icon={RiPlayLine} />
          {running ? 'Running test…' : 'Run test'}
        </Button>
        <Button size="sm" disabled={!dirty} aria-keyshortcuts="Control+S Meta+S" onClick={onSave}>
          Save
        </Button>
      </div>
    </header>
  );
}
