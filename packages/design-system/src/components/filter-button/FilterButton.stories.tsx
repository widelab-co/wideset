import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { fn } from 'storybook/test';

import { exampleStory } from '../../stories/example';
import { Checkbox } from '../checkbox/Checkbox';
import SizesExample from './examples/filter-button/sizes';
import sizesSource from './examples/filter-button/sizes?raw';
import StatesExample from './examples/filter-button/states';
import statesSource from './examples/filter-button/states?raw';
import { FilterButton, type FilterButtonProps } from './FilterButton';

const sampleOptions: FilterButtonProps['options'] = [
  { label: 'Poland', value: 'poland' },
  { label: 'USA', value: 'usa' },
  { label: 'Germany', value: 'germany' },
  { label: 'Canada', value: 'canada', disabled: true },
  { label: 'UK', value: 'uk' },
];

const sizes: Array<NonNullable<FilterButtonProps['size']>> = ['sm', 'md', 'lg'];

const meta = {
  title: 'Components/FilterButton',
  tags: ['autodocs'],
  component: FilterButton,
  parameters: {
    docs: {
      description: {
        component: `FilterButton is a compact multi-select trigger that opens a checklist in a popup.
Use it in toolbars and filter bars when users need to narrow results with a short, predefined set of options.

Use MultiSelect for a form field with several selections rather than a compact toolbar filter.`,
      },
    },
  },
  argTypes: {
    clearFilterAriaLabel: { table: { category: 'Content', type: { summary: 'string' } } },
    defaultMotion: { table: { category: 'Behavior', type: { summary: 'boolean' } } },
    size: {
      description: 'The size of the filter button.',
      options: sizes,
      control: 'radio',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'sm' },
        type: { summary: "'sm' | 'md' | 'lg'" },
      },
    },
    disabled: {
      description: 'When true, the filter button is disabled.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    placeholder: {
      control: 'text',
      table: {
        category: 'Content',
        defaultValue: { summary: 'Filter' },
        type: { summary: 'string' },
      },
    },
    label: {
      control: 'text',
      table: {
        category: 'Content',
        defaultValue: { summary: 'Filter' },
        type: { summary: 'string' },
      },
    },
    options: {
      control: 'object',
      table: {
        category: 'Content',
        type: { summary: 'FilterButtonOption[]' },
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
    onChange: {
      table: {
        category: 'Events',
        type: { summary: '(value: string[]) => void' },
      },
    },
    className: {
      description: 'Additional CSS classes for the filter button.',
      control: 'text',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
      },
    },
  },
} satisfies Meta<typeof FilterButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Minimal filter button example with the default size and interactive multi-select behavior.',
      },
      source: {
        code: `function FilterButtonExample() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  return (
    <FilterButton
      options={sampleOptions}
      placeholder="Filter"
      label="Filter"
      value={selectedItems}
      onChange={setSelectedItems}
      size="sm"
      disabled={false}
    />
  );
}`,
      },
    },
  },
  render: function Render({
    onChange = () => {},
    value,
    defaultValue,
    ...args
  }: FilterButtonProps) {
    const [selectedItems, setSelectedItems] = useState<string[]>(value ?? defaultValue ?? []);

    useEffect(() => {
      if (value !== undefined) {
        setSelectedItems(value);
        return;
      }

      setSelectedItems(defaultValue ?? []);
    }, [defaultValue, value]);

    return (
      <FilterButton
        {...args}
        value={selectedItems}
        onChange={(nextValue) => {
          setSelectedItems(nextValue);
          onChange(nextValue);
        }}
      />
    );
  },
  args: {
    options: sampleOptions,
    placeholder: 'Filter',
    label: 'Filter',
    onChange: fn(),
    size: 'sm',
    disabled: false,
  },
};

export const Sizes: Story = {
  ...exampleStory(SizesExample, sizesSource),
  args: { options: sampleOptions, onChange: () => {} },
};

export const PlaceholderAndLabel: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `placeholder` to describe the empty state and `label` to keep context visible once the trigger starts summarizing selected options.',
      },
      source: {
        code: `function FilterButtonCopyExample() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  return (
    <FilterButton
      options={sampleOptions}
      placeholder="Select country"
      label="Country"
      value={selectedItems}
      onChange={setSelectedItems}
    />
  );
}`,
      },
    },
  },
  render: function Render({
    onChange = () => {},
    value,
    defaultValue,
    ...args
  }: FilterButtonProps) {
    const [selectedItems, setSelectedItems] = useState<string[]>(value ?? defaultValue ?? []);

    useEffect(() => {
      if (value !== undefined) {
        setSelectedItems(value);
        return;
      }

      setSelectedItems(defaultValue ?? []);
    }, [defaultValue, value]);

    return (
      <FilterButton
        {...args}
        value={selectedItems}
        onChange={(nextValue) => {
          setSelectedItems(nextValue);
          onChange(nextValue);
        }}
      />
    );
  },
  args: {
    ...Default.args,
    placeholder: 'Select country',
    label: 'Country',
  },
};

export const DefaultValue: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `defaultValue` when the component should start with a selection, but the parent does not need to control subsequent changes.',
      },
      source: {
        code: `<FilterButton
  options={sampleOptions}
  placeholder="Select country"
  label="Filter"
  defaultValue={['poland']}
  onChange={() => {}}
/>`,
      },
    },
  },
  argTypes: {
    value: { table: { disable: true } },
  },
  render: (args) => <FilterButton {...args} onChange={args.onChange ?? (() => {})} />,
  args: {
    ...Default.args,
    placeholder: 'Select country',
    defaultValue: ['poland'],
  },
};

export const WithScroll: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A long list stops at 18rem and scrolls in a `ScrollArea`. Pressing or dragging its bar keeps focus on the option you were on.',
      },
    },
  },
  render: (args) => <FilterButton {...args} onChange={args.onChange ?? (() => {})} />,
  args: {
    ...Default.args,
    label: 'Country',
    placeholder: 'Country',
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
};

export const States: Story = {
  ...exampleStory(StatesExample, statesSource),
  args: { options: sampleOptions, onChange: () => {} },
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A controlled example wired to external UI state. Use this pattern when filters need to stay in sync with other controls or be reset from outside the component.',
      },
      source: {
        code: `function ControlledFilterButtonExample() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  return (
    <div className="inline-flex w-auto flex-col gap-ws-10">
      <FilterButton
        options={sampleOptions}
        placeholder="Select country"
        label="Country"
        value={selectedItems}
        onChange={setSelectedItems}
      />

      <Checkbox
        label={\`Select \${sampleOptions[0].label}\`}
        checked={selectedItems.includes(sampleOptions[0].value)}
        onCheckedChange={(checked) => {
          setSelectedItems((items) =>
            checked
              ? [...items.filter((item) => item !== sampleOptions[0].value), sampleOptions[0].value]
              : items.filter((item) => item !== sampleOptions[0].value),
          );
        }}
      />
    </div>
  );
}`,
      },
    },
  },
  argTypes: {
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
  },
  render: function Render({ onChange = () => {}, ...args }) {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    return (
      <div className="gap-ws-10 inline-flex w-auto flex-col">
        <FilterButton
          {...args}
          placeholder="Select country"
          label="Country"
          value={selectedItems}
          onChange={(nextValue) => {
            setSelectedItems(nextValue);
            onChange(nextValue);
          }}
        />
        <Checkbox
          label={`Select ${sampleOptions[0].label}`}
          onCheckedChange={(checked) => {
            const nextSelectedItems = checked
              ? [
                  ...selectedItems.filter((item) => item !== sampleOptions[0].value),
                  sampleOptions[0].value,
                ]
              : selectedItems.filter((item) => item !== sampleOptions[0].value);

            setSelectedItems(nextSelectedItems);
            onChange(nextSelectedItems);
          }}
          checked={selectedItems.includes(sampleOptions[0].value)}
        />
      </div>
    );
  },
  args: {
    ...Default.args,
    placeholder: 'Select country',
    label: 'Country',
  },
};
