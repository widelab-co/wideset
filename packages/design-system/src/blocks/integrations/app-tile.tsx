// TODO(custom): app tile on the grey canvas (white, no outline); Tile always draws its outline.
import { Button } from '@wideset/react';

import { AppLogo } from './app-logo';
import type { App } from './data';

/**
 * An app not connected yet: its logo, name, what connecting it does, and Connect. On the canvas
 * it is a white module with no border and no shadow, as the Connected section is.
 */
export function AppTile({ app, onConnect }: { app: App; onConnect: () => void }) {
  return (
    <li className="bg-ws-static-foreground rounded-ws-container-md min-h-ws-20 gap-ws-7 px-ws-9 py-ws-7 flex items-center">
      <AppLogo app={app} size="md" />
      <div className="gap-ws-3 flex min-w-0 flex-1 flex-col">
        <p className="typography-label-strong-sm text-ws-static-strong truncate">{app.name}</p>
        <p className="typography-body-sm text-ws-static-subtle truncate">{app.summary}</p>
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
  );
}
