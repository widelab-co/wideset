import { RiCloseLine } from '@remixicon/react';
import {
  Button,
  IconButton,
  InlineAlert,
  Sidepanel,
  StatusBadge,
  Switch,
  Table,
} from '@wideset/react';
import { useId } from 'react';

import { AppLogo } from './app-logo';
import { STATUS } from './connected-table';
import type { App, Connection } from './data';
import { formatDay } from './format';

type AppPanelProps = {
  app: App;
  /** Set when the app is already connected: the panel then manages it instead of connecting it. */
  connection: Connection | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  /** Pausing and resuming the sync; resuming an expired connection reconnects it. */
  onSyncChange: (syncing: boolean) => void;
};

/**
 * One app beside the page: what it does and exactly what Orbit may read or change in it, then
 * Connect. For a connected app the same panel pauses the sync, reconnects an expired one or
 * disconnects it.
 */
export function AppPanel({
  app,
  connection,
  open,
  onOpenChange,
  onConnect,
  onDisconnect,
  onSyncChange,
}: AppPanelProps) {
  const accessId = useId();

  const status = connection && STATUS[connection.status];
  const expired = connection?.status === 'expired';

  return (
    <Sidepanel open={open} onOpenChange={onOpenChange}>
      <Sidepanel.Panel size="sm">
        <Sidepanel.Actions>
          <Sidepanel.Close asChild>
            <IconButton
              variant="secondary"
              preset="border"
              size="sm"
              icon={RiCloseLine}
              aria-label="Close"
            />
          </Sidepanel.Close>
        </Sidepanel.Actions>

        <Sidepanel.Header>
          <div className="gap-ws-9 pr-ws-16 flex items-center">
            <AppLogo app={app} size="lg" />
            <div className="gap-ws-3 flex min-w-0 flex-col">
              <div className="gap-ws-5 flex items-center">
                <Sidepanel.Title>{app.name}</Sidepanel.Title>
                {status && <StatusBadge color={status.color}>{status.label}</StatusBadge>}
              </div>
              <Sidepanel.Description className="mt-ws-0">
                {connection
                  ? `Connected by ${connection.connectedBy} on ${formatDay(connection.connectedOn)}`
                  : app.summary}
              </Sidepanel.Description>
            </div>
          </div>
        </Sidepanel.Header>

        <Sidepanel.Content className="gap-ws-12 flex flex-col">
          {expired && (
            <InlineAlert
              status="error"
              orientation="vertical"
              persistent
              title={`Orbit can’t reach ${app.name}`}
              message={`The access ${app.name} gave Orbit expired on ${formatDay(connection.lastSync)}, so ${connection.syncs.toLowerCase()} stopped syncing. Reconnect to pick up where it left off.`}
            />
          )}

          <p className="typography-body-md text-ws-static-base">{app.about}</p>

          {connection && !expired && (
            <Switch
              size="sm"
              labelPosition="left"
              label="Sync with Orbit"
              className="w-full justify-between"
              checked={connection.status === 'active'}
              onCheckedChange={onSyncChange}
            />
          )}

          <section aria-labelledby={accessId} className="gap-ws-5 flex flex-col">
            <h3 id={accessId} className="typography-label-strong-md text-ws-static-strong">
              What Orbit can access
            </h3>
            <Table aria-labelledby={accessId} className="w-full table-fixed">
              <Table.Head>
                <Table.Row>
                  <Table.Header flushMargin>Data</Table.Header>
                  <Table.Header flushMargin align="right" className="w-[9rem]">
                    Access
                  </Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {app.scopes.map((scope) => (
                  <Table.Row key={scope.data}>
                    <Table.Cell flushMargin>{scope.data}</Table.Cell>
                    <Table.Cell flushMargin align="right">
                      {scope.access}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </section>

          {!connection && (
            <p className="typography-body-md text-ws-static-subtle">
              You approve this access in {app.name}. Any admin of the workspace can disconnect it
              later.
            </p>
          )}
        </Sidepanel.Content>

        <Sidepanel.Footer>
          {connection ? (
            <>
              <Button size="sm" variant="danger" preset="ghost" onClick={onDisconnect}>
                Disconnect
              </Button>
              <div className="gap-ws-5 ml-auto flex">
                {expired ? (
                  <Button size="sm" onClick={() => onSyncChange(true)}>
                    Reconnect {app.name}
                  </Button>
                ) : (
                  <Sidepanel.Close asChild>
                    <Button size="sm" variant="secondary" preset="border">
                      Done
                    </Button>
                  </Sidepanel.Close>
                )}
              </div>
            </>
          ) : (
            <div className="gap-ws-5 ml-auto flex">
              <Sidepanel.Close asChild>
                <Button size="sm" variant="secondary" preset="border">
                  Cancel
                </Button>
              </Sidepanel.Close>
              <Button size="sm" onClick={onConnect}>
                Connect {app.name}
              </Button>
            </div>
          )}
        </Sidepanel.Footer>
      </Sidepanel.Panel>
    </Sidepanel>
  );
}
