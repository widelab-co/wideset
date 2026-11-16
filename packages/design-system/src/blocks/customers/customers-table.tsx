import { Avatar, Checkbox, StatusBadge, Table, Tag } from '@wideset/react';

import { type Customer, HEALTH, OWNERS, PLAN_LABEL, type SortKey } from './data';
import { EmptyState } from './empty-state';
import { formatActivity, formatDateTime, formatUsd } from './format';
import { PersonAvatar } from './person-avatar';
import { RowMenu } from './row-menu';

export type Sort = { key: SortKey; direction: 'asc' | 'desc' };

const COLUMN_COUNT = 8;

/**
 * One page of customers. A click anywhere on a row selects it; the checkbox is the same control
 * for the keyboard, and the header's checkbox takes the whole page.
 */
export function CustomersTable({
  rows,
  sort,
  onSort,
  selected,
  onSelectedChange,
  onAssignToMe,
  onClearFilters,
}: {
  rows: Customer[];
  sort: Sort;
  onSort: (key: SortKey) => void;
  selected: string[];
  onSelectedChange: (ids: string[]) => void;
  onAssignToMe: (id: string) => void;
  onClearFilters: () => void;
}) {
  const ids = rows.map((row) => row.id);
  const picked = ids.filter((id) => selected.includes(id)).length;
  const toggle = (id: string) =>
    onSelectedChange(
      selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
    );
  const sortable = (key: SortKey) => ({
    sortable: true,
    sortDirection: sort.key === key ? sort.direction : null,
    onSort: () => onSort(key),
  });

  return (
    // Narrower than its columns, the table scrolls sideways inside its own area.
    <div className="relative overflow-x-auto">
      <Table
        size="md"
        selectionMode={rows.length > 0 ? 'multiple' : undefined}
        className="min-w-[68rem] table-fixed"
      >
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
            <Table.Header {...sortable('name')}>Company</Table.Header>
            <Table.Header className="w-[8rem]">Plan</Table.Header>
            <Table.Header align="right" className="w-[8.5rem]" {...sortable('mrr')}>
              MRR
            </Table.Header>
            <Table.Header className="w-[8.5rem]">Health</Table.Header>
            <Table.Header className="w-[11rem]">Owner</Table.Header>
            <Table.Header className="w-[10.5rem]" {...sortable('lastActivity')}>
              Last activity
            </Table.Header>
            <Table.Header className="w-[3.5rem]">
              <span className="sr-only">Actions</span>
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={COLUMN_COUNT}>
                <EmptyState onClearFilters={onClearFilters} />
              </Table.Cell>
            </Table.Row>
          ) : (
            rows.map((customer) => {
              const owner = OWNERS[customer.owner];
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
                    <div className="gap-ws-7 flex items-center">
                      <Avatar shape="square" initials={initialsOf(customer.name)} />
                      <div className="min-w-0">
                        <span className="text-ws-static-strong block truncate">
                          {customer.name}
                        </span>
                        <Table.CellDescription className="truncate">
                          {customer.domain}
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
                  {/* The menu is its own target: its clicks must not select the row. */}
                  <Table.Cell align="right" onClick={(event) => event.stopPropagation()}>
                    <RowMenu customer={customer} onAssignToMe={() => onAssignToMe(customer.id)} />
                  </Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table>
    </div>
  );
}

/** `Halcyon Freight` → `HF`, `Thistle & Co.` → `TC`. */
const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter((word) => /^[A-Z]/.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join('');
