import {
  RiBracesLine,
  RiCodeSSlashLine,
  RiFileTextLine,
  RiFolderLine,
  RiFolderOpenLine,
  RiMarkdownLine,
  RiSearchLine,
} from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ChangeEvent, type ReactNode, useState } from 'react';

import { Button } from '../button/Button';
import { TextInput } from '../text-input/TextInput';
import { TreeView } from './TreeView';

const meta = {
  title: 'Components/TreeView',
  component: TreeView,
  tags: ['autodocs'],
  subcomponents: {
    'TreeView.Item': TreeView.Item,
    'TreeView.Icon': TreeView.Icon,
  },
  parameters: {
    docs: {
      description: {
        component: `TreeView shows a hierarchy whose levels fold open and shut, such as the files and folders of a repository.
An item with a \`TreeView.Group\` is a branch: clicking it, Enter or Space folds it. An item without one is a leaf: clicking it selects it (\`value\`).
The keyboard follows the WAI-ARIA tree pattern: arrows move and fold, Home and End jump, a letter jumps to the next item that starts with it.

Use Sidebar for an app's navigation, and Accordion for a few titled sections of content.

**Composition:**
\`\`\`
<TreeView>                  — root, owns \`value\` (selected leaf) and \`expanded\` (open branches)
  <TreeView.Item>           — one item, owns its \`value\`
    <TreeView.Icon>         — optional leading icon; \`expandedIcon\` while its group is open
    <TreeView.Label>        — the item's name
    <TreeView.Suffix>       — optional trailing count, letter or dot
    <TreeView.Group>        — the items one level in; makes the item a branch
      <TreeView.Item />
    </TreeView.Group>
  </TreeView.Item>
</TreeView>
\`\`\``,
      },
    },
  },
  argTypes: {
    value: { control: 'text', table: { category: 'Behavior', type: { summary: 'string' } } },
    defaultValue: { control: 'text', table: { category: 'Behavior', type: { summary: 'string' } } },
    expanded: { control: false, table: { category: 'Behavior', type: { summary: 'string[]' } } },
    defaultExpanded: {
      control: 'object',
      table: {
        category: 'Behavior',
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' },
      },
    },
    defaultMotion: { table: { category: 'Behavior', type: { summary: 'boolean' } } },
    onValueChange: { table: { category: 'Events', type: { summary: '(value: string) => void' } } },
    onExpandedChange: {
      table: { category: 'Events', type: { summary: '(expanded: string[]) => void' } },
    },
    'aria-label': {
      description: 'Names the tree for assistive technology.',
      control: 'text',
      table: { category: 'Content', type: { summary: 'string' } },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[18rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Files',
    defaultExpanded: ['src', 'src/features'],
    defaultValue: 'src/features/bookings-table.tsx',
  },
  render: (args) => (
    <TreeView {...args}>
      <TreeView.Item value="e2e">
        <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} />
        <TreeView.Label>e2e</TreeView.Label>
        <TreeView.Group>
          <TreeView.Item value="e2e/bookings.spec.ts">
            <TreeView.Icon icon={RiCodeSSlashLine} />
            <TreeView.Label>bookings.spec.ts</TreeView.Label>
          </TreeView.Item>
        </TreeView.Group>
      </TreeView.Item>
      <TreeView.Item value="src">
        <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} />
        <TreeView.Label>src</TreeView.Label>
        <TreeView.Group>
          <TreeView.Item value="src/features">
            <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} />
            <TreeView.Label>features</TreeView.Label>
            <TreeView.Group>
              <TreeView.Item value="src/features/bookings-table.tsx">
                <TreeView.Icon icon={RiCodeSSlashLine} />
                <TreeView.Label>bookings-table.tsx</TreeView.Label>
              </TreeView.Item>
              <TreeView.Item value="src/features/bookings-toolbar.tsx">
                <TreeView.Icon icon={RiCodeSSlashLine} />
                <TreeView.Label>bookings-toolbar.tsx</TreeView.Label>
              </TreeView.Item>
            </TreeView.Group>
          </TreeView.Item>
          <TreeView.Item value="src/main.tsx">
            <TreeView.Icon icon={RiCodeSSlashLine} />
            <TreeView.Label>main.tsx</TreeView.Label>
          </TreeView.Item>
        </TreeView.Group>
      </TreeView.Item>
      <TreeView.Item value="package.json">
        <TreeView.Icon icon={RiBracesLine} />
        <TreeView.Label>package.json</TreeView.Label>
      </TreeView.Item>
      <TreeView.Item value="README.md">
        <TreeView.Icon icon={RiMarkdownLine} />
        <TreeView.Label>README.md</TreeView.Label>
      </TreeView.Item>
    </TreeView>
  ),
};

export const States: Story = {
  args: { ...Default.args, defaultExpanded: ['docs'], defaultValue: 'docs/onboarding.md' },
  parameters: {
    docs: {
      description: {
        story:
          'Selected, disabled and a long name. A disabled item stays in the keyboard order but cannot be selected or folded; a long name ends in an ellipsis on one line.',
      },
    },
  },
  render: (args) => (
    <TreeView {...args}>
      <TreeView.Item value="docs">
        <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} />
        <TreeView.Label>docs</TreeView.Label>
        <TreeView.Group>
          <TreeView.Item value="docs/onboarding.md">
            <TreeView.Icon icon={RiMarkdownLine} />
            <TreeView.Label>onboarding.md</TreeView.Label>
          </TreeView.Item>
          <TreeView.Item value="docs/archive.md" disabled>
            <TreeView.Icon icon={RiMarkdownLine} />
            <TreeView.Label>archive.md</TreeView.Label>
          </TreeView.Item>
          <TreeView.Item value="docs/long">
            <TreeView.Icon icon={RiFileTextLine} />
            <TreeView.Label>
              quarterly-revenue-reconciliation-for-the-finance-team.md
            </TreeView.Label>
          </TreeView.Item>
        </TreeView.Group>
      </TreeView.Item>
      <TreeView.Item value="private" disabled>
        <TreeView.Icon icon={RiFolderLine} />
        <TreeView.Label>private</TreeView.Label>
        <TreeView.Group>
          <TreeView.Item value="private/keys.json">
            <TreeView.Icon icon={RiBracesLine} />
            <TreeView.Label>keys.json</TreeView.Label>
          </TreeView.Item>
        </TreeView.Group>
      </TreeView.Item>
    </TreeView>
  ),
};

type RepoFile = { path: string; change?: 'added' | 'modified' };

const REPOSITORY: RepoFile[] = [
  { path: 'e2e/bookings-export.spec.ts' },
  { path: 'e2e/bookings.spec.ts' },
  { path: 'src/app/layout.tsx' },
  { path: 'src/app/page.tsx' },
  { path: 'src/features/bookings/bookings-table.test.tsx' },
  { path: 'src/features/bookings/bookings-table.tsx', change: 'modified' },
  { path: 'src/features/bookings/bookings-toolbar.tsx', change: 'modified' },
  { path: 'src/features/bookings/export-csv.test.ts', change: 'added' },
  { path: 'src/features/bookings/export-csv.ts', change: 'added' },
  { path: 'src/features/bookings/filters.ts' },
  { path: 'src/lib/format-date.ts', change: 'modified' },
  { path: 'package.json' },
  { path: 'README.md' },
];

export const Composition: Story = {
  args: { 'aria-label': 'Files in lumen-app' },
  parameters: {
    docs: {
      description: {
        story:
          "A repository's files, as a code agent's side panel shows them. A changed file carries git's letter in the suffix, green when added and blue when modified, and every folder above it a dot, so a change shows however much of the tree is folded. Typing in the filter narrows the tree to the matching paths with their folders open.",
      },
    },
  },
  render: function Render(args) {
    const [query, setQuery] = useState('');
    const [expanded, setExpanded] = useState(['src', 'src/features', 'src/features/bookings']);
    const [value, setValue] = useState('src/features/bookings/export-csv.ts');

    const needle = query.trim().toLowerCase();
    const shown = REPOSITORY.filter((file) => file.path.toLowerCase().includes(needle));
    const iconOf = (name: string) =>
      name.endsWith('.md')
        ? RiMarkdownLine
        : name.endsWith('.json')
          ? RiBracesLine
          : RiCodeSSlashLine;

    // Folders first, then files, each by name, as an editor's explorer lists them.
    const items = (prefix: string): ReactNode[] => {
      const inside = shown.filter((file) => file.path.startsWith(prefix));
      const folders = [
        ...new Set(
          inside
            .map((file) => file.path.slice(prefix.length).split('/'))
            .filter((parts) => parts.length > 1)
            .map((parts) => parts[0]),
        ),
      ].sort();
      const files = inside.filter((file) => !file.path.slice(prefix.length).includes('/'));

      return [
        ...folders.map((name) => {
          const path = prefix + name;
          const changed = REPOSITORY.some(
            (file) => file.change && file.path.startsWith(`${path}/`),
          );
          return (
            <TreeView.Item key={path} value={path}>
              <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} />
              <TreeView.Label>{name}</TreeView.Label>
              {changed && (
                <TreeView.Suffix>
                  <span className="bg-ws-semantic-inverse-info size-ws-4 rounded-ws-control-full" />
                  <span className="sr-only">has changes</span>
                </TreeView.Suffix>
              )}
              <TreeView.Group>{items(`${path}/`)}</TreeView.Group>
            </TreeView.Item>
          );
        }),
        ...files.map((file) => {
          const name = file.path.slice(prefix.length);
          return (
            <TreeView.Item key={file.path} value={file.path}>
              <TreeView.Icon icon={iconOf(name)} />
              <TreeView.Label>{name}</TreeView.Label>
              {file.change && (
                <TreeView.Suffix
                  className={
                    file.change === 'added'
                      ? 'text-ws-semantic-positive typography-caption-strong-md'
                      : 'text-ws-semantic-info typography-caption-strong-md'
                  }
                >
                  <span aria-hidden="true">{file.change === 'added' ? 'A' : 'M'}</span>
                  <span className="sr-only">{file.change}</span>
                </TreeView.Suffix>
              )}
            </TreeView.Item>
          );
        }),
      ];
    };

    // A filter opens every folder it found something in.
    const allFolders = REPOSITORY.flatMap((file) =>
      file.path
        .split('/')
        .slice(0, -1)
        .map((_, i, parts) => parts.slice(0, i + 1).join('/')),
    );

    return (
      <div className="gap-ws-5 flex flex-col">
        <TextInput
          size="sm"
          value={query}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
        >
          <TextInput.Prefix inner>
            <TextInput.Icon icon={RiSearchLine} />
          </TextInput.Prefix>
          <TextInput.Input type="search" placeholder="Filter files" aria-label="Filter files" />
          <TextInput.Suffix inner>
            <TextInput.ClearButton aria-label="Clear filter" />
          </TextInput.Suffix>
        </TextInput>
        {shown.length > 0 ? (
          <TreeView
            {...args}
            value={value}
            onValueChange={setValue}
            expanded={needle ? allFolders : expanded}
            onExpandedChange={setExpanded}
          >
            {items('')}
          </TreeView>
        ) : (
          <p role="status" className="typography-body-sm text-ws-static-subtle px-ws-5 py-ws-4">
            No files match “{query.trim()}”
          </p>
        )}
      </div>
    );
  },
};

export const Controlled: Story = {
  args: { 'aria-label': 'Workspace' },
  parameters: {
    docs: {
      description: {
        story:
          'The open branches as state (`expanded`, `onExpandedChange`), so actions outside the tree can fold it: Expand all and Collapse all here.',
      },
    },
  },
  render: function Render(args) {
    const branches = ['marketing', 'marketing/campaigns', 'product'];
    const [expanded, setExpanded] = useState<string[]>(['marketing']);
    const [value, setValue] = useState<string>();

    return (
      <div className="gap-ws-5 flex flex-col">
        <div className="gap-ws-3 flex">
          <Button size="sm" variant="secondary" onClick={() => setExpanded(branches)}>
            Expand all
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setExpanded([])}>
            Collapse all
          </Button>
        </div>
        <TreeView
          {...args}
          value={value}
          onValueChange={setValue}
          expanded={expanded}
          onExpandedChange={setExpanded}
        >
          <TreeView.Item value="marketing">
            <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} />
            <TreeView.Label>Marketing</TreeView.Label>
            <TreeView.Suffix>3</TreeView.Suffix>
            <TreeView.Group>
              <TreeView.Item value="marketing/campaigns">
                <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} />
                <TreeView.Label>Campaigns</TreeView.Label>
                <TreeView.Suffix>2</TreeView.Suffix>
                <TreeView.Group>
                  <TreeView.Item value="marketing/campaigns/spring">
                    <TreeView.Icon icon={RiFileTextLine} />
                    <TreeView.Label>Spring launch</TreeView.Label>
                  </TreeView.Item>
                  <TreeView.Item value="marketing/campaigns/black-friday">
                    <TreeView.Icon icon={RiFileTextLine} />
                    <TreeView.Label>Black Friday</TreeView.Label>
                  </TreeView.Item>
                </TreeView.Group>
              </TreeView.Item>
              <TreeView.Item value="marketing/brand-guide">
                <TreeView.Icon icon={RiFileTextLine} />
                <TreeView.Label>Brand guide</TreeView.Label>
              </TreeView.Item>
            </TreeView.Group>
          </TreeView.Item>
          <TreeView.Item value="product">
            <TreeView.Icon icon={RiFolderLine} expandedIcon={RiFolderOpenLine} />
            <TreeView.Label>Product</TreeView.Label>
            <TreeView.Suffix>1</TreeView.Suffix>
            <TreeView.Group>
              <TreeView.Item value="product/roadmap">
                <TreeView.Icon icon={RiFileTextLine} />
                <TreeView.Label>Roadmap 2027</TreeView.Label>
              </TreeView.Item>
            </TreeView.Group>
          </TreeView.Item>
        </TreeView>
      </div>
    );
  },
};
