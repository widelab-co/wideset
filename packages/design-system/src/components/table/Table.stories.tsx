import { RiBarChartLine } from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { exampleStory } from '../../stories/example';
import { Avatar } from '../avatar/Avatar';
import { Button } from '../button/Button';
import { Checkbox } from '../checkbox/Checkbox';
import { ProgressBar } from '../progress-bar/ProgressBar';
import { StatusBadge as Badge } from '../status-badge/StatusBadge';
import { Switch } from '../switch/Switch';
import { Tag } from '../tag/Tag';
import { TextInput } from '../text-input/TextInput';
import { Thumbnail } from '../thumbnail/Thumbnail';
import SeparatedExample from './examples/table/separated';
import separatedSource from './examples/table/separated?raw';
import SizesExample from './examples/table/sizes';
import sizesSource from './examples/table/sizes?raw';
import StatesExample from './examples/table/states';
import statesSource from './examples/table/states?raw';
import StripedExample from './examples/table/striped';
import stripedSource from './examples/table/striped?raw';
import { Table } from './Table';
import { TableCell } from './TableCell';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

const sizeOptions = ['sm', 'md', 'lg'] as const;

const meta = {
  title: 'Components/Table',
  tags: ['autodocs'],
  component: Table,
  subcomponents: {
    'Table.Row': TableRow,
    'Table.Cell': TableCell,
    'Table.Header': TableHeader,
  },
  parameters: {
    docs: {
      description: {
        component: `Table displays structured data in rows and columns. Use it for lists, data grids, and comparisons where relationships between values matter.

Prefer Table over a simple list when data has multiple attributes per item, or when users need to scan across columns.

**Composition:**
\`\`\`
<Table>                — root; controls size, layout, and sticky behaviour
  <Table.Head>         — header section
    <Table.Row>
      <Table.Header>   — column heading cell; supports sorting
  <Table.Body>         — data rows
    <Table.Row>        — a single row; supports selection and click interaction
      <Table.Cell>     — a data cell
  <Table.Foot>         — optional footer section
    <Table.Row>
      <Table.Cell>
\`\`\`

**Sizing:** row heights (\`size\`) are minimums: rows grow when content wraps. To keep rows tidy with long content, use \`truncate\` instead of constraining height. Column widths are set with \`w-*\` / \`max-w-*\` classes on \`Table.Header\` (header cell widths govern the column); add the \`table-fixed\` class to the table to make them deterministic. With the default \`table-auto\` layout the browser treats widths as hints, and \`truncate\` does not clip but instead widens the column to the full single-line text width, which can overflow the container.

**Large datasets:** Table is presentational. Paginate (see Pagination) or virtualize at the data layer, e.g. TanStack Table/Virtual driving \`Table.Row\` / \`Table.Cell\`. Virtualization is deliberately out of scope for this component.`,
      },
    },
  },
  argTypes: {
    size: {
      description: 'Controls row height and padding for all cells in the table.',
      control: 'select',
      options: sizeOptions,
      table: {
        category: 'Appearance',
        defaultValue: { summary: "'sm'" },
        type: { summary: "'sm' | 'md' | 'lg'" },
      },
    },
    separated: {
      description: 'Adds vertical borders between columns.',
      control: 'boolean',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    striped: {
      control: 'boolean',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hasBackground: {
      control: 'boolean',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    flushMargin: {
      description:
        'Removes horizontal padding from all cells. Can be overridden per `Table.Cell` or `Table.Header`.',
      control: 'boolean',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    placement: {
      description: 'Vertical alignment of cell content. Can be overridden per `Table.Cell`.',
      control: 'select',
      options: ['top', 'middle', 'bottom', undefined],
      table: {
        category: 'Appearance',
        type: { summary: "'top' | 'middle' | 'bottom'" },
        defaultValue: { summary: 'undefined' },
      },
    },
    align: {
      description:
        'Horizontal alignment of cell content. Can be overridden per `Table.Cell` or `Table.Header`.',
      control: 'select',
      options: ['left', 'center', 'right', undefined],
      table: {
        category: 'Appearance',
        type: { summary: "'left' | 'center' | 'right'" },
        defaultValue: { summary: 'undefined' },
      },
    },
    truncate: {
      description:
        'Truncates overflowing cell content to a single line with an ellipsis. Can be overridden per `Table.Cell` or `Table.Header`. Requires constrained column widths (`table-fixed` class on the table, or `max-w-*` classes on cells); without one, the forced single line widens the column to the full text width and can overflow the container.',
      control: 'boolean',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    stickyHeader: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    stickyColumn: {
      description:
        'Sticks the first column to the left edge of the scroll container. Requires the table to be inside a width-constrained container with `overflow-x: auto` or `overflow-x: scroll`. Automatically enables `hasBackground`.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    interactive: {
      description:
        'Adds hover and active styles to rows, signalling they are clickable. Combine with an `onClick` on `Table.Row`. Automatically enabled when `selectionMode` is set.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    selectionMode: {
      control: 'select',
      options: ['single', 'multiple', undefined],
      table: {
        category: 'Behavior',
        type: { summary: "'single' | 'multiple'" },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  render: (args) => (
    <Table {...args}>
      <Table.Head>
        <Table.Row>
          <Table.Header>Project Name</Table.Header>
          <Table.Header>Status</Table.Header>
          <Table.Header>Deadline</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Redesign Website</Table.Cell>
          <Table.Cell>Ongoing</Table.Cell>
          <Table.Cell>2024-05-30</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Launch Mobile App</Table.Cell>
          <Table.Cell>Finished</Table.Cell>
          <Table.Cell>2024-06-15</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Foot>
        <Table.Row>
          <Table.Cell>Summary</Table.Cell>
          <Table.Cell>50%</Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row>
      </Table.Foot>
    </Table>
  ),
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

const longText =
  'A complete overhaul of the marketing site including new information architecture, refreshed visual identity, and a migration to the new design system.';

const designedSizes: {
  [key in (typeof sizeOptions)[number]]: {
    checkbox: Parameters<typeof Checkbox>[0]['size'];
    input: Parameters<typeof TextInput>[0]['size'];
    avatar: Parameters<typeof Avatar>[0]['size'];
    thumbnail: Parameters<typeof Thumbnail>[0]['size'];
    statusBadge: Parameters<typeof Badge>[0]['size'];
    tag: Parameters<typeof Tag>[0]['size'];
    buttons: Parameters<typeof Button>[0]['size'];
    switch: Parameters<typeof Switch>[0]['size'];
  };
} = {
  sm: {
    checkbox: 'lg',
    input: 'sm',
    avatar: 'sm',
    thumbnail: 'md',
    statusBadge: 'md',
    tag: 'md',
    buttons: 'sm',
    switch: 'lg',
  },
  md: {
    checkbox: 'lg',
    input: 'sm',
    avatar: 'md',
    thumbnail: 'lg',
    statusBadge: 'md',
    tag: 'md',
    buttons: 'sm',
    switch: 'lg',
  },
  lg: {
    checkbox: 'lg',
    input: 'md',
    avatar: 'md',
    thumbnail: 'lg',
    statusBadge: 'lg',
    tag: 'lg',
    buttons: 'md',
    switch: 'lg',
  },
};

const selectionRows = [
  { id: 1, name: 'Redesign Website', status: 'Ongoing', deadline: '2024-05-30' },
  { id: 2, name: 'Launch Mobile App', status: 'Finished', deadline: '2024-06-15' },
  { id: 3, name: 'Brand Refresh', status: 'Planned', deadline: '2024-07-01' },
];

type SortKey = 'name' | 'status' | 'deadline';

type SortDir = 'asc' | 'desc' | null;

const sortableRows = [
  { id: 1, name: 'Redesign Website', status: 'Ongoing', deadline: '2024-05-30' },
  { id: 2, name: 'Launch Mobile App', status: 'Finished', deadline: '2024-06-15' },
  { id: 3, name: 'Brand Refresh', status: 'Planned', deadline: '2024-07-01' },
];

export const Default: Story = {
  args: {
    size: 'sm',
    separated: false,
    striped: false,
    hasBackground: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Basic table layout using `Table.Head`, `Table.Body`, and `Table.Foot`. Use the Controls panel to explore the main props.',
      },
    },
  },
};

export const Separated: Story = exampleStory(SeparatedExample, separatedSource);

export const Striped: Story = exampleStory(StripedExample, stripedSource);

export const Sizes: Story = exampleStory(SizesExample, sizesSource);

export const Alignments: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "This example demonstrates how to use the `align` prop to control the horizontal alignment of cell content. The `align` prop can be set to `'left'`, `'center'`, or `'right'` and is available both on `Table` (applies to all cells) and on individual `Table.Cell` or `Table.Header` elements (overrides the table-level value). This example shows `align` applied per cell.",
      },
      source: {
        code: `
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Project Name</Table.Header>
                <Table.Header>Status</Table.Header>
                <Table.Header>Alignment</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Redesign Website</Table.Cell>
                <Table.Cell>Ongoing</Table.Cell>
                <Table.Cell align="left">Aligned left</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Launch Mobile App</Table.Cell>
                <Table.Cell>Finished</Table.Cell>
                <Table.Cell align="right">Aligned right</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Launch Mobile App</Table.Cell>
                <Table.Cell>Finished</Table.Cell>
                <Table.Cell align="center">Aligned center</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        `,
      },
    },
  },
  render: () => (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header className="min-w-[300px]">Project Name</Table.Header>
          <Table.Header className="min-w-[100px]">Status</Table.Header>
          <Table.Header className="min-w-[300px]">Alignment</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Redesign Website</Table.Cell>
          <Table.Cell>Ongoing</Table.Cell>
          <Table.Cell align="left">Aligned left</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Launch Mobile App</Table.Cell>
          <Table.Cell>Finished</Table.Cell>
          <Table.Cell align="right">Aligned right</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Launch Mobile App</Table.Cell>
          <Table.Cell>Finished</Table.Cell>
          <Table.Cell align="center">Aligned center</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const ColumnWidths: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With the `table-fixed` class on the table, columns follow the widths of the header cells, set with `w-*` classes on `Table.Header`. Constrained widths also make `truncate` effective: overflowing cell content is clipped to one line with an ellipsis, and the full value is exposed via the `title` attribute. Without `table-fixed`, the browser treats widths as hints and truncation does not clip; the forced single line widens the column to fit the text and can overflow the container.',
      },
      source: {
        code: `
          <Table className="table-fixed">
            <Table.Head>
              <Table.Row>
                <Table.Header className="w-1/4">Project Name</Table.Header>
                <Table.Header>Description</Table.Header>
                <Table.Header className="w-32">Deadline</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Redesign Website</Table.Cell>
                <Table.Cell truncate>A complete overhaul of the marketing site…</Table.Cell>
                <Table.Cell>2024-05-30</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        `,
      },
    },
  },
  render: (args) => (
    <Table {...args} className="table-fixed">
      <Table.Head>
        <Table.Row>
          <Table.Header className="w-1/4">Project Name</Table.Header>
          <Table.Header>Description</Table.Header>
          <Table.Header className="w-32">Deadline</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Redesign Website</Table.Cell>
          <Table.Cell truncate>
            A complete overhaul of the marketing site including new information architecture,
            refreshed visual identity, and a migration to the new design system.
          </Table.Cell>
          <Table.Cell>2024-05-30</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Launch Mobile App</Table.Cell>
          <Table.Cell truncate>Ship the iOS and Android apps to the public stores.</Table.Cell>
          <Table.Cell>2024-06-15</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const Truncation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `truncate` prop clips overflowing content to one line with an ellipsis; hover reveals the full value via the `title` attribute. Set it table-wide and override per cell. Requires constrained column widths (`table-fixed` on the table with `w-*` headers, or `max-w-*` on the cell).',
      },
      source: {
        code: `
          <Table truncate className="table-fixed">
            <Table.Head>
              <Table.Row>
                <Table.Header className="w-1/4">Project Name</Table.Header>
                <Table.Header>Description</Table.Header>
                <Table.Header className="w-32">Deadline</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Redesign Website</Table.Cell>
                <Table.Cell>{longText}</Table.Cell>
                <Table.Cell>2024-05-30</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell truncate={false}>Redesign Website (no truncation)</Table.Cell>
                <Table.Cell truncate={false}>{longText}</Table.Cell>
                <Table.Cell truncate={false}>2024-05-30</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        `,
      },
    },
  },
  args: { truncate: true },
  render: (args) => (
    <Table {...args} className="table-fixed">
      <Table.Head>
        <Table.Row>
          <Table.Header className="w-1/4">Project Name</Table.Header>
          <Table.Header>Description</Table.Header>
          <Table.Header className="w-32">Deadline</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Redesign Website</Table.Cell>
          <Table.Cell>{longText}</Table.Cell>
          <Table.Cell>2024-05-30</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell truncate={false}>Redesign Website (no truncation)</Table.Cell>
          <Table.Cell truncate={false}>{longText}</Table.Cell>
          <Table.Cell truncate={false}>2024-05-30</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const FlushMargin: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `flushMargin` prop removes the horizontal padding from all cells in the table, allowing content to align directly with the cell edges. It can also be applied to individual `Table.Cell` or `Table.Header` elements to override on a per-cell basis.',
      },
    },
  },
  args: { flushMargin: true },
};

export const ElementsSizing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "This example shows how different table sizes affect the sizing of various elements within the table, such as checkboxes, inputs, avatars, badges, tags, buttons, and switches. Each table size ('sm', 'md', 'lg') is designed with specific sizes for these elements to maintain visual harmony and usability across different contexts.",
      },
      source: {
        code: `
          {/* See the "Sizing Suggestions" docs page for the recommended element size per table size */}
          <Table size="md">
            <Table.Head>
              <Table.Row>
                <Table.Header>Checkbox</Table.Header>
                <Table.Header>Input</Table.Header>
                <Table.Header>Avatar</Table.Header>
                <Table.Header>Status Badge</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Checkbox size="lg" />
                </Table.Cell>
                <Table.Cell>
                  <TextInput size="sm" />
                </Table.Cell>
                <Table.Cell>
                  <Avatar size="md" />
                </Table.Cell>
                <Table.Cell>
                  <Badge size="md">Badge</Badge>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        `,
      },
    },
  },
  render: () => (
    <div className="flex flex-col">
      {sizeOptions.map((size) => {
        return (
          <div key={size} className="not-last:mb-ws-20 flex flex-col">
            <h2 className="typography-subtitle-md">
              Table size &apos;<code>{size}</code>&apos;
            </h2>
            <Table size={size}>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Checkbox</Table.Header>
                  <Table.Header>Text</Table.Header>
                  <Table.Header>Text</Table.Header>
                  <Table.Header>Input</Table.Header>
                  <Table.Header>Avatar</Table.Header>
                  <Table.Header>Thumbnail</Table.Header>
                  <Table.Header>Status Badge</Table.Header>
                  <Table.Header>Tag</Table.Header>
                  <Table.Header>Buttons</Table.Header>
                  <Table.Header>Switch</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {[1, 2, 3].map((row) => (
                  <Table.Row key={row}>
                    <Table.Cell>
                      <Checkbox size={designedSizes[size].checkbox} />
                    </Table.Cell>
                    <Table.Cell>Label</Table.Cell>
                    <Table.Cell>
                      <div className="flex min-w-30 flex-col">
                        <p>Complex label</p>
                        <p className="text-ws-static-subtle typography-caption-sm">Description</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <TextInput size={designedSizes[size].input} />
                    </Table.Cell>
                    <Table.Cell>
                      <Avatar size={designedSizes[size].avatar} />
                    </Table.Cell>
                    <Table.Cell>
                      <Thumbnail size={designedSizes[size].thumbnail}>
                        <Thumbnail.Icon icon={RiBarChartLine} />
                      </Thumbnail>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge size={designedSizes[size].statusBadge}>Badge</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Tag size={designedSizes[size].tag}>Tag</Tag>
                    </Table.Cell>
                    <Table.Cell>
                      <Button size={designedSizes[size].buttons}>Button</Button>
                    </Table.Cell>
                    <Table.Cell>
                      <Switch size={designedSizes[size].switch} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        );
      })}
    </div>
  ),
};

export const Placements: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "This example demonstrates how to use the `placement` prop to control the vertical alignment of cell content in the Table component. The `placement` prop can be set to `'top'`, `'middle'`, or `'bottom'` to align the content accordingly. In this example, the first cell contains taller content to better illustrate the effect of different vertical alignments.",
      },
      source: {
        code: `
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Header>Project Name</Table.Header>
                <Table.Header>Bottom</Table.Header>
                <Table.Header>Top</Table.Header>
                <Table.Header>Middle</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <div>
                    <p>Really</p>
                    <p>Tall</p>
                    <p>Content</p>
                  </div>
                </Table.Cell>
                <Table.Cell placement="bottom">Placement bottom</Table.Cell>
                <Table.Cell placement="top">Placement top</Table.Cell>
                <Table.Cell placement="middle">Placement middle</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        `,
      },
    },
  },
  render: () => (
    <Table>
      <Table.Head>
        <Table.Row>
          <Table.Header>Project Name</Table.Header>
          <Table.Header>Bottom</Table.Header>
          <Table.Header>Top</Table.Header>
          <Table.Header>Middle</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <div>
              <p>Really</p>
              <p>Tall</p>
              <p>Content</p>
            </div>
          </Table.Cell>
          <Table.Cell placement="bottom">
            Placement <code>bottom</code>
          </Table.Cell>
          <Table.Cell placement="top">
            Placement <code>top</code>
          </Table.Cell>
          <Table.Cell placement="middle">
            Placement <code>middle</code>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const Overrides: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'This example demonstrates how to override table-level properties on individual cells. The `align` prop is set to `center` at the table level, but overridden to `left` and `right` on specific cells. The `flushMargin` prop is also overridden on one cell to remove its horizontal padding independently of the table-level setting.',
      },
      source: {
        code: `
          <Table align="center">
            <Table.Head>
              <Table.Row>
                <Table.Header>Project Name</Table.Header>
                <Table.Header>Status</Table.Header>
                <Table.Header>Deadline</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Redesign Website</Table.Cell>
                <Table.Cell>Ongoing</Table.Cell>
                <Table.Cell>2024-05-30</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell flushMargin align="left">
                  Launch Mobile App
                </Table.Cell>
                <Table.Cell>Finished</Table.Cell>
                <Table.Cell align="right">overridden</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        `,
      },
    },
  },
  render: () => (
    <div className="w-full">
      <Table align="center">
        <Table.Head>
          <Table.Row>
            <Table.Header>Project Name</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header>Deadline</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Redesign Website</Table.Cell>
            <Table.Cell>Ongoing</Table.Cell>
            <Table.Cell>2024-05-30</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell flushMargin align="left">
              Launch Mobile App
            </Table.Cell>
            <Table.Cell>Finished</Table.Cell>
            <Table.Cell align="right">overridden</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Launch Mobile App</Table.Cell>
            <Table.Cell>Finished</Table.Cell>
            <Table.Cell>2024-06-15</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  ),
};

export const StickyHeader: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `stickyHeader` prop pins the header row to the top of the scroll container. The table must be inside a height-constrained container with `overflow-y: auto` or `overflow-y: scroll`. A solid background is applied automatically (`hasBackground` defaults to `true`) so scrolling rows do not show through the header.',
      },
      source: {
        code: `
          <div className="h-44 overflow-y-scroll">
            <Table stickyHeader>
              <Table.Head>
                <Table.Row>
                  <Table.Header>Project Name</Table.Header>
                  <Table.Header>Status</Table.Header>
                  <Table.Header>Deadline</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Redesign Website</Table.Cell>
                  <Table.Cell>Ongoing</Table.Cell>
                  <Table.Cell>2024-05-30</Table.Cell>
                </Table.Row>
                {/* …more rows */}
              </Table.Body>
            </Table>
          </div>
        `,
      },
    },
  },
  render: () => (
    <div className="h-44 overflow-y-scroll">
      <Table stickyHeader>
        <Table.Head>
          <Table.Row>
            <Table.Header>Project Name</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header>Deadline</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Redesign Website</Table.Cell>
            <Table.Cell>Ongoing</Table.Cell>
            <Table.Cell>2024-05-30</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Launch Mobile App</Table.Cell>
            <Table.Cell>Finished</Table.Cell>
            <Table.Cell>2024-06-15</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Redesign Website</Table.Cell>
            <Table.Cell>Ongoing</Table.Cell>
            <Table.Cell>2024-05-30</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Launch Mobile App</Table.Cell>
            <Table.Cell>Finished</Table.Cell>
            <Table.Cell>2024-06-15</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Launch Mobile App</Table.Cell>
            <Table.Cell>Finished</Table.Cell>
            <Table.Cell>2024-06-15</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Redesign Website</Table.Cell>
            <Table.Cell>Ongoing</Table.Cell>
            <Table.Cell>2024-05-30</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Launch Mobile App</Table.Cell>
            <Table.Cell>Finished</Table.Cell>
            <Table.Cell>2024-06-15</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  ),
};

export const StickyColumn: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `stickyColumn` prop pins the first column to the left edge of the scroll container. The table must be inside a width-constrained container with `overflow-x: auto` or `overflow-x: scroll`. A solid background is applied automatically (`hasBackground` defaults to `true`) so scrolling columns do not show through the sticky column.',
      },
      source: {
        code: `
          <div className="w-96 overflow-x-scroll">
            <Table stickyColumn className="w-[600px]">
              <Table.Head>
                <Table.Row>
                  <Table.Header>Project Name</Table.Header>
                  <Table.Header>Status</Table.Header>
                  <Table.Header>Deadline</Table.Header>
                  <Table.Header>Column 1</Table.Header>
                  <Table.Header>Column 2</Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Redesign Website</Table.Cell>
                  <Table.Cell>Ongoing</Table.Cell>
                  <Table.Cell>2024-05-30</Table.Cell>
                  <Table.Cell>Data 1</Table.Cell>
                  <Table.Cell>Data 2</Table.Cell>
                </Table.Row>
                {/* …more rows */}
              </Table.Body>
            </Table>
          </div>
        `,
      },
    },
  },
  render: () => (
    <div className="w-96 overflow-x-scroll">
      <Table stickyColumn className="w-[600px]">
        <Table.Head>
          <Table.Row>
            <Table.Header>Project Name</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header>Deadline</Table.Header>
            <Table.Header>Column 1</Table.Header>
            <Table.Header>Column 2</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Redesign Website</Table.Cell>
            <Table.Cell>Ongoing</Table.Cell>
            <Table.Cell>2024-05-30</Table.Cell>
            <Table.Cell>Data 1</Table.Cell>
            <Table.Cell>Data 2</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Redesign Website</Table.Cell>
            <Table.Cell>Ongoing</Table.Cell>
            <Table.Cell>2024-05-30</Table.Cell>
            <Table.Cell>Data 1</Table.Cell>
            <Table.Cell>Data 2</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Redesign Website</Table.Cell>
            <Table.Cell>Ongoing</Table.Cell>
            <Table.Cell>2024-05-30</Table.Cell>
            <Table.Cell>Data 1</Table.Cell>
            <Table.Cell>Data 2</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `interactive` prop enables hover and active styles on table rows, indicating that they are clickable. This is useful for tables where rows trigger actions — combine it with an `onClick` handler on `Table.Row` to handle navigation or other interactions. Note: enabling `selectionMode` automatically activates interactive styles, so you do not need to set `interactive` explicitly when using row selection.',
      },
    },
  },
  args: { interactive: true },
};

export const SingleRowSelection: Story = {
  parameters: { docs: { description: { story: 'Controls selection of one row at a time.' } } },
  render: function Render() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    return (
      <Table selectionMode="single">
        <Table.Head>
          <Table.Row>
            <Table.Header></Table.Header>
            <Table.Header>Project Name</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header>Deadline</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {selectionRows.map((row) => (
            <Table.Row
              key={row.id}
              selected={selectedId === row.id}
              onClick={() => setSelectedId(selectedId === row.id ? null : row.id)}
            >
              <Table.Cell>
                <Checkbox checked={selectedId === row.id} />
              </Table.Cell>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.status}</Table.Cell>
              <Table.Cell>{row.deadline}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  },
};

export const MultipleRowSelection: Story = {
  parameters: {
    docs: {
      description: { story: 'Controls independent row selection with a select-all checkbox.' },
    },
  },
  render: function Render() {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const toggle = (id: number) =>
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });

    const allSelected = selectedIds.size === selectionRows.length;
    const someSelected = selectedIds.size > 0 && !allSelected;

    const toggleAll = () =>
      setSelectedIds(selectedIds.size > 0 ? new Set() : new Set(selectionRows.map((r) => r.id)));

    return (
      <Table selectionMode="multiple">
        <Table.Head>
          <Table.Row>
            <Table.Header>
              <Checkbox
                checked={someSelected ? 'indeterminate' : allSelected}
                onClick={toggleAll}
              />
            </Table.Header>
            <Table.Header>Project Name</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header>Deadline</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {selectionRows.map((row) => (
            <Table.Row
              key={row.id}
              selected={selectedIds.has(row.id)}
              onClick={() => toggle(row.id)}
            >
              <Table.Cell>
                <Checkbox checked={selectedIds.has(row.id)} />
              </Table.Cell>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.status}</Table.Cell>
              <Table.Cell>{row.deadline}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  },
};

export const Sorting: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Add `sortable` to `Table.Header` to enable sorting on a column. Pass `sortDirection` (`'asc'`, `'desc'`, or `null`) and `onSort` to control the sort state. `aria-sort` is set automatically on the `<th>` element. Use `disabled` to block interaction (e.g. during a loading state). Clicking a column header cycles through: unsorted → ascending → descending → unsorted.",
      },
      source: {
        code: `
          const [sortKey, setSortKey] = useState<'name' | 'status' | null>(null);
          const [sortDir, setSortDir] = useState<'asc' | 'desc' | null>(null);

          return (
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Header
                    sortable
                    sortDirection={sortKey === 'name' ? sortDir : null}
                    onSort={() => handleSort('name')}
                  >
                    Project Name
                  </Table.Header>
                  <Table.Header
                    sortable
                    sortDirection={sortKey === 'status' ? sortDir : null}
                    onSort={() => handleSort('status')}
                  >
                    Status
                  </Table.Header>
                  <Table.Header sortable disabled>
                    Actions
                  </Table.Header>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {sortedRows.map((row) => (
                  <Table.Row key={row.id}>
                    <Table.Cell>{row.name}</Table.Cell>
                    <Table.Cell>{row.status}</Table.Cell>
                    <Table.Cell>—</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          );
        `,
      },
    },
  },
  render: function Render() {
    const [sortKey, setSortKey] = useState<SortKey | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>(null);

    const handleSort = (key: SortKey) => {
      if (sortKey !== key) {
        setSortKey(key);
        setSortDir('asc');
      } else if (sortDir === 'asc') {
        setSortDir('desc');
      } else {
        setSortKey(null);
        setSortDir(null);
      }
    };

    const dirFor = (key: SortKey): SortDir => (sortKey === key ? sortDir : null);

    const sorted = [...sortableRows].sort((a, b) => {
      if (!sortKey || !sortDir) return 0;
      const cmp = a[sortKey].localeCompare(b[sortKey]);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header sortable sortDirection={dirFor('name')} onSort={() => handleSort('name')}>
              Project Name
            </Table.Header>
            <Table.Header
              sortable
              sortDirection={dirFor('status')}
              onSort={() => handleSort('status')}
            >
              Status
            </Table.Header>
            <Table.Header
              sortable
              sortDirection={dirFor('deadline')}
              onSort={() => handleSort('deadline')}
            >
              Deadline
            </Table.Header>
            <Table.Header sortable disabled>
              Actions
            </Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {sorted.map((row) => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.status}</Table.Cell>
              <Table.Cell>{row.deadline}</Table.Cell>
              <Table.Cell>—</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  },
};

export const States: Story = exampleStory(StatesExample, statesSource);

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'This example demonstrates a more complex table layout with merged cells, multiple rows in header and footer, and various content types within cells.',
      },
      source: {
        code: `
          <Table separated>
            <Table.Head>
              <Table.Row>
                <Table.Header></Table.Header>
                <Table.Header>Project Name</Table.Header>
                <Table.Header>Status</Table.Header>
                <Table.Header>Progress</Table.Header>
                <Table.Header>Team Leader</Table.Header>
                <Table.Header>Deadline</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Header>Phase 1</Table.Header>
                <Table.Cell>Redesign Website</Table.Cell>
                <Table.Cell colSpan={2}>
                  <Badge emphasis="low">On Hold</Badge>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-ws-4">
                    <Avatar size="sm" />
                    Ana B
                  </div>
                </Table.Cell>
                <Table.Cell>2024-05-30</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Header>Phase 2</Table.Header>
                <Table.Cell>Redesign Website</Table.Cell>
                <Table.Cell rowSpan={2}>
                  <Badge emphasis="low">Ongoing</Badge>
                </Table.Cell>
                <Table.Cell>
                  <ProgressBar value={50} />
                </Table.Cell>
                <Table.Cell>Bruno C.</Table.Cell>
                <Table.Cell>2024-05-30</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Header>Phase 3</Table.Header>
                <Table.Cell>Redesign Website</Table.Cell>
                {/* no status cell: the rowSpan above covers this row */}
                <Table.Cell>
                  <ProgressBar value={60} />
                </Table.Cell>
                <Table.Cell>Ana B</Table.Cell>
                <Table.Cell>2024-05-30</Table.Cell>
              </Table.Row>
            </Table.Body>
            <Table.Foot>
              <Table.Row>
                <Table.Header>Summary</Table.Header>
                <Table.Cell colSpan={2}></Table.Cell>
                <Table.Cell>35%</Table.Cell>
                <Table.Cell colSpan={2}></Table.Cell>
              </Table.Row>
            </Table.Foot>
          </Table>
        `,
      },
    },
  },
  render: () => (
    <Table separated>
      <Table.Head>
        <Table.Row>
          <Table.Header></Table.Header>
          <Table.Header className="min-w-[250px]">Project Name</Table.Header>
          <Table.Header>Status</Table.Header>
          <Table.Header>Progress</Table.Header>
          <Table.Header>Team Leader</Table.Header>
          <Table.Header>Deadline</Table.Header>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Header>Phase 1</Table.Header>
          <Table.Cell>
            <div className="flex flex-col">
              <p>Redesign Website</p>
              <p className="text-ws-static-subtle typography-caption-sm">Description</p>
            </div>
          </Table.Cell>
          <Table.Cell colSpan={2}>
            <Badge emphasis="low">On Hold</Badge>
          </Table.Cell>
          <Table.Cell>
            <div className="gap-ws-4 flex items-center">
              <Avatar size="sm" />
              Ana B
            </div>
          </Table.Cell>
          <Table.Cell>
            <p className="text-ws-static-subtle">2024-05-30</p>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Header>Phase 2</Table.Header>
          <Table.Cell>
            <div className="flex flex-col">
              <p>Redesign Website</p>
              <p className="text-ws-static-subtle typography-caption-sm">Description</p>
            </div>
          </Table.Cell>
          <Table.Cell rowSpan={2}>
            <Badge emphasis="low">Ongoing</Badge>
          </Table.Cell>
          <Table.Cell>
            <ProgressBar value={50} />
          </Table.Cell>
          <Table.Cell>
            <div className="gap-ws-4 flex items-center">
              <Avatar
                size="sm"
                status="online"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?&w=128&h=128&dpr=2&q=80"
              />
              Bruno C.
            </div>
          </Table.Cell>
          <Table.Cell>
            <p className="text-ws-static-subtle">2024-05-30</p>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Header>Phase 3</Table.Header>
          <Table.Cell>
            <div className="flex flex-col">
              <p>Redesign Website</p>
              <p className="text-ws-static-subtle typography-caption-sm">Description</p>
            </div>
          </Table.Cell>
          <Table.Cell>
            <ProgressBar value={60} />
          </Table.Cell>
          <Table.Cell>
            <div className="gap-ws-4 flex items-center">
              <Avatar size="sm" />
              Ana B
            </div>
          </Table.Cell>
          <Table.Cell>
            <p className="text-ws-static-subtle">2024-05-30</p>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Foot>
        <Table.Row>
          <Table.Header>Summary</Table.Header>
          <Table.Cell colSpan={2}></Table.Cell>
          <Table.Cell>35%</Table.Cell>
          <Table.Cell colSpan={2}></Table.Cell>
        </Table.Row>
      </Table.Foot>
    </Table>
  ),
};
