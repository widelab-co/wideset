// TODO(custom): a connector as a row (what it is, its state, the way to reconnect it); Wideset has no row for a connection, and InlineAlert is a message, not a list item.
import { Button, StatusBadge } from '@wideset/react';

import type { Connector } from './data';

type ConnectorListProps = {
  connectors: Connector[];
  onReconnect: (id: string) => void;
};

/**
 * What the session can reach beyond the repository, one row each: its icon and name, then its
 * state in the colour of its meaning. A connector whose sign-in ran out says so and has
 * Reconnect beside it, bordered: the way to fix it is on the row that has the problem.
 */
export function ConnectorList({ connectors, onReconnect }: ConnectorListProps) {
  return (
    <ul className="flex flex-col">
      {connectors.map(({ id, name, icon: Icon, state }) => (
        <li key={id} className="gap-ws-5 min-h-ws-15 flex items-center">
          <Icon aria-hidden="true" className="size-ws-9 text-ws-static-subtle shrink-0" />
          <span className="typography-label-sm text-ws-static-strong min-w-0 flex-1 truncate">
            {name}
          </span>
          {state === 'connected' ? (
            <StatusBadge size="sm" color="positive">
              Connected
            </StatusBadge>
          ) : (
            <>
              <StatusBadge size="sm" color="negative">
                Sign-in expired
              </StatusBadge>
              <Button
                variant="secondary"
                preset="border"
                size="sm"
                aria-label={`Reconnect ${name}`}
                onClick={() => onReconnect(id)}
              >
                Reconnect
              </Button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
