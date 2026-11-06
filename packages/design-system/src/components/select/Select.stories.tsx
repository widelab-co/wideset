import { RiCalendarLine, RiFolderLine } from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { exampleStory } from '../../stories/example';
import { Avatar } from '../avatar/Avatar';
import { Button } from '../button/Button';
import PresetsExample from './examples/select/presets';
import presetsSource from './examples/select/presets?raw';
import SizesExample from './examples/select/sizes';
import sizesSource from './examples/select/sizes?raw';
import StatesExample from './examples/select/states';
import statesSource from './examples/select/states?raw';
import VariantsExample from './examples/select/variants';
import variantsSource from './examples/select/variants?raw';
import { Select } from './Select';
import type { SelectOptionType } from './Select.types';
import { SelectContent } from './SelectContent';
import { SelectOption as SelectOptionItem } from './SelectOption';
import { SelectSearch } from './SelectSearch';
import { SelectTrigger } from './SelectTrigger';

const sizes = ['sm', 'md', 'lg'] as const;

const sampleOptions: SelectOptionType[] = [
  { label: 'Poland', value: 'poland' },
  { label: 'USA', value: 'usa' },
  { label: 'Germany', value: 'germany' },
  { label: 'Canada', value: 'canada', disabled: true },
  { label: 'UK', value: 'uk', variant: 'danger' },
];

const meta = {
  title: 'Form/Select/Select',
  tags: ['autodocs'],
  component: Select,
  subcomponents: {
    'Select.Trigger': SelectTrigger,
    'Select.Content': SelectContent,
    'Select.Option': SelectOptionItem,
    'Select.Search': SelectSearch,
  },
  parameters: {
    docs: {
      description: {
        component: `Select lets users choose one value from a dropdown. Supports controlled and uncontrolled usage,
prefix elements, error states, and customizable styling.

Use MultiSelect for multiple values or ComboBox for custom typed values.

**Two usage modes:**

For most cases you can use simple:
\`\`\`
<Select options={[...]} />
\`\`\`

For full control over grouping and structure use primitives directly:
\`\`\`
<Select>                 — root, controls value/onValueChange/disabled
  <Select.Trigger>       — clickable trigger button
    <Select.Value>       — displays the selected value or placeholder
  </Select.Trigger>
  <Select.Content>       — dropdown panel
    <Select.Group>       — groups related options
      <Select.Label>     — group heading
      <Select.Option>    — individual option
    </Select.Group>
    <Select.Separator>   — visual divider between groups
  </Select.Content>
</Select>
\`\`\``,
      },
    },
    layout: 'centered',
  },
  argTypes: {
    clearSelectionAriaLabel: { table: { category: 'Content', type: { summary: 'string' } } },
    defaultMotion: { table: { category: 'Behavior', type: { summary: 'boolean' } } },
    preset: {
      control: 'radio',
      options: ['border', 'ghost'],
      table: {
        category: 'Appearance',
        type: { summary: 'border | ghost' },
        defaultValue: { summary: 'border' },
      },
    },
    variant: {
      control: 'radio',
      options: ['primary', 'danger'],
      table: {
        category: 'Appearance',
        type: { summary: 'primary | danger' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'radio',
      options: sizes,
      table: {
        category: 'Appearance',
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'md' },
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
    options: {
      control: 'object',
      table: {
        category: 'Content',
        type: {
          summary: '{ value: string; label: string; disabled?: boolean; prefix?: ReactNode }[]',
        },
      },
    },
    placeholder: {
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    disabled: {
      description: 'Disables the trigger and prevents opening the option list.',
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
    hasSearch: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
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
    value: {
      description:
        'Controlled value of the select. Must match one of the option values. Use with onValueChange for controlled component.',
      control: 'text',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
      },
    },
    defaultValue: {
      description:
        'Initial value for uncontrolled select. Sets the default selected option on first render.',
      control: 'text',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
      },
    },
    onValueChange: {
      description:
        'Callback fired when user selects an option. Receives the selected option value as parameter.',
      table: {
        category: 'Events',
        type: { summary: '(value: string) => void' },
      },
    },
    onClear: {
      table: {
        category: 'Events',
        type: { summary: '() => void' },
      },
    },
    onOpenChange: {
      description:
        'Callback fired when dropdown opens or closes. Receives boolean indicating open state.',
      table: {
        category: 'Events',
        type: { summary: '(open: boolean) => void' },
      },
    },
    children: {
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },
    open: {
      description:
        'Controlled open state of the dropdown. Use with `onOpenChange` to manage open/close externally.',
      control: false,
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
      },
    },
    defaultOpen: {
      description: 'Initial open state for uncontrolled usage.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      description: 'Marks the select as required in a form context.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Minimal select example with the default visual settings and active controls.',
      },
    },
  },
  render: (args) => <Select {...args} />,
  args: {
    options: sampleOptions,
    placeholder: 'Select',
    size: 'md',
    preset: 'border',
    variant: 'primary',
  },
};

export const Variants: Story = exampleStory(VariantsExample, variantsSource);

export const Presets: Story = exampleStory(PresetsExample, presetsSource);

export const Sizes: Story = exampleStory(SizesExample, sizesSource);

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Controlled mode: value is managed externally via `value` and `onValueChange`. The buttons demonstrate programmatic value changes.',
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
    const [value, setValue] = useState<string>(sampleOptions[0].value);
    return (
      <div className="gap-ws-5 flex flex-col">
        <Select
          {...args}
          value={value}
          onValueChange={(nextValue) => {
            setValue(nextValue);
            args.onValueChange?.(nextValue);
          }}
        />
        <div className="gap-ws-5 flex">
          <Button onClick={() => setValue('germany')} size="sm" preset="border" className="flex-1">
            Germany
          </Button>
          <Button onClick={() => setValue('poland')} size="sm" preset="border" className="flex-1">
            Poland
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
          'When `clearable` is true, an X button appears once a value is selected, allowing the user to reset the selection.',
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
    defaultValue: 'poland',
  },
};

const countryOptions: SelectOptionType[] = [
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
  'Latvia',
  'Lithuania',
  'Poland',
  'Portugal',
  'Spain',
  'Sweden',
].map((label) => ({ label, value: label.toLowerCase() }));

export const WithScroll: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A long list stops at 18rem and scrolls. Radix Select scrolls the list itself, so it keeps the native bar, drawn thin and trackless like ScrollArea’s (`wds-scrollbar`).',
      },
    },
  },
  args: { ...Default.args, options: countryOptions, placeholder: 'Country' },
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
    const [value, setValue] = useState<string>('');
    return (
      <Select
        {...args}
        options={[
          { label: 'Continue editing', value: 'continue' },
          { label: 'Archive draft', value: 'archive' },
          { label: 'Delete project', value: 'delete', variant: 'danger' },
        ]}
        value={value}
        onValueChange={(nextValue) => {
          setValue(nextValue);
          args.onValueChange?.(nextValue);
        }}
      />
    );
  },
};

export const OptionsWithPrefix: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Options support a `prefix` element — any ReactNode such as an icon, avatar, or text — shown inside the trigger once an option is selected.',
      },
    },
  },
  argTypes: {
    options: { table: { disable: true } },
  },
  args: Default.args,
  render: (args) => <Select {...args} options={prefixOptions} />,
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
  args: { ...Default.args, placeholder: 'Search and select', clearable: true, hasSearch: true },
};

export const WithComposedSearch: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `Select.Search` inside `Select.Content` for full control — the consumer owns the search state and filtering logic.',
      },
    },
  },
  argTypes: {
    options: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
  },
  args: Default.args,
  render: function Render(args) {
    const [query, setQuery] = useState('');

    const filtered = sampleOptions.filter((o) =>
      o.label.toLowerCase().includes(query.toLowerCase()),
    );

    return (
      <Select
        {...args}
        onOpenChange={(open) => {
          if (!open) setQuery('');
        }}
        clearable
      >
        <Select.Trigger size={args.size} preset={args.preset}>
          <Select.Value placeholder={args.placeholder} />
        </Select.Trigger>
        <Select.Content position="popper">
          <Select.Search
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
          />
          <Select.Separator className="-mx-ws-3 shrink-0" />
          {filtered.map((o) => (
            <Select.Option key={o.value} value={o.value}>
              {o.label}
            </Select.Option>
          ))}
        </Select.Content>
      </Select>
    );
  },
};

export const States: Story = exampleStory(StatesExample, statesSource);

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the primitive sub-components (`Select.Group`, `Select.Label`, `Select.Separator`) to build grouped options with section headings.',
      },
    },
  },
  argTypes: {
    options: { table: { disable: true } },
  },
  args: Default.args,
  render: function Render(args) {
    return (
      <Select {...args}>
        <Select.Trigger size={args.size} preset={args.preset}>
          <Select.Value placeholder={args.placeholder} />
        </Select.Trigger>
        <Select.Content position="popper">
          <Select.Group>
            <Select.Label>European Countries</Select.Label>
            <Select.Option value="poland">Poland</Select.Option>
            <Select.Option value="germany">Germany</Select.Option>
            <Select.Option value="uk">UK</Select.Option>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.Label>North American Countries</Select.Label>
            <Select.Option value="usa">USA</Select.Option>
            <Select.Option value="canada">Canada</Select.Option>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.Label>Asian Countries</Select.Label>
            <Select.Option value="japan">Japan</Select.Option>
            <Select.Option value="china">China</Select.Option>
            <Select.Option value="india">India</Select.Option>
          </Select.Group>
        </Select.Content>
      </Select>
    );
  },
};
