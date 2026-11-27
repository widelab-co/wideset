import { Button, Tile } from '@wideset/react';

import { AppLogo } from './app-logo';
import type { App } from './data';

/**
 * An app not connected yet: its logo, name and what connecting it does. Connect shows on the tile
 * under the pointer and on keyboard focus, so a grid of tiles is not a grid of the same word; a
 * touch screen has no hover, so there it stays.
 */
export function AppTile({ app, onConnect }: { app: App; onConnect: () => void }) {
  return (
    <Tile asChild>
      <li>
        <AppLogo app={app} size="md" />
        <div className="gap-ws-3 flex min-w-0 flex-1 flex-col">
          <Tile.Title className="truncate">{app.name}</Tile.Title>
          <Tile.Description className="truncate">{app.summary}</Tile.Description>
        </div>
        <Button
          size="sm"
          variant="secondary"
          preset="border"
          onClick={onConnect}
          aria-label={`Connect ${app.name}`}
          className="opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100"
        >
          Connect
        </Button>
      </li>
    </Tile>
  );
}
