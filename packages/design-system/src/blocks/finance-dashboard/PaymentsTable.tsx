import { Avatar, ProgressBar, type SortDirection, StatusBadge, Table } from '@wideset/react';
import { useState } from 'react';

import { type Payment, PAYMENTS } from './data';
import { formatDate, formatUsd } from './format';

type Key = Exclude<keyof Payment, 'id' | 'initials'>;

const COLUMNS: { key: Key; label: string; align?: 'right'; className?: string }[] = [
  { key: 'customer', label: 'Customer', className: 'w-[23%]' },
  { key: 'type', label: 'Type' },
  { key: 'status', label: 'Label' },
  { key: 'progress', label: 'Progress' },
  { key: 'due', label: 'Due date' },
  { key: 'amount', label: 'Amount', align: 'right' },
];

const STATUS = {
  approved: { label: 'Approved', color: 'positive', progress: 'success' },
  declined: { label: 'Declined', color: 'negative', progress: 'default' },
} as const;

/** Recent payments; every column sorts. */
export function PaymentsTable() {
  const [sort, setSort] = useState<{ key: Key; direction: SortDirection }>({
    key: 'due',
    direction: null,
  });

  const rows = sort.direction
    ? [...PAYMENTS].sort((a, b) => {
        const order = a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0;
        return sort.direction === 'asc' ? order : -order;
      })
    : PAYMENTS;

  return (
    <Table className="w-full table-fixed">
      <Table.Head>
        <Table.Row>
          {COLUMNS.map((column) => (
            <Table.Header
              key={column.key}
              align={column.align}
              className={column.className}
              sortable
              sortDirection={sort.key === column.key ? sort.direction : null}
              onSort={() =>
                setSort({
                  key: column.key,
                  direction: sort.key === column.key && sort.direction === 'asc' ? 'desc' : 'asc',
                })
              }
            >
              {column.label}
            </Table.Header>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((payment) => {
          const status = STATUS[payment.status];
          return (
            <Table.Row key={payment.id}>
              <Table.Cell>
                <div className="gap-ws-7 flex items-center">
                  <Avatar size="sm" initials={payment.initials} status="online" />
                  {payment.customer}
                </div>
              </Table.Cell>
              <Table.Cell>{payment.type}</Table.Cell>
              <Table.Cell>
                <StatusBadge color={status.color}>{status.label}</StatusBadge>
              </Table.Cell>
              <Table.Cell>
                <div className="w-[5rem]">
                  <ProgressBar
                    value={payment.progress}
                    variant={status.progress}
                    aria-label={`${payment.customer}: settled`}
                  />
                </div>
              </Table.Cell>
              <Table.Cell>{formatDate(payment.due)}</Table.Cell>
              <Table.Cell align="right">
                <span className="typography-number-sm tabular-nums">
                  {formatUsd(payment.amount)}
                </span>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
