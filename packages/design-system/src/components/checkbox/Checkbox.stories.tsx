import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { exampleStory } from '../../stories/example';
import { Button } from '../button/Button';
import { Checkbox } from './Checkbox';
import type { CheckboxProps } from './Checkbox.types';
import { CheckboxLabel } from './CheckboxLabel';
import LabelsExample from './examples/checkbox/labels';
import labelsSource from './examples/checkbox/labels?raw';
import SizesExample from './examples/checkbox/sizes';
import sizesSource from './examples/checkbox/sizes?raw';
import StatesExample from './examples/checkbox/states';
import statesSource from './examples/checkbox/states?raw';
import VariantsExample from './examples/checkbox/variants';
import variantsSource from './examples/checkbox/variants?raw';

const variants: NonNullable<CheckboxProps['variant']>[] = ['primary', 'danger'];

const sizes: NonNullable<CheckboxProps['size']>[] = ['lg', 'sm'];

const meta = {
  title: 'Components/Checkbox/Checkbox',
  tags: ['autodocs'],
  component: Checkbox,
  subcomponents: {
    'Checkbox.Label': CheckboxLabel,
  },
  parameters: {
    docs: {
      description: {
        component: `Checkbox allows users to select one or more items from a set. Supports controlled and uncontrolled modes, two sizes, two variants, and an indeterminate state. Use \`Checkbox.Label\` and \`Checkbox.Description\` for composable labelling.

Use RadioButton for mutually exclusive options and Switch for settings applied immediately.`,
      },
    },
  },
  argTypes: {
    defaultMotion: {
      control: 'boolean',
      description:
        "Turns the component's built-in animations on or off. When omitted, inherits the value from the nearest `MotionProvider`.",
      table: { category: 'Behavior', type: { summary: 'boolean' } },
    },
    size: {
      control: 'radio',
      options: sizes,
      description: 'Size of the checkbox affecting the hit area and icon dimensions.',
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'lg'" },
        defaultValue: { summary: "'lg'" },
      },
    },
    variant: {
      control: 'radio',
      options: variants,
      description: 'Visual variant — controls the color scheme and semantic meaning.',
      table: {
        category: 'Appearance',
        type: { summary: "'primary' | 'danger'" },
        defaultValue: { summary: "'primary'" },
      },
    },
    label: {
      description: 'Shorthand label, mutually exclusive with composed children.',
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    description: {
      description: 'Supporting text for the shorthand label. Unavailable with composed children.',
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    children: {
      description:
        'Composed label and description. Use instead of the shorthand label and description.',
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },
    disabled: {
      description: 'Disables the checkbox visually and functionally.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    checked: {
      description:
        'Controlled checked state. Use together with `onCheckedChange`. Pass `"indeterminate"` to show the dash indicator.',
      control: 'radio',
      options: [false, true, 'indeterminate'],
      table: {
        category: 'Behavior',
        type: { summary: "boolean | 'indeterminate'" },
        defaultValue: { summary: 'false' },
      },
    },
    defaultChecked: {
      description:
        'Initial checked state for uncontrolled usage. Ignored when `checked` is provided.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      description: 'Marks the checkbox as required in a form context.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    name: {
      description: 'Form field name submitted with the owning form as part of a name/value pair.',
      control: 'text',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    value: {
      description: 'Value submitted with the form when the checkbox is checked.',
      control: 'text',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
        defaultValue: { summary: "'on'" },
      },
    },
    onCheckedChange: {
      description: 'Fired when the checked state changes.',
      table: {
        category: 'Events',
        type: { summary: '(value: boolean | "indeterminate") => void' },
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Minimal working example with default `primary`, `lg` configuration and active controls.',
      },
    },
  },
  render: (args) => <Checkbox {...args} />,
  args: {
    size: 'lg',
    variant: 'primary',
    disabled: false,
    defaultChecked: false,
    required: false,
  },
};

export const Variants: Story = exampleStory(VariantsExample, variantsSource);

export const Sizes: Story = exampleStory(SizesExample, sizesSource);

export const Labels: Story = exampleStory(LabelsExample, labelsSource);

export const Controlled: Story = {
  argTypes: { checked: { control: false } },
  parameters: {
    docs: {
      description: {
        story:
          'Provide `checked` and `onCheckedChange` to take full control of the checked state from a parent component.',
      },
      source: {
        code: `
const [checked, setChecked] = useState<boolean | 'indeterminate'>(false);

<Checkbox
  label="Label"
  description="This is description"
  checked={checked}
  onCheckedChange={setChecked}
/>
        `.trim(),
      },
    },
  },
  render: function Render(args) {
    const [checked, setChecked] = useState<boolean | 'indeterminate'>(false);

    return (
      <div className="gap-ws-8 flex flex-row items-center justify-between">
        <Checkbox
          size={args.size}
          variant={args.variant}
          disabled={args.disabled}
          required={args.required}
          className={args.className}
          label="Label"
          description="This is description"
          checked={checked}
          onCheckedChange={(nextValue) => {
            setChecked(nextValue);
            args.onCheckedChange?.(nextValue);
          }}
        />
        <Button onClick={() => setChecked((checked) => !checked)}>Toggle</Button>
      </div>
    );
  },
};

export const States: Story = exampleStory(StatesExample, statesSource);

export const Composition: Story = {
  argTypes: {
    label: { table: { category: 'Content' }, control: false },
    description: { table: { category: 'Content' }, control: false },
    children: { table: { category: 'Content' }, control: false },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `Checkbox.Label` and `Checkbox.Description` as children for full control over label markup and styling. `Checkbox.Label` picks up `htmlFor` from context (`id` from `Checkbox` or an internal id). Pass `id` on `Checkbox` and `htmlFor` on `Checkbox.Label` only when you need stable ids (forms, tests, or external labels).',
      },
      source: {
        code: `
<Checkbox>
  <Checkbox.Label>Label</Checkbox.Label>
  <Checkbox.Description>This is description</Checkbox.Description>
</Checkbox>
        `.trim(),
      },
    },
  },
  render: ({ size, variant, disabled, defaultChecked, required }) => (
    <Checkbox
      size={size}
      variant={variant}
      disabled={disabled}
      defaultChecked={defaultChecked}
      required={required}
    >
      <Checkbox.Label>Label</Checkbox.Label>
      <Checkbox.Description>This is description</Checkbox.Description>
    </Checkbox>
  ),
  args: Default.args,
};
