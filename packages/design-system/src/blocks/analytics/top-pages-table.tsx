import { cn, type SortDirection, Table } from '@wideset/react';
import { useId, useState } from 'react';

import type { report } from './data';
import { formatCount, formatDuration, formatPercent } from './format';

type Page = ReturnType<typeof report>['pages'][number];
type Key = keyof Page;

const COLUMNS: {
  key: Key;
  label: string;
  format: (page: Page) => string;
  numeric?: boolean;
  /** The page's name and the column the table is about: what the eye looks for. */
  strong?: boolean;
  className?: string;
}[] = [
  { key: 'path', label: 'Page', format: (page) => page.path, strong: true, className: 'w-[30%]' },
  {
    key: 'visitors',
    label: 'Visitors',
    format: (page) => formatCount(page.visitors),
    numeric: true,
    strong: true,
  },
  { key: 'views', label: 'Views', format: (page) => formatCount(page.views), numeric: true },
  {
    key: 'bounceRate',
    label: 'Bounce rate',
    format: (page) => formatPercent(page.bounceRate),
    numeric: true,
  },
  {
    key: 'seconds',
    label: 'Avg. time',
    format: (page) => formatDuration(page.seconds),
    numeric: true,
  },
];

// The first and last columns sit on the section's edges, in line with its title.
const flush = (index: number) => index === 0 || index === COLUMNS.length - 1;

/** The most visited pages of the period; every column sorts, most visitors first. */
export function TopPagesTable({ pages, className }: { pages: Page[]; className?: string }) {
  const titleId = useId();
  const [sort, setSort] = useState<{ key: Key; direction: SortDirection }>({
    key: 'visitors',
    direction: 'desc',
  });

  const rows = sort.direction
    ? [...pages].sort((a, b) => {
        const order = a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0;
        return sort.direction === 'asc' ? order : -order;
      })
    : pages;

  // A column sorts in its natural order first: numbers largest first, text from A.
  const sortBy = (key: Key, numeric?: boolean) =>
    setSort((current) => ({
      key,
      direction:
        current.key === key
          ? current.direction === 'desc'
            ? 'asc'
            : 'desc'
          : numeric
            ? 'desc'
            : 'asc',
    }));

  return (
    <section aria-labelledby={titleId} className={cn('gap-ws-7 flex flex-col', className)}>
      <h2 id={titleId} className="typography-label-strong-md text-ws-static-strong">
        Top pages
      </h2>
      <Table aria-labelledby={titleId} className="w-full table-fixed">
        <Table.Head>
          <Table.Row>
            {COLUMNS.map((column, index) => (
              <Table.Header
                key={column.key}
                align={column.numeric ? 'right' : 'left'}
                flushMargin={flush(index)}
                className={column.className}
                sortable
                sortDirection={sort.key === column.key ? sort.direction : null}
                onSort={() => sortBy(column.key, column.numeric)}
              >
                {column.label}
              </Table.Header>
            ))}
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {rows.map((page) => (
            <Table.Row key={page.path}>
              {COLUMNS.map((column, index) => (
                <Table.Cell
                  key={column.key}
                  align={column.numeric ? 'right' : 'left'}
                  flushMargin={flush(index)}
                  truncate={!column.numeric}
                >
                  <span
                    className={cn(
                      column.numeric && 'tabular-nums',
                      column.strong && 'text-ws-static-strong',
                    )}
                  >
                    {column.format(page)}
                  </span>
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </section>
  );
}
