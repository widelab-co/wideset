import {
  RiAddLine,
  RiAlignLeft,
  RiArrowDownLine,
  RiArrowUpLine,
  RiCalendarLine,
  RiFileLine,
  RiHashtag,
  RiPriceTag3Line,
  RiShieldKeyholeLine,
} from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, type KeyboardEvent, useState } from 'react';
import { cn } from 'src/lib/utils';

import { exampleStory } from '../../stories/example';
import { IconButton } from '../button/IconButton';
import { Checkbox } from '../checkbox/Checkbox';
import { DropdownMenu } from '../dropdown/DropdownMenu';
import { ListItem } from '../list-item/ListItem';
import { StatusBadge } from '../status-badge/StatusBadge';
import { Tag } from '../tag/Tag';
import CellTypesExample from './examples/spreadsheet/cell-types';
import cellTypesSource from './examples/spreadsheet/cell-types?raw';
import ColumnHeadersExample from './examples/spreadsheet/column-headers';
import columnHeadersSource from './examples/spreadsheet/column-headers?raw';
import DefaultExample from './examples/spreadsheet/default';
import KeyboardExample from './examples/spreadsheet/keyboard';
import keyboardSource from './examples/spreadsheet/keyboard?raw';
import LongValuesExample from './examples/spreadsheet/long-values';
import longValuesSource from './examples/spreadsheet/long-values?raw';
import SizesExample from './examples/spreadsheet/sizes';
import sizesSource from './examples/spreadsheet/sizes?raw';
import StickyColumnsExample from './examples/spreadsheet/sticky-columns';
import stickyColumnsSource from './examples/spreadsheet/sticky-columns?raw';
import { Spreadsheet } from './Spreadsheet';
import { SpreadsheetCell } from './SpreadsheetCell';
import { SpreadsheetColumnHeader } from './SpreadsheetColumnHeader';
import { SpreadsheetColumnHeaderIcon } from './SpreadsheetColumnHeaderIcon';
import { SpreadsheetColumnHeaderTrigger } from './SpreadsheetColumnHeaderTrigger';
import { SpreadsheetRowHeader } from './SpreadsheetRowHeader';

const meta = {
  title: 'Components/Spreadsheet',
  tags: ['autodocs'],
  component: Spreadsheet,
  subcomponents: {
    'Spreadsheet.ColumnHeader': SpreadsheetColumnHeader,
    'Spreadsheet.ColumnHeaderIcon': SpreadsheetColumnHeaderIcon,
    'Spreadsheet.ColumnHeaderTrigger': SpreadsheetColumnHeaderTrigger,
    'Spreadsheet.RowHeader': SpreadsheetRowHeader,
    'Spreadsheet.Cell': SpreadsheetCell,
  },
  parameters: {
    docs: {
      description: {
        component: `Spreadsheet is a dense grid of cells that people read, compare and work through one cell at a time.

Use it for heavy, spreadsheet-like screens: many columns and rows of values, a header row and leading columns that stay in place, and a keyboard model where the arrow keys move a selected cell. For records read and acted on a row at a time (open, select, sort a list) use Table; for a short list of one-line items use ListItem.

**Composition:**
\`\`\`
<Spreadsheet aria-label="…">            — root; scroll container, size, pinned columns, keyboard
  <Spreadsheet.Head>                     — sticky head
    <Spreadsheet.Row>
      <Spreadsheet.ColumnHeader>         — column header cell; sortDirection sets aria-sort
        <Spreadsheet.ColumnHeaderIcon /> — optional type icon
        Label
        <Spreadsheet.ColumnHeaderTrigger />  — optional chevron for your column menu
  <Spreadsheet.Body>
    <Spreadsheet.Row>
      <Spreadsheet.RowHeader>            — row number
      <Spreadsheet.Cell>                 — data cell: text or one library component
\`\`\`

**Editing** is yours: render an input in the active cell on Enter or F2 and remove it on Enter or Escape (see the Editing story). Sorting, selection of rows and new rows are your state too.`,
      },
    },
  },
  argTypes: {
    size: {
      description:
        'Row height and cell padding: `sm` 32px rows with 8px sides, `md` 40px with 12px. Text is 12px at both.',
      control: 'radio',
      options: ['sm', 'md'],
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md'" },
        defaultValue: { summary: "'sm'" },
      },
    },
    stickyColumns: {
      control: { type: 'number', min: 0, max: 3, step: 1 },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    'aria-label': {
      description: 'Names the grid for screen readers. Use it or `aria-labelledby`.',
      control: 'text',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    children: {
      description: 'Compose `Spreadsheet.Head` and `Spreadsheet.Body`.',
      control: false,
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
  },
} satisfies Meta<typeof Spreadsheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'sm',
    stickyColumns: 1,
    'aria-label': 'Clients',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A small grid with row numbers and typed column headers. Click a cell or tab into the grid and use the arrow keys.',
      },
    },
  },
  render: (args) => <DefaultExample {...args} />,
};

export const Sizes: Story = exampleStory(SizesExample, sizesSource);

export const CellTypes: Story = exampleStory(CellTypesExample, cellTypesSource);

export const ColumnHeaders: Story = exampleStory(ColumnHeadersExample, columnHeadersSource);

export const StickyColumns: Story = exampleStory(StickyColumnsExample, stickyColumnsSource);

export const Keyboard: Story = exampleStory(KeyboardExample, keyboardSource);

export const LongValues: Story = exampleStory(LongValuesExample, longValuesSource);

type TagColor = NonNullable<ComponentProps<typeof Tag>['color']>;
type Status = NonNullable<ComponentProps<typeof StatusBadge>['color']>;

type Client = {
  id: number;
  name: string;
  customers?: number;
  country?: [string, TagColor];
  added?: string;
  employees?: number;
  market?: [string, Status];
  website?: string;
  address?: string;
};

const ok: [string, Status] = ['No issues', 'positive'];
const unchecked: [string, Status] = ['Unchecked', 'neutral'];

const client = (
  name: string,
  customers?: number,
  country?: [string, TagColor],
  added?: string,
  employees?: number,
  market?: [string, Status],
  site?: string,
  address?: string,
) => ({
  name,
  customers,
  country,
  added,
  employees,
  market,
  website: site && `https://www.${site}.com`,
  address,
});

// The Clients screen in Figma (13501:3173), row for row.
const CLIENTS: Client[] = [
  client(
    'Tech Nova',
    23,
    ['Brazil', 'pink'],
    '03/15/2023',
    58,
    ok,
    'technova',
    '123 Elm St, Springfield, IL 62701',
  ),
  client(
    'Eco Solutions',
    37,
    ['Japan', 'indigo'],
    '07/22/2023',
    72,
    ok,
    'ecosolutions',
    '456 Maple Ave, Denver, CO 80203',
  ),
  client(
    'Skyline Innovations',
    15,
    ['Nigeria', 'pink'],
    '11/05/2023',
    14,
    ok,
    'skyline',
    '789 Oak Dr, Austin, TX 73301',
  ),
  client(
    'Terra Firma',
    42,
    ['Canada', 'yellow'],
    '01/30/2023',
    49,
    ok,
    'terrafirma',
    '321 Pine Rd, Seattle, WA 98101',
  ),
  client(
    'Quantum Leap',
    29,
    ['Australia', 'orange'],
    '09/12/2023',
    27,
    ok,
    'quantumleap',
    '654 Cedar Blvd, Miami, FL 33101',
  ),
  client(
    'Pinnacle Tech',
    8,
    ['India', 'cyan'],
    '04/18/2023',
    9,
    ['2 issues', 'negative'],
    'pinnacletech',
    '987 Birch Ln, Portland, OR 97201',
  ),
  client(
    'Future Vision',
    34,
    ['Germany', 'pink'],
    '06/25/2023',
    100,
    ['4 issues', 'negative'],
    'futurevision',
    '135 Spruce Ct, Boston, MA 02101',
  ),
  client('Aqua Vista', 11, ['Mexico', 'brand'], '10/09/2023', 18, ok, 'aquavista'),
  client('Summit Solutions', 27, ['France', 'violet'], '02/14/2023', 25, ok, 'summitsolutions'),
  client('Metro Dynamics', 40, ['Italy', 'lime'], '08/01/2023', 46, ok, 'metrodynamics'),
  client(
    'Pure Air Tech',
    5,
    ['South Korea', 'yellow'],
    '05/27/2023',
    6,
    ['Risk found', 'notice'],
    'pureairtech',
  ),
  client(
    'Sunny Tech',
    21,
    ['Argentina', 'orange'],
    '12/03/2023',
    22,
    unchecked,
    'sunnytech',
    '852 Palm Blvd, Atlanta, GA 30301',
  ),
  client(
    'New Horizons',
    44,
    ['Spain', 'indigo'],
    '03/29/2023',
    50,
    ok,
    'newhorizons',
    '951 Cypress Dr, Dallas, TX 75201',
  ),
  client(
    'Vivid Life',
    19,
    ['Egypt', 'violet'],
    '11/11/2023',
    20,
    ok,
    undefined,
    '258 Walnut St, Philadelphia, PA 19101',
  ),
  client(
    'Synergy Works',
    32,
    undefined,
    undefined,
    35,
    ok,
    undefined,
    '369 Chestnut Ave, Phoenix, AZ 85001',
  ),
  client(
    'Innovate Now',
    3,
    undefined,
    '09/21/2023',
    4,
    undefined,
    'innovatenow',
    '147 Dogwood Ln, Orlando, FL 32801',
  ),
  client(
    'Spark Creative',
    undefined,
    ['Turkey', 'red'],
    '10/30/2023',
    undefined,
    unchecked,
    'sparkcreative',
  ),
  client(
    'Unity Group',
    36,
    undefined,
    '02/05/2023',
    39,
    unchecked,
    'unitygroup',
    '369 Larch St, Minneapolis, MN 55401',
  ),
  client('Inspire Ideas', undefined, ['Netherlands', 'green']),
].map((row, id) => ({ id, ...row }));

type ColumnKey = Exclude<keyof Client, 'id'>;

const COLUMNS: { key: ColumnKey; label: string; icon: typeof RiFileLine }[] = [
  { key: 'name', label: 'Client name', icon: RiFileLine },
  { key: 'customers', label: 'Customers', icon: RiHashtag },
  { key: 'country', label: 'Country', icon: RiPriceTag3Line },
  { key: 'added', label: 'Date added', icon: RiCalendarLine },
  { key: 'employees', label: 'Employees', icon: RiHashtag },
  { key: 'market', label: 'Market', icon: RiShieldKeyholeLine },
  { key: 'website', label: 'Website', icon: RiAlignLeft },
  { key: 'address', label: 'Address', icon: RiAlignLeft },
];

const sortValue = (client: Client, key: ColumnKey) => {
  const value = client[key];
  return Array.isArray(value) ? value[0] : value;
};

const ClientCell = ({ client, column }: { client: Client; column: ColumnKey }) => {
  switch (column) {
    case 'customers':
    case 'employees':
      return <Spreadsheet.Cell align="right">{client[column]}</Spreadsheet.Cell>;
    case 'country':
      return (
        <Spreadsheet.Cell>
          {client.country && (
            <Tag size="sm" color={client.country[1]}>
              {client.country[0]}
            </Tag>
          )}
        </Spreadsheet.Cell>
      );
    case 'market':
      return (
        <Spreadsheet.Cell>
          {client.market && (
            <StatusBadge size="sm" color={client.market[1]}>
              {client.market[0]}
            </StatusBadge>
          )}
        </Spreadsheet.Cell>
      );
    case 'website':
      return (
        <Spreadsheet.Cell>
          {client.website && (
            <a href={client.website} className="truncate underline">
              {client.website}
            </a>
          )}
        </Spreadsheet.Cell>
      );
    default:
      return <Spreadsheet.Cell>{client[column]}</Spreadsheet.Cell>;
  }
};

export const Composition: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'The Clients screen from Figma: typed column headers whose chevron opens a sort menu (`sortDirection` on the sorted column), row numbers that turn into checkboxes on hover, with focus in the row, or once a row is selected, links in cells, and add-row and add-column buttons. The last column has no width, so it takes the rest of the row and the grid lines run to the edge. The column summary row of the Figma screen (type, mini chart, value count) is screen content, left out here.',
      },
    },
  },
  render: function Render() {
    const [clients, setClients] = useState(CLIENTS);
    const [sort, setSort] = useState<{ key: ColumnKey; direction: 'asc' | 'desc' } | null>(null);
    const [selected, setSelected] = useState<number[]>([]);
    const rows = sort
      ? [...clients].sort((a, b) => {
          const [x, y] = [sortValue(a, sort.key), sortValue(b, sort.key)];
          if (x === undefined || y === undefined) return x === y ? 0 : x === undefined ? 1 : -1;
          const order = String(x).localeCompare(String(y), 'en', { numeric: true });
          return sort.direction === 'desc' ? -order : order;
        })
      : clients;
    const allSelected = selected.length === clients.length;
    const toggle = (id: number) =>
      setSelected((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

    return (
      <Spreadsheet aria-label="Clients" className="bg-ws-static-foreground h-[40rem]">
        <Spreadsheet.Head>
          <Spreadsheet.Row>
            <Spreadsheet.ColumnHeader align="center" className="w-[2.8125rem]">
              <Checkbox
                aria-label="Select all clients"
                checked={allSelected ? true : selected.length ? 'indeterminate' : false}
                onCheckedChange={() => setSelected(allSelected ? [] : clients.map((c) => c.id))}
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
  },
};

type Item = { id: number; name: string; price: string };

export const Editing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Editing is a pattern, not a mode of the grid. Start on Enter, F2 or a double click by rendering an input in the cell; Enter saves and Escape cancels, and both put focus back on the cell (the grid does it for Escape). While the input has focus the arrow keys move its caret, not the cell; Tab leaves the grid and saves.',
      },
    },
  },
  render: function Render() {
    const [items, setItems] = useState<Item[]>([
      { id: 1, name: 'Oak desk', price: '$420.00' },
      { id: 2, name: 'Walnut shelf', price: '$180.00' },
      { id: 3, name: 'Linen chair', price: '$260.00' },
    ]);
    const [editing, setEditing] = useState<{ id: number; key: 'name' | 'price' } | null>(null);
    const save = (id: number, key: 'name' | 'price', value: string) => {
      setItems((list) => list.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
      setEditing(null);
    };

    const cell = (item: Item, key: 'name' | 'price') => {
      const isEditing = editing?.id === item.id && editing.key === key;
      const start = (event: KeyboardEvent<HTMLTableCellElement>) => {
        if (event.target !== event.currentTarget || isEditing) return;
        if (event.key === 'Enter' || event.key === 'F2') {
          event.preventDefault();
          setEditing({ id: item.id, key });
        }
      };

      return (
        <Spreadsheet.Cell
          align={key === 'price' ? 'right' : 'left'}
          onKeyDown={start}
          onDoubleClick={() => setEditing({ id: item.id, key })}
          className={
            isEditing
              ? 'outline-ws-dynamic-primary-strong-default outline-2 -outline-offset-2'
              : undefined
          }
        >
          {isEditing ? (
            // An in-cell editor: borderless, the cell's own text style.
            <input
              aria-label={`${key === 'name' ? 'Name' : 'Price'}: ${item.name}`}
              defaultValue={item[key]}
              // eslint-disable-next-line jsx-a11y/no-autofocus -- the user asked to edit this cell
              autoFocus
              className={cn(
                'typography-body-sm text-ws-static-strong p-ws-0 w-full border-0 bg-transparent outline-none',
                key === 'price' && 'text-right',
              )}
              onBlur={(event) => isEditing && save(item.id, key, event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  const cellElement = event.currentTarget.closest('td');
                  save(item.id, key, event.currentTarget.value);
                  cellElement?.focus();
                }
                if (event.key === 'Escape') {
                  // Put the value back so the blur that follows saves nothing new.
                  event.currentTarget.value = item[key];
                  setEditing(null);
                }
              }}
            />
          ) : (
            item[key]
          )}
        </Spreadsheet.Cell>
      );
    };

    return (
      <Spreadsheet aria-label="Products" className="w-[24rem]">
        <Spreadsheet.Head>
          <Spreadsheet.Row>
            <Spreadsheet.ColumnHeader>Name</Spreadsheet.ColumnHeader>
            <Spreadsheet.ColumnHeader align="right" className="w-[7rem]">
              Price
            </Spreadsheet.ColumnHeader>
          </Spreadsheet.Row>
        </Spreadsheet.Head>
        <Spreadsheet.Body>
          {items.map((item) => (
            <Spreadsheet.Row key={item.id}>
              {cell(item, 'name')}
              {cell(item, 'price')}
            </Spreadsheet.Row>
          ))}
        </Spreadsheet.Body>
      </Spreadsheet>
    );
  },
};
