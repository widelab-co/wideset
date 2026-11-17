/**
 * A column header names its column and its data type: `Spreadsheet.ColumnHeaderIcon` before the
 * label, `Spreadsheet.ColumnHeaderTrigger` after it, the chevron that opens your column menu
 * (wrap it in `DropdownMenu.Trigger asChild`). Sorting is your state: reorder the rows and set
 * `sortDirection` on the sorted column, which screen readers hear as `aria-sort`. With focus on
 * a header, Enter moves it to the chevron.
 */
import { RiArrowDownLine, RiArrowUpLine, RiFileLine, RiHashtag } from '@remixicon/react';
import { DropdownMenu, ListItem, Spreadsheet } from '@wideset/react';
import { useState } from 'react';

const clients = [
  { name: 'Tech Nova', customers: 23, employees: 58 },
  { name: 'Eco Solutions', customers: 37, employees: 72 },
  { name: 'Skyline Innovations', customers: 15, employees: 14 },
  { name: 'Terra Firma', customers: 42, employees: 49 },
];

type Key = keyof (typeof clients)[number];

const columns = [
  { key: 'name', label: 'Client name', icon: RiFileLine },
  { key: 'customers', label: 'Customers', icon: RiHashtag },
  { key: 'employees', label: 'Employees', icon: RiHashtag },
] as const;

export default function SpreadsheetColumnHeaders() {
  const [sort, setSort] = useState<{ key: Key; direction: 'asc' | 'desc' }>({
    key: 'customers',
    direction: 'desc',
  });
  const rows = [...clients].sort((a, b) => {
    const order = String(a[sort.key]).localeCompare(String(b[sort.key]), 'en', {
      numeric: true,
    });
    return sort.direction === 'desc' ? -order : order;
  });

  return (
    <Spreadsheet aria-label="Clients" className="w-[30rem] max-w-full">
      <Spreadsheet.Head>
        <Spreadsheet.Row>
          {columns.map(({ key, label, icon }) => (
            <Spreadsheet.ColumnHeader
              key={key}
              sortDirection={sort.key === key ? sort.direction : null}
            >
              <Spreadsheet.ColumnHeaderIcon icon={icon} />
              {label}
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <Spreadsheet.ColumnHeaderTrigger aria-label={`${label} options`} />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="start">
                  <DropdownMenu.Item onSelect={() => setSort({ key, direction: 'asc' })}>
                    <ListItem.Prefix>
                      <RiArrowUpLine className="size-ws-9" />
                    </ListItem.Prefix>
                    <ListItem.Content>
                      <ListItem.Label>Sort ascending</ListItem.Label>
                    </ListItem.Content>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => setSort({ key, direction: 'desc' })}>
                    <ListItem.Prefix>
                      <RiArrowDownLine className="size-ws-9" />
                    </ListItem.Prefix>
                    <ListItem.Content>
                      <ListItem.Label>Sort descending</ListItem.Label>
                    </ListItem.Content>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </Spreadsheet.ColumnHeader>
          ))}
        </Spreadsheet.Row>
      </Spreadsheet.Head>
      <Spreadsheet.Body>
        {rows.map((client) => (
          <Spreadsheet.Row key={client.name}>
            <Spreadsheet.Cell>{client.name}</Spreadsheet.Cell>
            <Spreadsheet.Cell align="right">{client.customers}</Spreadsheet.Cell>
            <Spreadsheet.Cell align="right">{client.employees}</Spreadsheet.Cell>
          </Spreadsheet.Row>
        ))}
      </Spreadsheet.Body>
    </Spreadsheet>
  );
}
