import { Avatar, StatusBadge, Table, Tag } from '@wideset/react';

import { type Customer, HEALTH, OWNERS, PLAN_LABEL } from './data';
import { formatActivity, formatDateTime, formatUsd } from './format';
import { PersonAvatar } from './person-avatar';
import { RowMenu } from './row-menu';
import { TourSpot } from './tour-spot';

/** `Halcyon Freight` → `HF`, `Marlow & Finch` → `MF`. */
const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter((word) => /^[A-Z]/.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join('');

/**
 * The customers in the current segment: who, their plan, what they pay, their health, who owns
 * them and when they were last in touch. The first row's menu is the tour's third stop, so it is
 * the one wrapped in a `TourSpot`.
 */
export function CustomersTable({
  rows,
  onAssignToMe,
}: {
  rows: Customer[];
  onAssignToMe: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table size="md" className="min-w-[60rem] table-fixed">
        <Table.Head>
          <Table.Row>
            <Table.Header>Company</Table.Header>
            <Table.Header className="w-[8rem]">Plan</Table.Header>
            <Table.Header align="right" className="w-[8rem]">
              MRR
            </Table.Header>
            <Table.Header className="w-[8.5rem]">Health</Table.Header>
            <Table.Header className="w-[11rem]">Owner</Table.Header>
            <Table.Header className="w-[10rem]">Last activity</Table.Header>
            <Table.Header className="w-[3.5rem]">
              <span className="sr-only">Actions</span>
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map((customer, index) => {
            const owner = OWNERS[customer.owner];
            const health = HEALTH[customer.health];
            const menu = (
              <RowMenu customer={customer} onAssignToMe={() => onAssignToMe(customer.id)} />
            );
            return (
              <Table.Row key={customer.id}>
                <Table.Cell>
                  <div className="gap-ws-7 flex items-center">
                    <Avatar shape="square" initials={initialsOf(customer.name)} />
                    <div className="min-w-0">
                      <span className="text-ws-static-strong block truncate">{customer.name}</span>
                      <Table.CellDescription className="truncate">
                        {customer.id}
                      </Table.CellDescription>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <Tag color="secondary" size="sm">
                    {PLAN_LABEL[customer.plan]}
                  </Tag>
                </Table.Cell>
                <Table.Cell align="right">
                  {customer.mrr > 0 ? (
                    <span className="typography-number-sm tabular-nums">
                      {formatUsd(customer.mrr)}
                    </span>
                  ) : (
                    <span className="text-ws-static-subtle">—</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge size="sm" color={health.color}>
                    {health.label}
                  </StatusBadge>
                </Table.Cell>
                <Table.Cell>
                  <div className="gap-ws-5 flex items-center">
                    <PersonAvatar size="sm" name={owner.name} initials={owner.initials} />
                    <span className="truncate">{owner.name}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <time
                    dateTime={customer.lastActivity}
                    title={formatDateTime(customer.lastActivity)}
                    className="text-ws-static-subtle"
                  >
                    {formatActivity(customer.lastActivity)}
                  </time>
                </Table.Cell>
                <Table.Cell align="right">
                  {index === 0 ? (
                    <TourSpot id="row-menu" className="inline-flex">
                      {menu}
                    </TourSpot>
                  ) : (
                    menu
                  )}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
