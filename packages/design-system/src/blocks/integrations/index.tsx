import { Button, Tabs } from '@wideset/react';
import { useId, useState } from 'react';

import { AppPanel } from './app-panel';
import { AppTile } from './app-tile';
import { ConnectedTable } from './connected-table';
import {
  ACCOUNT,
  type App,
  APPS,
  CATEGORIES,
  type Category,
  type Connection,
  CONNECTIONS,
  DEFAULT_SYNCS,
  NOW,
} from './data';
import { EmptyState } from './empty-state';
import { PageHeader } from './page-header';
import { TopBar } from './top-bar';

type Filter = Category | 'all';

const inView = (app: App, category: Filter, query: string) =>
  (category === 'all' || app.category === category) &&
  `${app.name} ${app.summary}`.toLowerCase().includes(query.trim().toLowerCase());

/**
 * Integrations, Canvas direction: the top bar, the page title and the section titles on the grey
 * canvas, the connected apps in a white section and the ones to add as white tiles. The search and
 * the category narrow both; Connect opens a side panel with what the app may access, and
 * connecting moves it up to Connected.
 */
export default function Integrations() {
  const availableId = useId();
  const [connections, setConnections] = useState<Connection[]>(CONNECTIONS);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Filter>('all');
  // While the panel slides out it keeps showing what it showed (`closing`), not the change.
  const [panel, setPanel] = useState<{ appId: string; open: boolean; closing?: Connection }>();

  const connectionOf = (appId: string) => connections.find((entry) => entry.appId === appId);
  const connected = connections
    .map((connection) => ({ app: APPS.find((app) => app.id === connection.appId)!, connection }))
    .filter(({ app }) => inView(app, category, query));
  const available = APPS.filter((app) => !connectionOf(app.id) && inView(app, category, query));

  const close = () =>
    panel && setPanel({ ...panel, open: false, closing: connectionOf(panel.appId) });

  const connect = (app: App) => {
    close();
    setConnections((all) => [
      {
        appId: app.id,
        syncs: DEFAULT_SYNCS[app.category],
        status: 'active',
        lastSync: NOW,
        connectedBy: ACCOUNT.name,
        connectedOn: NOW.slice(0, 10),
      },
      ...all,
    ]);
  };

  const disconnect = (app: App) => {
    close();
    setConnections((all) => all.filter((entry) => entry.appId !== app.id));
  };

  const setSyncing = (app: App, syncing: boolean) =>
    setConnections((all) =>
      all.map((entry) =>
        entry.appId !== app.id
          ? entry
          : syncing
            ? { ...entry, status: 'active', lastSync: NOW }
            : { ...entry, status: 'paused' },
      ),
    );

  const panelApp = panel && APPS.find((app) => app.id === panel.appId)!;
  const noResults = connected.length === 0 && available.length === 0;
  // From a category, widen the search first when other categories have a match.
  const elsewhere = category !== 'all' && APPS.some((app) => inView(app, 'all', query));
  const categoryLabel = CATEGORIES.find((entry) => entry.value === category)!.label;

  return (
    <div className="bg-ws-static-background flex min-h-dvh flex-col">
      <TopBar />
      <main className="px-ws-12 pb-ws-12 pt-ws-5 flex-1">
        <div className="gap-ws-12 mx-auto flex w-full max-w-[80rem] flex-col">
          <PageHeader query={query} onQueryChange={setQuery} />

          <Tabs
            value={category}
            onValueChange={(value) => setCategory(value as Filter)}
            className="overflow-x-auto"
          >
            <Tabs.List aria-label="Categories" className="min-w-full">
              {CATEGORIES.map((entry) => (
                <Tabs.Item key={entry.value} value={entry.value}>
                  <Tabs.Label>{entry.label}</Tabs.Label>
                </Tabs.Item>
              ))}
            </Tabs.List>
          </Tabs>

          <div className="gap-ws-16 flex flex-col">
            {connected.length > 0 && (
              <ConnectedTable
                rows={connected}
                onManage={(appId) => setPanel({ appId, open: true })}
              />
            )}

            {available.length > 0 && (
              <section aria-labelledby={availableId} className="gap-ws-7 flex flex-col">
                <h2 id={availableId} className="typography-subtitle-xs text-ws-static-strong">
                  Available
                </h2>
                {/* The tiles are the white modules here: a section card around them would box them twice. */}
                <ul className="gap-ws-7 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {available.map((app) => (
                    <AppTile
                      key={app.id}
                      app={app}
                      onConnect={() => setPanel({ appId: app.id, open: true })}
                    />
                  ))}
                </ul>
              </section>
            )}

            {noResults && (
              <section className="bg-ws-static-foreground rounded-ws-container-md">
                <EmptyState
                  title={
                    category === 'all'
                      ? `No apps match “${query.trim()}”`
                      : `No ${categoryLabel} apps match “${query.trim()}”`
                  }
                  description="Check the spelling, or tell us which app you need at integrations@orbit.so."
                  action={
                    <Button
                      size="sm"
                      variant="secondary"
                      preset="border"
                      onClick={() => (elsewhere ? setCategory('all') : setQuery(''))}
                    >
                      {elsewhere ? 'Search all categories' : 'Clear search'}
                    </Button>
                  }
                />
              </section>
            )}
          </div>
        </div>
      </main>

      {panel && panelApp && (
        <AppPanel
          app={panelApp}
          connection={panel.open ? connectionOf(panel.appId) : panel.closing}
          open={panel.open}
          onOpenChange={(open) => (open ? setPanel({ ...panel, open }) : close())}
          onConnect={() => connect(panelApp)}
          onDisconnect={() => disconnect(panelApp)}
          onSyncChange={(syncing) => setSyncing(panelApp, syncing)}
        />
      )}
    </div>
  );
}
