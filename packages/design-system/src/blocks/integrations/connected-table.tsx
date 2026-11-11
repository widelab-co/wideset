import { Button, StatusBadge, type StatusBadgeProps, Table } from '@wideset/react';
import { useId } from 'react';

import { AppLogo } from './app-logo';
import type { App, Connection, ConnectionStatus } from './data';
import { formatSince } from './format';

/**
 * Only an expired connection asks for action now, so only it takes a colour; active and paused
 * are lifecycle states and stay neutral, the word carrying them.
 */
export const STATUS: Record<
  ConnectionStatus,
  { label: string; color: NonNullable<StatusBadgeProps['color']> }
> = {
  active: { label: 'Active', color: 'neutral' },
  paused: { label: 'Paused', color: 'neutral' },
  expired: { label: 'Access expired', color: 'negative' },
};

type ConnectedTableProps = {
  rows: { app: App; connection: Connection }[];
  onManage: (appId: string) => void;
};

/** The apps already connected: what each syncs, how it is doing, and the way into its settings. */
export function ConnectedTable({ rows, onManage }: ConnectedTableProps) {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="gap-ws-5 flex flex-col">
      <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
        Connected
      </h2>
      {/* On the page's white the table needs no box: its own lines carry it. */}
      <div className="relative overflow-x-auto">
        <Table aria-labelledby={titleId} className="w-full min-w-[52rem] table-fixed">
          <Table.Head>
            <Table.Row>
              <Table.Header flushMargin className="w-[26%]">
                App
              </Table.Header>
              <Table.Header className="w-[30%]">Syncs</Table.Header>
              <Table.Header className="w-[18%]">Status</Table.Header>
              <Table.Header className="w-[13%]">Last sync</Table.Header>
              <Table.Header flushMargin align="right">
                <span className="sr-only">Actions</span>
              </Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rows.map(({ app, connection }) => {
              const status = STATUS[connection.status];
              return (
                <Table.Row key={app.id}>
                  <Table.Cell flushMargin>
                    <span className="gap-ws-5 flex min-w-0 items-center">
                      <AppLogo app={app} size="md" />
                      <span className="text-ws-static-strong truncate">{app.name}</span>
                    </span>
                  </Table.Cell>
                  <Table.Cell truncate>{connection.syncs}</Table.Cell>
                  <Table.Cell>
                    <StatusBadge color={status.color}>{status.label}</StatusBadge>
                  </Table.Cell>
                  <Table.Cell className="tabular-nums">
                    {formatSince(connection.lastSync)}
                  </Table.Cell>
                  <Table.Cell flushMargin align="right">
                    <Button
                      size="sm"
                      variant="secondary"
                      preset={connection.status === 'expired' ? 'border' : 'ghost'}
                      onClick={() => onManage(app.id)}
                      aria-label={
                        connection.status === 'expired'
                          ? `Reconnect ${app.name}`
                          : `Manage ${app.name}`
                      }
                    >
                      {connection.status === 'expired' ? 'Reconnect' : 'Manage'}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </section>
  );
}
