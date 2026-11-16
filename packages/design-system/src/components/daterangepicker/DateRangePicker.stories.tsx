import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import { FormField } from '../form-field/FormField';
import { DateRangePicker } from './DateRangePicker';
import type { DateRangePickerProps } from './DateRangePicker.types';
import DatePresetsExample from './examples/date-range-picker/date-presets';
import datePresetsSource from './examples/date-range-picker/date-presets?raw';
import PresetsExample from './examples/date-range-picker/presets';
import presetsSource from './examples/date-range-picker/presets?raw';
import SizesExample from './examples/date-range-picker/sizes';
import sizesSource from './examples/date-range-picker/sizes?raw';
import StatesExample from './examples/date-range-picker/states';
import statesSource from './examples/date-range-picker/states?raw';
import VariantsExample from './examples/date-range-picker/variants';
import variantsSource from './examples/date-range-picker/variants?raw';

type Story = StoryObj<typeof meta>;

const dateFormats = ['MM/dd/yy', 'dd.MM.yyyy', 'MMM d, yyyy'];

const exampleRange = { from: '2025-08-17', to: '2025-08-22' };

const meta = {
  title: 'Components/DateRangePicker',
  tags: ['autodocs'],
  component: DateRangePicker,
  parameters: {
    docs: {
      description: {
        component: `
DateRangePicker is a two-date input that pairs a text-style trigger with a calendar popover and an optional preset side panel.
Use it when the user needs to pick a span of dates — reporting filters, analytics windows, booking flows. Reach for \`DatePicker\` instead when only a single date is required.

This component uses [\`react-day-picker\`](https://daypicker.dev/) and extends its \`PropsBase\` / \`PropsRange\` interfaces. See the [official documentation](https://daypicker.dev/) for the full reference.
        `,
      },
    },
  },
  argTypes: {
    defaultMotion: { table: { category: 'Behavior', type: { summary: 'boolean' } } },
    presetLabels: { table: { category: 'Content', type: { summary: 'Partial' } } },
    size: {
      description: 'Size of the trigger affecting spacing and typography.',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    preset: {
      description: 'Visual preset of the trigger.',
      control: 'radio',
      options: ['border', 'ghost'],
      table: {
        category: 'Appearance',
        type: { summary: "'border' | 'ghost'" },
        defaultValue: { summary: 'border' },
      },
    },
    variant: {
      description: 'Color variant communicating intent or validation state.',
      control: 'radio',
      options: ['primary', 'danger'],
      table: {
        category: 'Appearance',
        type: { summary: "'primary' | 'danger'" },
        defaultValue: { summary: 'primary' },
      },
    },
    placeholder: {
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: "'Select date range'" },
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
    showDatePresets: {
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    dateFormat: {
      control: 'text',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: "'MM/dd/yy'" },
      },
    },
    weekStartsOn: {
      description: 'Day the week starts on (0 = Sunday, 1 = Monday, …).',
      control: { type: 'number', min: 0, max: 6 },
      table: {
        category: 'Behavior',
        type: { summary: '0 | 1 | 2 | 3 | 4 | 5 | 6' },
        defaultValue: { summary: '1' },
      },
    },
    today: {
      description:
        'The date the calendar marks as today and the presets count from. Defaults to the current date.',
      control: false,
      table: { category: 'Behavior', type: { summary: 'Date' } },
    },
    numberOfMonths: {
      description: 'Number of months rendered side by side in the calendar. Defaults to `1`.',
      control: { type: 'number', min: 1, max: 3 },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    className: {
      control: 'text',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
      },
    },
    disabledDates: {
      control: 'object',
      table: {
        category: 'Behavior',
        type: { summary: 'Matcher | Matcher[]' },
      },
    },
    defaultSelected: {
      description:
        'Initial range for uncontrolled usage. Mutually exclusive with defaultDatePreset.',
      table: {
        category: 'Content',
        type: { summary: 'DateRangeValue' },
      },
    },
    defaultDatePreset: {
      description:
        'Initial preset for uncontrolled usage. Mutually exclusive with defaultSelected.',
      table: {
        category: 'Content',
        type: { summary: 'DateRangePreset' },
      },
    },
    onSelect: {
      table: {
        category: 'Events',
        type: { summary: '(range?: DateRangeValue, preset?: DateRangePreset) => void' },
      },
    },
    selected: {
      control: false,
      table: { category: 'Content', type: { summary: 'DateRangeValue' } },
    },
    activeDatePreset: {
      control: false,
      table: { category: 'Content', type: { summary: 'DateRangePreset' } },
    },
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default DateRangePicker with the preset side panel visible and controls active. Use this story to explore size, preset, variant, and behavior props in isolation.',
      },
    },
  },
  render: (args: DateRangePickerProps) => <DateRangePicker className="w-72" {...args} />,
  args: {
    size: 'md',
    preset: 'border',
    variant: 'primary',
    placeholder: 'Select date range',
    disabled: false,
    showDatePresets: true,
    weekStartsOn: 1,
  },
};

export const Variants: Story = exampleStory(VariantsExample, variantsSource);

export const Presets: Story = exampleStory(PresetsExample, presetsSource);

export const Sizes: Story = exampleStory(SizesExample, sizesSource);

export const DatePresets: Story = exampleStory(DatePresetsExample, datePresetsSource);

export const DateFormat: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Control how the selected range is rendered in the trigger with `dateFormat`, applied to both ends of the range. It only affects the trigger label — `onSelect` always receives ISO `yyyy-MM-dd` strings. Defaults to `MM/dd/yy`.',
      },
    },
  },
  argTypes: {
    dateFormat: { table: { disable: true } },
  },
  render: (args) => (
    <div className="gap-ws-4 flex flex-col">
      {dateFormats.map((dateFormat) => (
        <DateRangePicker
          key={dateFormat}
          {...({ ...args, defaultSelected: exampleRange, dateFormat } as DateRangePickerProps)}
          className="w-72"
        />
      ))}
    </div>
  ),
  args: Default.args,
};

export const DisabledDates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Mark days as unselectable with `disabledDates`, which accepts a react-day-picker [Matcher](https://daypicker.dev/api/type-aliases/Matcher) (or an array of them). This example blocks weekends via `{ dayOfWeek: [0, 6] }`; other common matchers are `{ before: date }`, `{ after: date }`, and `{ from, to }` ranges. Open the calendar to see the blocked days.',
      },
    },
  },
  render: (args) => (
    <DateRangePicker
      {...({
        ...args,
        defaultSelected: { from: '2025-08-18', to: '2025-08-21' },
      } as DateRangePickerProps)}
      className="w-72"
    />
  ),
  args: {
    ...Default.args,
    disabledDates: { dayOfWeek: [0, 6] },
  },
};

export const States: Story = exampleStory(StatesExample, statesSource);

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Renders two months side by side via `numberOfMonths={2}`. Use in wider layouts where seeing the start and end months at once makes range selection faster.',
      },
    },
  },
  render: (args: DateRangePickerProps) => (
    <FormField
      label="Travel dates"
      htmlFor="travel-dates"
      helperText="Select your departure and return dates."
      helperTextId="travel-help"
    >
      <DateRangePicker
        className="w-72"
        {...args}
        id="travel-dates"
        aria-describedby="travel-help"
      />
    </FormField>
  ),
  args: {
    ...Default.args,
    numberOfMonths: 2,
  },
};
