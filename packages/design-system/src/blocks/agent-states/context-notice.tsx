import { InlineAlert } from '@wideset/react';

import { contextUsed } from './data';

/**
 * The context is nearly full: a warning over the composer, before the next message makes it
 * worse. It says how full, what will happen if nothing is done, what compacting does and what it
 * keeps, and offers it in place. It can be dismissed: there is still room for a few messages, so
 * Send stays the filled button.
 */
export function ContextNotice({ onCompact }: { onCompact: () => void }) {
  return (
    <InlineAlert
      status="warning"
      orientation="vertical"
      title={`The context is ${contextUsed}% full`}
      message="Soon Tandem will lose the beginning of this session. Compacting replaces the earlier messages with a summary and keeps the task list, the files changed and your latest exchange."
    >
      <InlineAlert.Action onClick={onCompact}>Compact conversation</InlineAlert.Action>
    </InlineAlert>
  );
}
