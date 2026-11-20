import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

import { exampleStory } from '../../stories/example';
import { Table } from '../table/Table';
import RowsPerPageExample from './examples/pagination/rows-per-page';
import rowsPerPageSource from './examples/pagination/rows-per-page?raw';
import TypesExample from './examples/pagination/types';
import typesSource from './examples/pagination/types?raw';
import { Pagination } from './Pagination';
import type { PaginationProps } from './Pagination.types';

const paginatedTableRows = [
  {
    id: 1,
    project: 'Brand Refresh',
    owner: 'Ava Patel',
    status: 'In review',
    dueDate: '2026-05-02',
  },
  {
    id: 2,
    project: 'Checkout Audit',
    owner: 'Noah Kim',
    status: 'In progress',
    dueDate: '2026-05-07',
  },
  {
    id: 3,
    project: 'CRM Migration',
    owner: 'Mia Johnson',
    status: 'Blocked',
    dueDate: '2026-05-09',
  },
  {
    id: 4,
    project: 'Insights Dashboard',
    owner: 'Leo Garcia',
    status: 'Planned',
    dueDate: '2026-05-12',
  },
  {
    id: 5,
    project: 'Content Cleanup',
    owner: 'Ella Brown',
    status: 'Done',
    dueDate: '2026-05-14',
  },
  {
    id: 6,
    project: 'Referral Flow',
    owner: 'Liam Davis',
    status: 'In progress',
    dueDate: '2026-05-16',
  },
  {
    id: 7,
    project: 'Billing Settings',
    owner: 'Chloe Wilson',
    status: 'In review',
    dueDate: '2026-05-18',
  },
  {
    id: 8,
    project: 'Search Tuning',
    owner: 'Ethan Lee',
    status: 'Blocked',
    dueDate: '2026-05-21',
  },
  {
    id: 9,
    project: 'Marketing Hub',
    owner: 'Grace Hall',
    status: 'Planned',
    dueDate: '2026-05-23',
  },
  {
    id: 10,
    project: 'Permissions Matrix',
    owner: 'Mason Clark',
    status: 'In progress',
    dueDate: '2026-05-26',
  },
  {
    id: 11,
    project: 'Mobile QA Sweep',
    owner: 'Sofia Adams',
    status: 'Done',
    dueDate: '2026-05-29',
  },
  {
    id: 12,
    project: 'Retention Emails',
    owner: 'Lucas Walker',
    status: 'In review',
    dueDate: '2026-06-01',
  },
];

const meta = {
  title: 'Components/Pagination',
  tags: ['autodocs'],
  component: Pagination,
  subcomponents: {
    'Pagination.RowsPerPage': Pagination.RowsPerPage,
    'Pagination.Overflow': Pagination.Overflow,
  },
  parameters: {
    docs: {
      description: {
        component: `
Pagination helps users move through a long collection of results one page at a time.
Use it when content is already split into pages and users need either direct page buttons or a more compact overflow control.

**Optional composition:**
\`\`\`
<Pagination
  pagesCount={20}
  activePage={activePage}
  itemsPerPage={itemsPerPage}
  rowsPerPageOptions={[5, 10, 20]}
  onChangeActivePage={setActivePage}
  onChangeItemsPerPage={setItemsPerPage}
>
  <Pagination.RowsPerPage />   — rows-per-page selector
  <Pagination.Numbers />       — numbered page buttons
  <Pagination.Overflow />      — compact prev/select/next navigation (use instead of Numbers)
</Pagination>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    selectPageAriaLabel: { control: false, table: { category: 'Content' } },
    defaultMotion: { table: { category: 'Behavior', type: { summary: 'boolean' } } },
    navigationAriaLabel: { table: { category: 'Content', type: { summary: 'string' } } },
    prevPageAriaLabel: { table: { category: 'Content', type: { summary: 'string' } } },
    nextPageAriaLabel: { table: { category: 'Content', type: { summary: 'string' } } },
    ellipsisPlaceholder: { table: { category: 'Behavior', type: { summary: 'string' } } },
    type: {
      control: 'radio',
      options: ['numbers', 'overflow'],
      table: {
        category: 'Behavior',
        type: { summary: '"numbers" | "overflow"' },
        defaultValue: { summary: 'numbers' },
      },
    },
    pagesCount: {
      control: { type: 'number', min: 1, step: 1 },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    maxVisiblePages: {
      control: { type: 'number', min: 1, step: 1 },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '7' },
      },
    },
    rowsPerPageOptions: {
      control: 'object',
      table: {
        category: 'Behavior',
        type: { summary: 'number[] | false' },
        defaultValue: { summary: 'false' },
      },
    },
    activePage: {
      control: { type: 'number', min: 1, step: 1 },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
      },
    },
    defaultActivePage: {
      control: { type: 'number', min: 1, step: 1 },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    onChangeActivePage: {
      table: {
        category: 'Events',
        type: { summary: '(page: number) => void' },
      },
    },
    itemsPerPage: {
      control: { type: 'number', min: 1, step: 1 },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
      },
    },
    defaultItemsPerPage: {
      control: { type: 'number', min: 1, step: 1 },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '10' },
      },
    },
    onChangeItemsPerPage: {
      table: {
        category: 'Events',
        type: { summary: '(itemsPerPage: number) => void' },
      },
    },
    rowsPerPageLabel: {
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Rows per page' },
      },
    },
    prevLabel: {
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Prev' },
      },
    },
    nextLabel: {
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'Next' },
      },
    },
    ofLabel: {
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'of' },
      },
    },
    className: {
      description: 'Additional CSS classes for pagination root element.',
      control: 'text',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
      },
    },
    children: {
      description:
        'Custom composition slots. When provided, default layout is replaced by children.',
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default pagination with numbered navigation and an optional rows-per-page selector.',
      },
      source: {
        code: `const [activePage, setActivePage] = useState(3);
const [itemsPerPage, setItemsPerPage] = useState(10);

return (
  <Pagination
    pagesCount={10}
    activePage={activePage}
    itemsPerPage={itemsPerPage}
    rowsPerPageOptions={[5, 10, 20]}
    onChangeActivePage={setActivePage}
    onChangeItemsPerPage={setItemsPerPage}
  />
);`,
      },
    },
  },
  render: function Render({
    activePage: activePageFromArgs = 3,
    itemsPerPage: itemsPerPageFromArgs = 10,
    onChangeActivePage,
    onChangeItemsPerPage,
    ...args
  }: PaginationProps) {
    const [activePage, setActivePage] = useState(activePageFromArgs);
    const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageFromArgs);

    useEffect(() => setActivePage(activePageFromArgs), [activePageFromArgs]);
    useEffect(() => setItemsPerPage(itemsPerPageFromArgs), [itemsPerPageFromArgs]);

    return (
      <Pagination
        {...args}
        activePage={activePage}
        itemsPerPage={itemsPerPage}
        onChangeActivePage={(page) => {
          setActivePage(page);
          onChangeActivePage?.(page);
        }}
        onChangeItemsPerPage={(value) => {
          setItemsPerPage(value);
          onChangeItemsPerPage?.(value);
        }}
      />
    );
  },
  args: {
    pagesCount: 10,
    activePage: 3,
    itemsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20],
  },
};

export const Types: Story = exampleStory(TypesExample, typesSource);

export const RowsPerPage: Story = exampleStory(RowsPerPageExample, rowsPerPageSource);

export const WithTable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Shows how to connect Pagination to a Table by slicing the dataset with the current page and rows-per-page selection.',
      },
      source: {
        code: `function PaginatedTableExample() {
  const [activePage, setActivePage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const pagesCount = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (activePage - 1) * itemsPerPage;
  const visibleRows = projects.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex w-full flex-col gap-ws-8">
      <Table striped>
        <Table.Head>
          <Table.Row>
            <Table.Header>ID</Table.Header>
            <Table.Header>Project</Table.Header>
            <Table.Header>Owner</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header>Due date</Table.Header>
          </Table.Row>
        </Table.Head>

        <Table.Body>
          {visibleRows.map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.id}</Table.Cell>
              <Table.Cell>{row.project}</Table.Cell>
              <Table.Cell>{row.owner}</Table.Cell>
              <Table.Cell>{row.status}</Table.Cell>
              <Table.Cell>{row.dueDate}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Pagination
        pagesCount={pagesCount}
        activePage={activePage}
        itemsPerPage={itemsPerPage}
        rowsPerPageOptions={[5, 10, 20]}
        onChangeActivePage={setActivePage}
        onChangeItemsPerPage={(next) => {
          setItemsPerPage(next);
          setActivePage(1);
        }}
      />
    </div>
  );
}`,
      },
    },
  },
  render: function Render(args: PaginationProps) {
    const [activePage, setActivePage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const pagesCount = Math.max(1, Math.ceil(paginatedTableRows.length / itemsPerPage));
    const startIndex = (activePage - 1) * itemsPerPage;
    const visibleRows = paginatedTableRows.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="gap-ws-8 flex w-full flex-col">
        <p className="text-ws-static-subtle typography-label-sm">
          Showing {startIndex + 1}–{startIndex + visibleRows.length} of {paginatedTableRows.length}{' '}
          projects
        </p>

        <div className="w-full overflow-auto">
          <Table striped>
            <Table.Head>
              <Table.Row>
                <Table.Header>ID</Table.Header>
                <Table.Header>Project</Table.Header>
                <Table.Header>Owner</Table.Header>
                <Table.Header>Status</Table.Header>
                <Table.Header>Due date</Table.Header>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {visibleRows.map((row) => (
                <Table.Row key={row.id}>
                  <Table.Cell>{row.id}</Table.Cell>
                  <Table.Cell>{row.project}</Table.Cell>
                  <Table.Cell>{row.owner}</Table.Cell>
                  <Table.Cell>{row.status}</Table.Cell>
                  <Table.Cell>{row.dueDate}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <Pagination
          {...args}
          pagesCount={pagesCount}
          activePage={activePage}
          itemsPerPage={itemsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
          onChangeActivePage={(page) => {
            setActivePage(page);
            args.onChangeActivePage?.(page);
          }}
          onChangeItemsPerPage={(next) => {
            setItemsPerPage(next);
            args.onChangeItemsPerPage?.(next);
            setActivePage(1);
          }}
        />
      </div>
    );
  },
  argTypes: {
    pagesCount: { table: { disable: true } },
    activePage: { table: { disable: true } },
    itemsPerPage: { table: { disable: true } },
    defaultActivePage: { table: { disable: true } },
    defaultItemsPerPage: { table: { disable: true } },
    rowsPerPageOptions: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: {},
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use composition subcomponents to build custom layouts. Connect multiple instances to the same state for shared navigation.',
      },
      source: {
        code: `const [activePage, setActivePage] = useState(5);
const [itemsPerPage, setItemsPerPage] = useState(10);

return (
  <div className="flex flex-col gap-ws-14">
    <Pagination
      pagesCount={20}
      activePage={activePage}
      itemsPerPage={itemsPerPage}
      rowsPerPageOptions={[5, 10, 20]}
      onChangeActivePage={setActivePage}
      onChangeItemsPerPage={setItemsPerPage}
    >
      <Pagination.RowsPerPage />
      <Pagination.Numbers />
    </Pagination>

    <Pagination
      pagesCount={20}
      activePage={activePage}
      itemsPerPage={itemsPerPage}
      rowsPerPageOptions={[5, 10, 20]}
      onChangeActivePage={setActivePage}
      onChangeItemsPerPage={setItemsPerPage}
    >
      <Pagination.RowsPerPage />
      <Pagination.Overflow />
    </Pagination>
  </div>
);`,
      },
    },
  },
  argTypes: {
    type: { table: { disable: true } },
    rowsPerPageOptions: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  render: function Render(args: PaginationProps) {
    const [activePage, setActivePage] = useState(args.defaultActivePage ?? 5);
    const [itemsPerPage, setItemsPerPage] = useState(args.defaultItemsPerPage ?? 10);

    useEffect(() => setActivePage(args.defaultActivePage ?? 5), [args.defaultActivePage]);
    useEffect(() => setItemsPerPage(args.defaultItemsPerPage ?? 10), [args.defaultItemsPerPage]);

    const spreadable = { ...args };
    delete spreadable.defaultActivePage;
    delete spreadable.defaultItemsPerPage;
    delete spreadable.rowsPerPageOptions;
    delete spreadable.activePage;
    delete spreadable.itemsPerPage;
    delete spreadable.onChangeActivePage;
    delete spreadable.onChangeItemsPerPage;
    delete spreadable.type;
    delete spreadable.children;

    const sharedProps = {
      ...spreadable,
      activePage,
      itemsPerPage,
      rowsPerPageOptions: [5, 10, 20],
      onChangeActivePage: (page: number) => {
        setActivePage(page);
        args.onChangeActivePage?.(page);
      },
      onChangeItemsPerPage: (value: number) => {
        setItemsPerPage(value);
        args.onChangeItemsPerPage?.(value);
      },
    };

    return (
      <div className="gap-ws-14 flex flex-col">
        <Pagination {...sharedProps}>
          <Pagination.RowsPerPage />
          <Pagination.Numbers />
        </Pagination>

        <Pagination {...sharedProps}>
          <Pagination.RowsPerPage />
          <Pagination.Overflow />
        </Pagination>
      </div>
    );
  },
  args: {
    pagesCount: 20,
    defaultActivePage: 5,
    defaultItemsPerPage: 10,
  },
};
