import { RiSideBarLine } from '@remixicon/react';
import { AppShell, Breadcrumbs, Button, cn, IconButton, Tabs } from '@wideset/react';
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
import { IntegrationsSidebar } from './sidebar';

type Filter = Category | 'all';

/**
 * The visual directions (specs/patterns/directions.md), each one `<AppShell direction>`. An app
 * picks one and keeps it on every screen; this screen takes three only to show that the page
 * inside stays the same. The top bar's line: the base line on Inset's raised card, as every Inset
 * screen has it, the subtle one on the page's white.
 */
const BAR_LINE = {
  flat: 'border-ws-static-subtle',
  frame: 'border-ws-static-subtle',
  inset: 'border-ws-static-base',
} as const;
export type Direction = keyof typeof BAR_LINE;

const inView = (app: App, category: Filter, query: string) =>
  (category === 'all' || app.category === category) &&
  `${app.name} ${app.summary}`.toLowerCase().includes(query.trim().toLowerCase());

/**
 * Integrations, a settings page beside the workspace sidebar, in the Flat direction (or Frame or
 * Inset, through `direction`). Everything sits on the page's white: the connected apps as a table,
 * the ones to add as outlined tiles. The search and the category narrow both; Connect opens a side
 * panel with what the app may access, and connecting moves it up to Connected.
 */
export default function Integrations({ direction = 'flat' }: { direction?: Direction }) {
  const availableId = useId();
  const sidebarId = useId();
  const [collapsed, setCollapsed] = useState(false);
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
    <AppShell direction={direction}>
      <IntegrationsSidebar id={sidebarId} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <AppShell.Main className="flex flex-col">
        {/* The bar belongs to the surround: it runs edge to edge. The sidebar's toggle is pulled
            left so its glyph, not its box, sits 20px from the edge; the crumbs follow it. */}
        <div className={cn(BAR_LINE[direction], 'h-ws-18 flex shrink-0 items-center border-b')}>
          <div className="gap-ws-5 px-ws-11 flex w-full items-center">
            <IconButton
              icon={RiSideBarLine}
              variant="secondary"
              preset="ghost"
              size="sm"
              iconClassName="text-ws-static-subtle size-ws-9"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!collapsed}
              aria-controls={sidebarId}
              onClick={() => setCollapsed(!collapsed)}
              className="-ml-ws-5"
            />
            <Breadcrumbs separator="arrow">
              <Breadcrumbs.Item asChild>
                <a href="#settings">Settings</a>
              </Breadcrumbs.Item>
              <Breadcrumbs.Item>Integrations</Breadcrumbs.Item>
            </Breadcrumbs>
          </div>
        </div>

        {/* The page scrolls here, under the bar (in Inset inside the card, so its corners stay put). */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="gap-ws-12 px-ws-14 pt-ws-14 pb-ws-16 mx-auto flex w-full max-w-[80rem] flex-col">
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
                  <h2 id={availableId} className="typography-label-strong-md text-ws-static-strong">
                    Available
                  </h2>
                  {/* As many columns as fit a tile: the sidebar opens and closes, so the window's
                      width says little about the page's. */}
                  <ul className="gap-ws-7 grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))]">
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
                <div className="py-ws-20">
                  <EmptyState
                    title={
                      category === 'all'
                        ? `No apps match “${query.trim()}”`
                        : `No ${categoryLabel} apps match “${query.trim()}”`
                    }
                    description="Check the spelling, or tell us which app you need at integrations@orbit.so."
                  >
                    <Button
                      size="sm"
                      variant="secondary"
                      preset="border"
                      onClick={() => (elsewhere ? setCategory('all') : setQuery(''))}
                    >
                      {elsewhere ? 'Search all categories' : 'Clear search'}
                    </Button>
                  </EmptyState>
                </div>
              )}
            </div>
          </div>
        </div>
      </AppShell.Main>

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
    </AppShell>
  );
}
