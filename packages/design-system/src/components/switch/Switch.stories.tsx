import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';

import { exampleStory } from '../../stories/example';
import { Button } from '../button/Button';
import LabelPositionExample from './examples/switch/label-position';
import labelPositionSource from './examples/switch/label-position?raw';
import SizesExample from './examples/switch/sizes';
import sizesSource from './examples/switch/sizes?raw';
import StatesExample from './examples/switch/states';
import statesSource from './examples/switch/states?raw';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  tags: ['autodocs'],
  component: Switch,
  parameters: {
    docs: {
      description: {
        component: `Switch is a binary toggle control — use it for settings that take immediate effect without a confirmation step.

Pass a string to \`label\` for a simple inline label. Use \`Switch.Label\` and \`Switch.Description\` as children when the label needs richer content or supporting text.

Use Checkbox for selections submitted with a form.

**Composition:**
\`\`\`
<Switch>           — root, controls checked/disabled/size/label/labelPosition
  <Switch.Label>         — alternative to the label prop for rich label content
  <Switch.Description>   — supporting text under the label
</Switch>
\`\`\`

> **Note:** \`label\` and \`children\` are mutually exclusive, and the types reject passing both. Use \`label\` for a plain string; use \`Switch.Label\` as a child when you need richer content. \`className\`, \`ref\` and the remaining props all land on the switch control.`,
      },
    },
  },
  argTypes: {
    defaultMotion: { table: { category: 'Behavior', type: { summary: 'boolean' } } },
    size: {
      description: 'Size of the switch',
      options: ['sm', 'lg'],
      control: 'radio',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'lg' },
        type: { summary: "'sm' | 'lg'" },
      },
    },
    labelPosition: {
      options: ['left', 'right'],
      control: 'radio',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'right' },
        type: { summary: "'left' | 'right'" },
      },
    },
    wrapperClassName: {
      control: 'text',
      table: { category: 'Appearance', type: { summary: 'string' } },
    },
    label: {
      description: 'Shorthand label, mutually exclusive with composed children.',
      control: 'text',
      table: {
        category: 'Content',
        defaultValue: { summary: 'undefined' },
        type: { summary: 'string' },
      },
    },
    disabled: {
      description: 'When true, the switch is disabled.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    checked: {
      description:
        'The controlled checked state of the switch. Must be used in conjunction with onCheckedChange',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onCheckedChange: {
      description: 'Event handler called when the checked state of the switch changes.',
      table: {
        category: 'Events',
        type: { summary: '(value: boolean) => void' },
      },
    },
    defaultChecked: {
      description: 'When true, the switch is checked by default.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    required: {
      description: 'Whether the switch is required',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    name: {
      description:
        'The name of the switch. Submitted with its owning form as part of a name/value pair',
      control: 'text',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    value: {
      description: 'The value given as data when submitted with a name',
      control: 'text',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
        defaultValue: { summary: "'on'" },
      },
    },
    children: {
      description: 'Composed label and description. Use instead of the shorthand label.',
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'string | React.ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic switch with a text label and default size (`lg`) and label position (`right`).',
      },
    },
  },
  render: (args) => <Switch {...args} />,
  args: {
    size: 'lg',
    label: 'Label',
    labelPosition: 'right',
  },
};

export const Sizes: Story = exampleStory(SizesExample, sizesSource);

export const LabelPosition: Story = exampleStory(LabelPositionExample, labelPositionSource);

export const LabelAlignments: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `labelPosition` prop controls whether the label appears to the `left` or `right` of the switch.',
      },
    },
  },
  argTypes: {
    labelPosition: { table: { disable: true } },
    label: { table: { disable: true } },
  },
  render: ({ label: _label, labelPosition: _labelPosition, children: _children, ...args }) => (
    <div className="gap-ws-8 flex flex-col items-start">
      <Switch {...args} label="Label left" labelPosition="left" />
      <Switch {...args} label="Label right" labelPosition="right" />
    </div>
  ),
  args: Default.args,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Controlled mode — the checked state lives outside the component and is passed in via `checked` and `onCheckedChange`. The button demonstrates external control: its label reflects the current state and can drive the switch from outside.',
      },
      source: {
        code: `function ControlledSwitchExample() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col items-start gap-ws-8">
      <Switch
        label="Label"
        labelPosition="right"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Button preset="border" size="md" onClick={() => setChecked((prev) => !prev)}>
         Toggle {checked ? 'off' : 'on'}
      </Button>
    </div>
  );
}`,
      },
    },
  },
  argTypes: {
    checked: { table: { disable: true } },
    onCheckedChange: { table: { disable: true } },
    defaultChecked: { table: { disable: true } },
  },
  render: function ControlledSwitch(args) {
    const [checked, setChecked] = React.useState(false);
    return (
      <div className="gap-ws-8 flex flex-col items-start">
        <Switch
          {...args}
          checked={checked}
          onCheckedChange={(nextValue) => {
            setChecked(nextValue);
            args.onCheckedChange?.(nextValue);
          }}
        />
        <Button preset="border" size="md" onClick={() => setChecked((prev) => !prev)}>
          Toggle {checked ? 'off' : 'on'}
        </Button>
      </div>
    );
  },
  args: Default.args,
};

export const States: Story = exampleStory(StatesExample, statesSource);

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `Switch.Label` and `Switch.Description` as children instead of the `label` prop when you need richer label content or supporting text.',
      },
    },
  },
  argTypes: {
    label: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  render: ({ label: _label, children: _children, ...args }) => (
    <Switch {...args}>
      <Switch.Label>Email notifications</Switch.Label>
      <Switch.Description>One summary a day, at 9:00.</Switch.Description>
    </Switch>
  ),
  args: Default.args,
};
