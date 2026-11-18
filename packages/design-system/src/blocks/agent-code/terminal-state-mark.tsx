// TODO(custom): a shell's state as one small mark in its tab (running, exited 0, exited with an error); Tabs has an icon and a count part but no state mark.
import { RiCheckLine, RiCloseLine, RiLoader4Line } from '@remixicon/react';
import { cn } from '@wideset/react';

import { type RunState, stateOf } from './terminal-data';

const MARK = {
  info: { Icon: RiLoader4Line, className: 'text-ws-semantic-info' },
  positive: { Icon: RiCheckLine, className: 'text-ws-semantic-positive' },
  negative: { Icon: RiCloseLine, className: 'text-ws-semantic-negative' },
};

/**
 * How a shell's last command stands, before its name in the tab: turning while it runs, a check
 * for exit 0, a cross for an error; nothing for an idle shell. The tab draws its icons in its own
 * text colour, so the meaning's colour sits on a wrapper. The words are the tab's to say.
 */
export function TerminalStateMark({ state }: { state?: RunState }) {
  if (state === undefined || state === 'stopped') return null;
  const { Icon, className } = MARK[stateOf(state).color as keyof typeof MARK];
  return (
    <span aria-hidden="true" className={cn('flex shrink-0', className)}>
      <Icon className={cn('size-ws-8', state === 'running' && 'motion-safe:animate-spin')} />
    </span>
  );
}
