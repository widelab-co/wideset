import { Avatar, Checkbox, StatusBadge, Table } from '@wideset/react';

import { type Customer, HEALTH, PEOPLE } from './data';
import { formatDay, formatUsd } from './format';

/**
 * One page of customers. A click anywhere on a row selects it; the checkbox is the same control
 * for the keyboard, and the header's checkbox takes the whole page. The selection outlives the
 * page and the filters, so it can be exported on its own.
 */
export function CustomersTable({
  rows,
  selected,
  onSelectedChange,
}: {
  rows: Customer[];
  selected: string[];
  onSelectedChange: (ids: string[]) => void;
}) {
  const ids = rows.map((row) => row.id);
  const picked = ids.filter((id) => selected.includes(id)).length;
  const toggle = (id: string) =>
    onSelectedChange(
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
    );

  return (
    // Narrower than its columns, the table scrolls sideways inside its own area.
    <div className="overflow-x-auto">
      <Table size="md" selectionMode="multiple" className="min-w-[56rem] table-fixed">
        <Table.Head>
          <Table.Row>
            <Table.Header className="w-[3.25rem]">
              <Checkbox
                aria-label="Select all customers on this page"
                disabled={rows.length === 0}
                checked={picked === 0 ? false : picked === ids.length ? true : 'indeterminate'}
                onCheckedChange={(checked) =>
                  onSelectedChange(
                    checked === true
                      ? [...new Set([...selected, ...ids])]
                      : selected.filter((id) => !ids.includes(id)),
                  )
                }
              />
            </Table.Header>
            <Table.Header>Company</Table.Header>
            <Table.Header className="w-[11rem]">Owner</Table.Header>
            <Table.Header className="w-[8rem]">Health</Table.Header>
            <Table.Header align="right" className="w-[8rem]">
              ARR
            </Table.Header>
            <Table.Header className="w-[9rem]">Added</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map((customer) => {
            const owner = PEOPLE[customer.owner];
            const health = HEALTH[customer.health];
            const isSelected = selected.includes(customer.id);
            return (
              <Table.Row
                key={customer.id}
                selected={isSelected}
                onClick={() => toggle(customer.id)}
              >
                <Table.Cell>
                  <Checkbox checked={isSelected} aria-label={`Select ${customer.name}`} />
                </Table.Cell>
                <Table.Cell>
                  <span className="text-ws-static-strong block truncate">{customer.name}</span>
                  <Table.CellDescription className="truncate">
                    {customer.domain}
                  </Table.CellDescription>
                </Table.Cell>
                <Table.Cell>
                  <div className="gap-ws-5 flex items-center">
                    <Avatar size="sm" initials={owner.initials} color={owner.color} />
                    <span className="truncate">{owner.name}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge size="sm" color={health.color}>
                    {health.label}
                  </StatusBadge>
                </Table.Cell>
                <Table.Cell align="right">
                  <span className="typography-number-sm tabular-nums">
                    {formatUsd(customer.arr)}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <time dateTime={customer.added} className="text-ws-static-subtle">
                    {formatDay(customer.added)}
                  </time>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}
