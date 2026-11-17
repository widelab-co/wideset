import { Popup } from '@wideset/react';
import { useState } from 'react';

import { ConnectorList } from './connector-list';
import { ContextMeter } from './context-meter';
import { ContextSection } from './context-section';
import { ContextUsage } from './context-usage';
import { changedFiles, connectors, context, documents, pullRequests } from './data';
import { ProducedList } from './produced-list';
import { PullRequestList } from './pull-request-list';

/**
 * The context meter and what it opens: the session's environment in a popover over the composer,
 * so the transcript stays in view behind it. Four sections under one another, most pressing
 * first: how full the context is and the way to free it, the connectors with the one to
 * reconnect, what the session produced, the pull requests it opened. It informs and fixes in
 * place, so it has no footer and no filled button: Send stays the screen's one. It opens with
 * the block; the meter opens it again.
 */
export function ContextPopover() {
  const [open, setOpen] = useState(true);
  const [compacted, setCompacted] = useState(false);
  const [reconnected, setReconnected] = useState<string[]>([]);

  const parts = context.parts.map(({ label, tokens, compacted: left }) => ({
    label,
    tokens: compacted && left !== undefined ? left : tokens,
  }));
  const used = parts.reduce((sum, part) => sum + part.tokens, 0);

  return (
    <Popup open={open} onOpenChange={setOpen}>
      <Popup.Trigger asChild>
        <ContextMeter share={used / context.window} />
      </Popup.Trigger>
      <Popup.Container
        side="top"
        align="start"
        collisionPadding={12}
        aria-label="Session context"
        // Focus the popover itself, not its first button: nothing looks pressed before anything
        // is, and Tab starts from the top.
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          (event.currentTarget as HTMLElement).focus();
        }}
        className="max-h-[calc(100dvh-7rem)] w-[26rem]"
      >
        {/* The sections scroll in a plain box, not in Popup.Content: its scrollbar gutter would stop
            their lines short of the right edge. */}
        <div className="min-h-0 overflow-y-auto">
          <ContextSection title="Context">
            <ContextUsage
              window={context.window}
              parts={parts}
              compacted={compacted}
              onCompact={() => setCompacted(true)}
            />
          </ContextSection>
          <ContextSection title="Connectors">
            <ConnectorList
              connectors={connectors.map((connector) =>
                reconnected.includes(connector.id)
                  ? { ...connector, state: 'connected' }
                  : connector,
              )}
              onReconnect={(id) => setReconnected([...reconnected, id])}
            />
          </ContextSection>
          <ContextSection title="Produced">
            <ProducedList files={changedFiles} documents={documents} />
          </ContextSection>
          <ContextSection title="Pull requests">
            <PullRequestList pullRequests={pullRequests} />
          </ContextSection>
        </div>
      </Popup.Container>
    </Popup>
  );
}
