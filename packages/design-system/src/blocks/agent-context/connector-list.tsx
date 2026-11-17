// TODO(custom): a connector as a row (what it is, its state, the way to reconnect it); Wideset has no row for a connection, and InlineAlert is a message, not a list item.
import { Button, StatusBadge } from '@wideset/react';
import { useEffect, useRef, useState } from 'react';

import type { Connector } from './data';

type ConnectorListProps = {
  connectors: Connector[];
  onReconnect: (id: string) => void;
};

/**
 * What the session can reach beyond the repository, one row each: its icon and name, then its
 * state in the colour of its meaning. A connector whose sign-in ran out says so in the notice
 * colour, as the step that needs it does in agent-states (nothing is broken, it needs you), and
 * has Reconnect beside it, bordered: the way to fix it is on the row that has the problem.
 * Reconnected, the button gives way to the badge: the focus goes to the badge, and the change
 * is said aloud.
 */
export function ConnectorList({ connectors, onReconnect }: ConnectorListProps) {
  const [reconnected, setReconnected] = useState<string>();
  const badges = useRef(new Map<string, HTMLSpanElement>());
  const back = connectors.find((item) => item.id === reconnected && item.state === 'connected');

  useEffect(() => {
    if (back) badges.current.get(back.id)?.focus();
  }, [back]);

  return (
    <>
      <ul className="flex flex-col">
        {connectors.map(({ id, name, icon: Icon, state }) => (
          <li key={id} className="gap-ws-5 min-h-ws-15 flex items-center">
            <Icon aria-hidden="true" className="size-ws-9 text-ws-static-subtle shrink-0" />
            <span className="typography-label-sm text-ws-static-strong min-w-0 flex-1 truncate">
              {name}
            </span>
            {state === 'connected' ? (
              <span
                ref={(node) => {
                  if (node) badges.current.set(id, node);
                  else badges.current.delete(id);
                }}
                tabIndex={-1}
                className="focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default rounded-ws-control-sm flex"
              >
                <StatusBadge size="sm" color="positive">
                  Connected
                </StatusBadge>
              </span>
            ) : (
              <>
                <StatusBadge size="sm" color="notice">
                  Sign-in expired
                </StatusBadge>
                <Button
                  variant="secondary"
                  preset="border"
                  size="sm"
                  aria-label={`Reconnect ${name}`}
                  onClick={() => {
                    setReconnected(id);
                    onReconnect(id);
                  }}
                >
                  Reconnect
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
      <span role="status" className="sr-only">
        {back ? `${back.name} is connected` : ''}
      </span>
    </>
  );
}
