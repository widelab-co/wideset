import { Button, Tile } from '@wideset/react';

import { AppLogo } from './app-logo';
import type { App } from './data';

/** An app not connected yet: its logo, name, what connecting it does, and Connect. */
export function AppTile({ app, onConnect }: { app: App; onConnect: () => void }) {
  return (
    <Tile asChild>
      <li className="gap-ws-7">
        <AppLogo app={app} size="md" />
        <div className="gap-ws-3 flex min-w-0 flex-1 flex-col">
          <Tile.Title className="truncate">{app.name}</Tile.Title>
          <Tile.Description className="truncate">{app.summary}</Tile.Description>
        </div>
        <Button
          size="sm"
          variant="secondary"
          preset="ghost"
          onClick={onConnect}
          aria-label={`Connect ${app.name}`}
        >
          Connect
        </Button>
      </li>
    </Tile>
  );
}
