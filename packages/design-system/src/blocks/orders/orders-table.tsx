// TODO(custom): whole-row link done with a stretched <a>; Table has no row link.
import { Avatar, Button, StatusBadge, Table } from '@wideset/react';

import {
  CUSTOMERS,
  ITEMS,
  type Order,
  refundableFor,
  type Sort,
  type SortKey,
  STATUS,
  totalOf,
} from './data';
import { EmptyState } from './empty-state';
import { formatDate, formatUsd } from './format';
import { RowMenu } from './row-menu';

const COLUMN_COUNT = 7;

/**
 * One page of orders, a line each: number, who bought (behind the company's initials), when,
 * what, where it stands and what it came to. A row opens its order from anywhere on it; the ⋯ at
 * its end is its own target. The date and the total sort from their headers, the same sort the
 * toolbar's select holds.
 */
export function OrdersTable({
  rows,
  sort,
  onSort,
  onRefund,
  onClearFilters,
}: {
  rows: Order[];
  sort: Sort;
  onSort: (key: SortKey) => void;
  onRefund: (order: Order) => void;
  onClearFilters: () => void;
}) {
  const sortable = (key: SortKey) => ({
    sortable: true,
    sortDirection: sort.key === key ? sort.direction : null,
    onSort: () => onSort(key),
  });

  return (
    // Narrower than its columns, the table scrolls sideways inside its own area.
    <div className="overflow-x-auto">
      <Table size="md" interactive={rows.length > 0} className="min-w-[60rem] table-fixed">
        <Table.Head>
          <Table.Row>
            <Table.Header className="w-[7rem]">Order</Table.Header>
            <Table.Header className="w-[13rem]">Customer</Table.Header>
            <Table.Header className="w-[8.5rem]" {...sortable('placed')}>
              Date
            </Table.Header>
            <Table.Header>Items</Table.Header>
            <Table.Header className="w-[10rem]">Status</Table.Header>
            <Table.Header align="right" className="w-[9rem]" {...sortable('total')}>
              Total
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
                <div className="py-ws-20">
                  <EmptyState
                    title="No orders match"
                    description="Try another number or customer, or clear the filters."
                  >
                    <Button size="sm" variant="secondary" preset="border" onClick={onClearFilters}>
                      Clear filters
                    </Button>
                  </EmptyState>
                </div>
              </Table.Cell>
            </Table.Row>
          ) : (
            rows.map((order) => {
              const status = STATUS[order.status];
              const customer = CUSTOMERS[order.customer];
              const [[first], ...more] = order.lines;
              return (
                // The number's link stretches over the whole row: one target, the hover on every
                // cell.
                <Table.Row key={order.id} className="relative">
                  <Table.Cell>
                    <a
                      href={`#order-${order.id}`}
                      className="text-ws-static-strong focus-visible:wds-focus-visible outline-ws-dynamic-primary-strong-default after:inset-ws-0 tabular-nums after:absolute"
                    >
                      #{order.id}
                    </a>
                  </Table.Cell>
                  <Table.Cell>
                    {/* The company's initials on a square: a face for the name, not a second
                        label, so it is hidden from screen readers. */}
                    <div className="gap-ws-7 flex items-center">
                      <Avatar shape="square" initials={customer.initials} aria-hidden="true" />
                      <span className="truncate">{customer.name}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="tabular-nums">
                    <time dateTime={order.placed}>{formatDate(order.placed)}</time>
                  </Table.Cell>
                  <Table.Cell truncate>
                    {ITEMS[first].name}
                    {more.length > 0 && (
                      <span className="text-ws-static-subtle"> +{more.length} more</span>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <StatusBadge color={status.color}>{status.label}</StatusBadge>
                  </Table.Cell>
                  <Table.Cell align="right" className="tabular-nums">
                    {formatUsd(totalOf(order))}
                  </Table.Cell>
                  {/* Above the row's link, so the menu is reached and not the order. */}
                  <Table.Cell align="right" className="relative">
                    <RowMenu
                      order={`#${order.id}`}
                      href={`#order-${order.id}`}
                      onRefund={refundableFor(order) > 0 ? () => onRefund(order) : undefined}
                    />
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
