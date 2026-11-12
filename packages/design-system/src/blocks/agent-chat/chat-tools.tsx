import { type RemixiconComponentType, RiGlobalLine, RiSearchEyeLine } from '@remixicon/react';
import { SegmentedControl, Tooltip } from '@wideset/react';
import { useState } from 'react';

import { ToolsMenu } from './tools-menu';

const MODES: { value: string; label: string; icon: RemixiconComponentType }[] = [
  { value: 'web', label: 'Web search', icon: RiGlobalLine },
  { value: 'research', label: 'Research', icon: RiSearchEyeLine },
];

type ChatToolsProps = {
  /** The chat is a research run: a follow-up stays one unless it is switched back. */
  research?: boolean;
  /** Add files, from the "…" menu. */
  onAttach?: () => void;
};

/**
 * Chat's tools in the composer, as in the AI chat starting point: how the agent looks things up,
 * as two modes in an icon-only segmented control (a quick web search, or a longer research run),
 * each named by a tooltip, then the "…" menu with the rest. The tooltip hangs on a wrapper, not
 * on the segment: a tooltip trigger writes its own `data-state`, which is the attribute the
 * segment is styled by.
 */
export function ChatTools({ research = false, onAttach }: ChatToolsProps) {
  const [mode, setMode] = useState(research ? 'research' : 'web');

  return (
    <>
      <SegmentedControl size="sm" aria-label="Search mode" value={mode} onValueChange={setMode}>
        {MODES.map(({ value, label, icon }) => (
          <Tooltip key={value} size="sm">
            <Tooltip.Trigger asChild>
              <span className="flex">
                <SegmentedControl.Item value={value} icon={icon} aria-label={label} />
              </span>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <Tooltip.Label>{label}</Tooltip.Label>
            </Tooltip.Content>
          </Tooltip>
        ))}
      </SegmentedControl>
      <ToolsMenu onAttach={onAttach} />
    </>
  );
}
