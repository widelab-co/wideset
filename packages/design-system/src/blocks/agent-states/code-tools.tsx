import { Select } from '@wideset/react';
import { type ReactNode, useState } from 'react';

import { ContextSummary } from './context-summary';
import type { Context } from './model';
import { ToolsMenu } from './tools-menu';

type CodeToolsProps = {
  /** How much the agent may do in a repository without asking, least first. */
  permissions: string[];
  defaultPermission?: string;
  /** The session's context: the meter and its short summary. A new session has none yet. */
  context?: Context;
  /** The block's own meter in place of the summary: a `ContextMeter` that opens something else. */
  meter?: ReactNode;
  /** Add files, from the "…" menu. */
  onAttach?: () => void;
};

/**
 * Code's tools in the composer: how much the agent may do in the repository without asking, how
 * full the context is, then the "…" menu with the rest. The permission is a few fixed choices
 * whose words matter (Ask before edits is not an icon), so it stays a `Select`, the current one
 * always in view with its chevron.
 */
export function CodeTools({
  permissions,
  defaultPermission = permissions[0],
  context,
  meter,
  onAttach,
}: CodeToolsProps) {
  const [permission, setPermission] = useState(defaultPermission);

  return (
    <>
      <Select
        size="sm"
        aria-label="Permission mode"
        className="w-[11.5rem]"
        options={permissions.map((value) => ({ value, label: value }))}
        value={permission}
        onValueChange={setPermission}
      />
      {meter ?? (context && <ContextSummary {...context} />)}
      <ToolsMenu onAttach={onAttach} />
    </>
  );
}
