import { RiCalendarLine, RiFolderLine } from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { exampleStory } from '../../stories/example';
import { Avatar } from '../avatar/Avatar';
import { Button } from '../button/Button';
import { SelectContent } from '../select/SelectContent';
import PresetsExample from './examples/multi-select/presets';
import presetsSource from './examples/multi-select/presets?raw';
import SelectionExample from './examples/multi-select/selection';
import selectionSource from './examples/multi-select/selection?raw';
import SizesExample from './examples/multi-select/sizes';
import sizesSource from './examples/multi-select/sizes?raw';
import StatesExample from './examples/multi-select/states';
import statesSource from './examples/multi-select/states?raw';
import VariantsExample from './examples/multi-select/variants';
import variantsSource from './examples/multi-select/variants?raw';
import { MultiSelect } from './MultiSelect';
import { MultiSelectOption } from './MultiSelectOption';

const sizes = ['sm', 'md', 'lg'] as const;

const sampleOptions = [
  { label: 'Poland', value: 'poland' },
  { label: 'USA', value: 'usa' },
  { label: 'Germany', value: 'germany' },
  { label: 'Canada', value: 'canada', disabled: true },
  { label: 'UK', value: 'uk', variant: 'danger' as const },
];

const selectableOptions = sampleOptions.filter((o) => !o.disabled);

const prefixOptions = [
  {
    label: 'widelab.co',
    value: 'text',
    prefix: <span className="text-ws-static-strong typography-label-sm">https://</span>,
  },
  {
    label: 'Calendar Events',
    value: 'calendar',
    prefix: <RiCalendarLine className="text-ws-dynamic-secondary-default size-ws-8" />,
  },
  {
    label: 'Project Files',
    value: 'files',
    prefix: <RiFolderLine className="text-ws-dynamic-secondary-default size-ws-8" />,
  },
  {
    label: 'John Doe',
    value: 'user',
    prefix: (
      <Avatar
        size="xs"
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
        initials="JD"
      />
    ),
  },
];

const meta = {
  title: 'Form/Select/MultiSelect',
  tags: ['autodocs'],
  component: MultiSelect,
  subcomponents: {
    'MultiSelect.Content': SelectContent,
    'MultiSelect.Option': MultiSelectOption,
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `MultiSelect lets users choose several options from a dropdown. Supports controlled and uncontrolled usage,
search filtering, select-all, and individual tag removal.

Use Select for a single selection or Checkbox.Group for a short list that should remain visible.

**Two usage modes:**

For most cases you can use simple:
\`\`\`
<MultiSelect options={[...]} />
\`\`\`

For full control over grouping and structure use primitives directly:
\`\`\`
<MultiSelect>                  — root, controls value/onValueChange/disabled
  <MultiSelect.Trigger>        — clickable trigger button
  <MultiSelect.Content>        — dropdown panel
    <MultiSelect.Group>        — groups related options
      <MultiSelect.Label>      — group heading
      <MultiSelect.Option>     — individual option with checkbox
    </MultiSelect.Group>
    <MultiSelect.Separator>    — visual divider between groups
  </MultiSelect.Content>
</MultiSelect>
\`\`\``,
      },
    },
  },
  argTypes: {
    selectAllLabel: { table: { category: 'Content', type: { summary: 'string' } } },
    deselectAllLabel: { table: { category: 'Content', type: { summary: 'string' } } },
    clearSelectionAriaLabel: { table: { category: 'Content', type: { summary: 'string' } } },
    defaultMotion: { table: { category: 'Behavior', type: { summary: 'boolean' } } },
    size: {
      options: sizes,
      control: 'radio',
      table: {
        category: 'Appearance',
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
      },
    },
    preset: {
      options: ['border', 'ghost'],
      control: 'radio',
      table: {
        category: 'Appearance',
        type: { summary: 'border | ghost' },
        defaultValue: { summary: 'border' },
      },
    },
    variant: {
      options: ['primary', 'danger'],
      control: 'radio',
      table: {
        category: 'Appearance',
        type: { summary: 'primary | danger' },
        defaultValue: { summary: 'primary' },
      },
    },
    hideArrow: {
      control: 'boolean',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      control: 'text',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
      },
    },
    children: {
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },
    options: {
      control: 'object',
      table: {
        category: 'Content',
        type: { summary: 'MultiSelectOptionType[]' },
      },
    },
    placeholder: {
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    maxVisibleTags: {
      control: 'number',
      table: {
        category: 'Content',
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    multiValuesLabel: {
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'value(s) selected' },
      },
    },
    disabled: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    clearable: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hasSelectAll: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hasSearch: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    noResultsLabel: {
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'No results found' },
      },
    },
    value: {
      control: 'object',
      table: {
        category: 'Behavior',
        type: { summary: 'string[]' },
      },
    },
    defaultValue: {
      control: 'object',
      table: {
        category: 'Behavior',
        type: { summary: 'string[]' },
      },
    },
    id: {
      control: 'text',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
      },
    },
    name: {
      control: 'text',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
      },
    },
    open: {
      control: false,
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
      },
    },
    defaultOpen: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    modal: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
      },
    },
    portalContainer: {
      control: false,
      table: {
        category: 'Behavior',
        type: { summary: 'HTMLElement' },
      },
    },
    onValueChange: {
      table: {
        category: 'Events',
        type: { summary: '(value: string[]) => void' },
      },
    },
    onClear: {
      table: {
        category: 'Events',
        type: { summary: '() => void' },
      },
    },
    onOpenChange: {
      table: {
        category: 'Events',
        type: { summary: '(open: boolean) => void' },
      },
    },
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Minimal multi-select example with the default visual settings and active controls.',
      },
    },
  },
  args: {
    options: sampleOptions,
    placeholder: 'Select countries',
    size: 'md',
    preset: 'border',
    variant: 'primary',
  },
  render: (args) => <MultiSelect {...args} portalContainer={document.body} />,
};

export const Variants: Story = exampleStory(VariantsExample, variantsSource);

export const Presets: Story = exampleStory(PresetsExample, presetsSource);

export const Sizes: Story = exampleStory(SizesExample, sizesSource);

export const Selection: Story = exampleStory(SelectionExample, selectionSource);

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Controlled mode: selected values are managed externally via `value` and `onValueChange`. The buttons demonstrate programmatic value changes.',
      },
    },
  },
  argTypes: {
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
  args: Default.args,
  render: function Render(args) {
    const [value, setValue] = useState<string[]>(['poland']);
    return (
      <div className="gap-ws-9 flex flex-col">
        <MultiSelect
          {...args}
          value={value}
          onValueChange={(nextValue) => {
            setValue(nextValue);
            args.onValueChange?.(nextValue);
          }}
          portalContainer={document.body}
        />
        <div className="gap-ws-8 flex">
          <Button
            onClick={() => setValue(['germany', 'usa'])}
            size="sm"
            preset="border"
            className="flex-1"
          >
            Germany + USA
          </Button>
          <Button onClick={() => setValue([])} size="sm" preset="border" className="flex-1">
            Clear
          </Button>
        </div>
      </div>
    );
  },
};

export const Clearable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When `clearable` is true, an X button appears next to the trigger arrow once at least one value is selected.',
      },
    },
  },
  argTypes: {
    clearable: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
  },
  args: {
    ...Default.args,
    clearable: true,
    defaultValue: ['usa', 'germany'],
  },
  render: (args) => <MultiSelect {...args} portalContainer={document.body} />,
};

export const WithScroll: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A long list stops at 18rem and scrolls in a `ScrollArea`; the search field scrolls with it.',
      },
    },
  },
  args: {
    ...Default.args,
    placeholder: 'Countries',
    hasSearch: true,
    options: [
      'Austria',
      'Belgium',
      'Bulgaria',
      'Croatia',
      'Cyprus',
      'Czechia',
      'Denmark',
      'Estonia',
      'Finland',
      'France',
      'Germany',
      'Greece',
      'Hungary',
      'Ireland',
      'Italy',
      'Poland',
      'Portugal',
      'Spain',
      'Sweden',
    ].map((label) => ({ label, value: label.toLowerCase() })),
  },
  render: (args) => <MultiSelect {...args} portalContainer={document.body} />,
};

export const MixedOptionVariants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Options can use the `danger` variant to visually flag destructive choices within the list.',
      },
    },
  },
  argTypes: {
    options: { table: { disable: true } },
    value: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
  args: Default.args,
  render: function Render(args) {
    const [value, setValue] = useState<string[]>(['archive']);
    return (
      <MultiSelect
        {...args}
        options={[
          { label: 'Archive draft', value: 'archive' },
          { label: 'Notify team', value: 'notify' },
          { label: 'Delete project', value: 'delete', variant: 'danger' as const },
        ]}
        value={value}
        onValueChange={(nextValue) => {
          setValue(nextValue);
          args.onValueChange?.(nextValue);
        }}
        portalContainer={document.body}
      />
    );
  },
};

export const OptionsWithPrefix: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Options support a `prefix` element — any ReactNode such as an icon, avatar, or text — shown inside each option row.',
      },
    },
  },
  argTypes: {
    options: { table: { disable: true } },
  },
  args: { ...Default.args, placeholder: 'Choose repositories' },
  render: (args) => (
    <MultiSelect {...args} options={prefixOptions} portalContainer={document.body} />
  ),
};

export const WithSearch: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When `hasSearch` is true, a search input appears at the top of the dropdown and filters options by label as the user types.',
      },
    },
  },
  argTypes: {
    hasSearch: { table: { disable: true } },
  },
  args: { ...Default.args, hasSearch: true },
  render: (args) => <MultiSelect {...args} portalContainer={document.body} />,
};

export const WithSelectAll: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When `hasSelectAll` is true, a checkbox at the top toggles all options. It shows an indeterminate state when only some options are selected.',
      },
    },
  },
  argTypes: {
    hasSelectAll: { table: { disable: true } },
    value: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
  args: { ...Default.args, hasSelectAll: true },
  render: function Render(args) {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className="gap-ws-4 flex w-80 flex-col">
        <p className="typography-label-sm text-ws-dynamic-secondary-default min-h-[2lh]">
          {value.length === 0 && 'No items selected — checkbox is unchecked'}
          {value.length > 0 &&
            value.length < selectableOptions.length &&
            `${value.length} of ${selectableOptions.length} selected — checkbox is indeterminate`}
          {value.length === selectableOptions.length &&
            'All selectable items selected — checkbox is checked, label reads "Deselect all"'}
        </p>
        <MultiSelect
          {...args}
          value={value}
          onValueChange={(nextValue) => {
            setValue(nextValue);
            args.onValueChange?.(nextValue);
          }}
          portalContainer={document.body}
        />
      </div>
    );
  },
};

export const WithSearchAndSelectAll: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When used together, "Select all" applies only to the currently visible (filtered) options — not to the full list.',
      },
    },
  },
  argTypes: {
    hasSelectAll: { table: { disable: true } },
    hasSearch: { table: { disable: true } },
    value: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
  args: { ...Default.args, hasSelectAll: true, hasSearch: true },
  render: function Render(args) {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className="gap-ws-4 flex w-80 flex-col">
        <p className="typography-label-sm text-ws-dynamic-secondary-default min-h-[2lh]">
          {value.length === 0 && 'No items selected'}
          {value.length > 0 &&
            value.length < selectableOptions.length &&
            `${value.length} of ${selectableOptions.length} selected — Select all applies only to visible (filtered) options`}
          {value.length === selectableOptions.length && 'All selectable items selected'}
        </p>
        <MultiSelect
          {...args}
          value={value}
          onValueChange={(nextValue) => {
            setValue(nextValue);
            args.onValueChange?.(nextValue);
          }}
          portalContainer={document.body}
        />
      </div>
    );
  },
};

export const MaxVisibleTags: Story = {
  parameters: {
    docs: {
      description: {
        story: `\`maxVisibleTags\` has three distinct modes:

- **\`undefined\` (default)** - all selected tags are always shown; the trigger grows in height to fit them.
- **\`0\`** - always collapses to the aggregated summary label, never shows individual tags.
- **\`>= 1\`** - shows individual tags up to the given limit, then collapses to the summary label.`,
      },
    },
  },
  argTypes: {
    maxVisibleTags: { table: { disable: true } },
    multiValuesLabel: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
  },
  args: {
    ...Default.args,
  },
  render: function Render(args) {
    const [valueAll, setValueAll] = useState<string[]>(['poland', 'usa', 'germany']);
    const [valueNone, setValueNone] = useState<string[]>(['poland']);
    const [valueTwo, setValueTwo] = useState<string[]>(['poland', 'usa']);

    return (
      <div className="gap-ws-8 flex w-80 flex-col">
        <MultiSelect
          {...args}
          maxVisibleTags={undefined}
          value={valueAll}
          onValueChange={(nextValue) => {
            setValueAll(nextValue);
            args.onValueChange?.(nextValue);
          }}
          portalContainer={document.body}
        />
        <MultiSelect
          {...args}
          maxVisibleTags={0}
          value={valueNone}
          onValueChange={(nextValue) => {
            setValueNone(nextValue);
            args.onValueChange?.(nextValue);
          }}
          portalContainer={document.body}
        />
        <MultiSelect
          {...args}
          maxVisibleTags={2}
          value={valueTwo}
          onValueChange={(nextValue) => {
            setValueTwo(nextValue);
            args.onValueChange?.(nextValue);
          }}
          portalContainer={document.body}
        />
      </div>
    );
  },
};

export const States: Story = exampleStory(StatesExample, statesSource);

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the primitive sub-components (`MultiSelect.Group`, `MultiSelect.Label`, `MultiSelect.Separator`) to build grouped options with section headings and your own selection logic.',
      },
    },
  },
  argTypes: {
    options: { table: { disable: true } },
  },
  args: Default.args,
  render: function Render(args) {
    const [value, setValue] = useState<string[]>([]);
    const toggle = (v: string) =>
      setValue((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

    return (
      <MultiSelect {...args}>
        <MultiSelect.Trigger asChild>
          <button className="typography-label-sm rounded-ws-control-lg border-ws-dynamic-secondary-default bg-ws-static-highlight-base h-ws-forms-md px-ws-9 w-64 border text-left">
            {value.length ? `${value.length} selected` : args.placeholder}
          </button>
        </MultiSelect.Trigger>
        <MultiSelect.Content
          shouldUsePrimitive={false}
          align="start"
          sideOffset={4}
          portalContainer={document.body}
        >
          <MultiSelect.Group>
            <MultiSelect.Label>European Countries</MultiSelect.Label>
            <MultiSelect.Option
              option={{ value: 'poland', label: 'Poland' }}
              isSelected={value.includes('poland')}
              isDisabled={false}
              onSelect={() => toggle('poland')}
            />
            <MultiSelect.Option
              option={{ value: 'germany', label: 'Germany' }}
              isSelected={value.includes('germany')}
              isDisabled={false}
              onSelect={() => toggle('germany')}
            />
            <MultiSelect.Option
              option={{ value: 'uk', label: 'UK' }}
              isSelected={value.includes('uk')}
              isDisabled={false}
              onSelect={() => toggle('uk')}
            />
          </MultiSelect.Group>
          <MultiSelect.Separator />
          <MultiSelect.Group>
            <MultiSelect.Label>North American Countries</MultiSelect.Label>
            <MultiSelect.Option
              option={{ value: 'usa', label: 'USA' }}
              isSelected={value.includes('usa')}
              isDisabled={false}
              onSelect={() => toggle('usa')}
            />
            <MultiSelect.Option
              option={{ value: 'canada', label: 'Canada' }}
              isSelected={value.includes('canada')}
              isDisabled={false}
              onSelect={() => toggle('canada')}
            />
          </MultiSelect.Group>
        </MultiSelect.Content>
      </MultiSelect>
    );
  },
};
