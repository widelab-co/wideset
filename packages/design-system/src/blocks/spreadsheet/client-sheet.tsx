import { RiAddLine, RiArrowDownLine, RiArrowUpLine } from '@remixicon/react';
import {
  Checkbox,
  cn,
  DropdownMenu,
  IconButton,
  ListItem,
  Spreadsheet,
  StatusBadge,
  Tag,
} from '@wideset/react';
import { useState } from 'react';

import { ColumnSummary } from './column-summary';
import { type Client, CLIENTS, type ColumnKey, COLUMNS } from './data';

const count = new Intl.NumberFormat('en-US');
// Calendar days (`2023-03-15`) parse as UTC midnight: format them in UTC too.
const day = new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

type Sort = { key: ColumnKey; direction: 'asc' | 'desc' };

const SORTS = [
  { direction: 'asc', label: 'Sort ascending', icon: RiArrowUpLine },
  { direction: 'desc', label: 'Sort descending', icon: RiArrowDownLine },
] as const;

/** Tags and badges sort by their label; empty values go last either way. */
const byColumn =
  ({ key, direction }: Sort) =>
  (a: Client, b: Client) => {
    const [x, y] = [a[key], b[key]].map((value) =>
      typeof value === 'object' ? value.label : value,
    );
    if (x === undefined || y === undefined) return x === y ? 0 : x === undefined ? 1 : -1;
    const order = String(x).localeCompare(String(y), 'en', { numeric: true });
    return direction === 'desc' ? -order : order;
  };

/**
 * The clients in a Spreadsheet: typed headers whose menus sort, a summary of each column under
 * them, row numbers that turn into checkboxes, and a row and a column to add. The grid is the
 * page's canvas: it fills the window and bleeds 1px past both edges, so its outer lines fall
 * outside the window, as in Figma.
 */
export function ClientSheet({ className }: { className?: string }) {
  const [clients, setClients] = useState(CLIENTS);
  // Rows keep the table's own order until a header menu sorts them by a column.
  const [sort, setSort] = useState<Sort | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const rows = sort ? [...clients].sort(byColumn(sort)) : clients;
  const all = selected.length === clients.length;
  const toggle = (id: number) =>
    setSelected((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  return (
    <Spreadsheet
      aria-label="Clients"
      stickyColumns={2}
      className={cn('bg-ws-static-foreground -mx-ws-1 w-auto', className)}
    >
      <Spreadsheet.Head>
        <Spreadsheet.Row>
          {/* 46px: its left edge sits 1px past the window, so 45px show. */}
          <Spreadsheet.ColumnHeader align="center" className="w-[2.875rem]">
            <Checkbox
              aria-label="Select all clients"
              checked={all ? true : selected.length ? 'indeterminate' : false}
              onCheckedChange={() => setSelected(all ? [] : clients.map((client) => client.id))}
            />
          </Spreadsheet.ColumnHeader>
          {COLUMNS.map(({ key, label, icon }) => (
            <Spreadsheet.ColumnHeader
              key={key}
              className="w-[9.5rem]"
              sortDirection={sort?.key === key ? sort.direction : null}
            >
              <Spreadsheet.ColumnHeaderIcon icon={icon} />
              {label}
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <Spreadsheet.ColumnHeaderTrigger aria-label={`${label} options`} />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="start">
                  {SORTS.map((item) => (
                    <DropdownMenu.Item
                      key={item.direction}
                      onSelect={() => setSort({ key, direction: item.direction })}
                    >
                      <ListItem.Prefix>
                        <item.icon className="size-ws-9" />
                      </ListItem.Prefix>
                      <ListItem.Content>
                        <ListItem.Label>{item.label}</ListItem.Label>
                      </ListItem.Content>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu>
            </Spreadsheet.ColumnHeader>
          ))}
          <Spreadsheet.ColumnHeader>
            <IconButton
              icon={RiAddLine}
              size="xs"
              preset="ghost"
              variant="secondary"
              aria-label="Add column"
            />
          </Spreadsheet.ColumnHeader>
        </Spreadsheet.Row>

        <Spreadsheet.Row className="h-ws-22">
          <Spreadsheet.RowHeader aria-label="Summary" />
          {COLUMNS.map(({ key, summary }) => (
            <Spreadsheet.Cell key={key}>
              <ColumnSummary summary={summary} />
            </Spreadsheet.Cell>
          ))}
          <Spreadsheet.Cell />
        </Spreadsheet.Row>
      </Spreadsheet.Head>

      <Spreadsheet.Body>
        {rows.map((client, index) => (
          <Spreadsheet.Row key={client.id} className="group/row">
            <Spreadsheet.RowHeader>
              {/* The number, or the checkbox: on hover, with focus in the row, or once any is selected. */}
              <span
                className={cn(
                  selected.length
                    ? 'hidden'
                    : 'group-focus-within/row:hidden group-hover/row:hidden',
                )}
              >
                {index}
              </span>
              <Checkbox
                aria-label={`Select ${client.name}`}
                checked={selected.includes(client.id)}
                onCheckedChange={() => toggle(client.id)}
                className={cn(
                  !selected.length && 'hidden group-focus-within/row:flex group-hover/row:flex',
                )}
              />
            </Spreadsheet.RowHeader>
            {COLUMNS.map(({ key }) => (
              <ClientCell key={key} client={client} column={key} />
            ))}
            <Spreadsheet.Cell />
          </Spreadsheet.Row>
        ))}
        <Spreadsheet.Row>
          <Spreadsheet.RowHeader>
            <IconButton
              icon={RiAddLine}
              size="xs"
              preset="ghost"
              variant="secondary"
              aria-label="Add client"
              onClick={() =>
                setClients((list) => [...list, { id: list.length, name: 'New client' }])
              }
            />
          </Spreadsheet.RowHeader>
          <Spreadsheet.Cell colSpan={COLUMNS.length + 1} />
        </Spreadsheet.Row>
      </Spreadsheet.Body>
    </Spreadsheet>
  );
}

/** One field of a client: numbers to the right, categories as tags, the market as a status. */
function ClientCell({ client, column }: { client: Client; column: ColumnKey }) {
  switch (column) {
    case 'customers':
    case 'employees': {
      const value = client[column];
      return (
        <Spreadsheet.Cell align="right">
          {value === undefined ? null : count.format(value)}
        </Spreadsheet.Cell>
      );
    }
    case 'country':
      return (
        <Spreadsheet.Cell>
          {client.country && (
            <Tag size="sm" color={client.country.color}>
              {client.country.label}
            </Tag>
          )}
        </Spreadsheet.Cell>
      );
    case 'added':
      return (
        <Spreadsheet.Cell>{client.added && day.format(new Date(client.added))}</Spreadsheet.Cell>
      );
    case 'market':
      return (
        <Spreadsheet.Cell>
          {client.market && (
            <StatusBadge size="sm" color={client.market.color}>
              {client.market.label}
            </StatusBadge>
          )}
        </Spreadsheet.Cell>
      );
    case 'website':
      return (
        <Spreadsheet.Cell>
          {client.website && (
            <a
              href={client.website}
              title={client.website}
              target="_blank"
              rel="noreferrer"
              className="truncate underline"
            >
              {client.website}
            </a>
          )}
        </Spreadsheet.Cell>
      );
    default:
      return <Spreadsheet.Cell>{client[column]}</Spreadsheet.Cell>;
  }
}
