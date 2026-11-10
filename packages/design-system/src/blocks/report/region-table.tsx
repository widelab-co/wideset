import { cn, type SortDirection, Table } from '@wideset/react';
import { useId, useState } from 'react';

import type { Summary } from './data';
import { formatPercentSigned, formatUsd, formatUsdSigned } from './format';

type Row = Omit<Summary['regions'][number], 'id'> & { id: string; change: number | null };
type Key = 'label' | 'new' | 'expansion' | 'churn' | 'net' | 'mrr' | 'change';

const money = (key: 'new' | 'expansion' | 'mrr') => (row: Row) => formatUsd(row[key]);
const change = (value: number | null) => (value === null ? '—' : formatPercentSigned(value));

const COLUMNS: {
  key: Key;
  label: string;
  format: (row: Row) => string;
  /** The region's name and its MRR: what the eye looks for. */
  strong?: boolean;
  className?: string;
}[] = [
  { key: 'label', label: 'Region', format: (row) => row.label, strong: true, className: 'w-[22%]' },
  { key: 'new', label: 'New', format: money('new') },
  { key: 'expansion', label: 'Expansion', format: money('expansion') },
  { key: 'churn', label: 'Churned', format: (row) => formatUsdSigned(-row.churn) },
  { key: 'net', label: 'Net new', format: (row) => formatUsdSigned(row.net) },
  { key: 'mrr', label: 'MRR', format: money('mrr'), strong: true },
  { key: 'change', label: 'Change', format: (row) => change(row.change) },
];

// The first and last columns sit on the section's edges, in line with its title.
const flush = (index: number) => index === 0 || index === COLUMNS.length - 1;

type RegionTableProps = {
  current: Summary;
  previous: Summary | null;
  className?: string;
};

/**
 * The range by region: the money that came in and went out, the MRR it left, and how that MRR
 * moved against the comparison. Every column sorts; the totals stay in the footer.
 */
export function RegionTable({ current, previous, className }: RegionTableProps) {
  const titleId = useId();
  const [sort, setSort] = useState<{ key: Key; direction: SortDirection }>({
    key: 'mrr',
    direction: 'desc',
  });

  const growth = (now: number, before?: number) => (before ? now / before - 1 : null);
  const regions: Row[] = current.regions.map((region, index) => ({
    ...region,
    change: growth(region.mrr, previous?.regions[index].mrr),
  }));
  const total: Row = {
    id: 'total',
    label: 'Total',
    new: current.new,
    expansion: current.expansion,
    churn: current.churn,
    net: current.net,
    mrr: current.mrr,
    change: growth(current.mrr, previous?.mrr),
  };

  const rows = sort.direction
    ? [...regions].sort((a, b) => {
        const left = a[sort.key] ?? -Infinity;
        const right = b[sort.key] ?? -Infinity;
        const order = left < right ? -1 : left > right ? 1 : 0;
        return sort.direction === 'asc' ? order : -order;
      })
    : regions;

  // A column sorts in its natural order first: amounts largest first, names from A.
  const sortBy = (key: Key) =>
    setSort((now) => ({
      key,
      direction:
        now.key === key
          ? now.direction === 'desc'
            ? 'asc'
            : 'desc'
          : key === 'label'
            ? 'asc'
            : 'desc',
    }));

  return (
    <section aria-labelledby={titleId} className={cn('gap-ws-7 flex flex-col', className)}>
      <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
        By region
      </h2>
      <Table aria-labelledby={titleId} className="w-full table-fixed">
        <Table.Head>
          <Table.Row>
            {COLUMNS.map((column, index) => (
              <Table.Header
                key={column.key}
                align={index ? 'right' : 'left'}
                flushMargin={flush(index)}
                className={column.className}
                sortable
                sortDirection={sort.key === column.key ? sort.direction : null}
                onSort={() => sortBy(column.key)}
              >
                {column.label}
              </Table.Header>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map((row) => (
            <Table.Row key={row.id}>
              {COLUMNS.map((column, index) => (
                <Table.Cell
                  key={column.key}
                  align={index ? 'right' : 'left'}
                  flushMargin={flush(index)}
                >
                  <span
                    className={cn(
                      index > 0 && 'tabular-nums',
                      column.strong && 'text-ws-static-strong',
                    )}
                  >
                    {column.format(row)}
                  </span>
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Foot>
          <Table.Row>
            {COLUMNS.map((column, index) => (
              <Table.Cell
                key={column.key}
                align={index ? 'right' : 'left'}
                flushMargin={flush(index)}
              >
                <span
                  className={cn(
                    'text-ws-static-strong font-ws-medium',
                    index > 0 && 'tabular-nums',
                  )}
                >
                  {column.format(total)}
                </span>
              </Table.Cell>
            ))}
          </Table.Row>
        </Table.Foot>
      </Table>
    </section>
  );
}
