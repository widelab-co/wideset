import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { exampleStory } from '../../stories/example';
import { TextInput } from '../text-input/TextInput';
import LabelsExample from './examples/slider/labels';
import labelsSource from './examples/slider/labels?raw';
import StatesExample from './examples/slider/states';
import statesSource from './examples/slider/states?raw';
import TypesExample from './examples/slider/types';
import typesSource from './examples/slider/types?raw';
import { Slider } from './Slider';

const meta = {
  title: 'Components/Slider',
  tags: ['autodocs'],
  component: Slider,
  argTypes: {
    defaultMotion: { table: { category: 'Behavior', type: { summary: 'boolean' } } },
    type: {
      description: 'Deprecated: the slider draws one thumb per value.',
      control: 'radio',
      options: ['single', 'range'],
      table: {
        category: 'Appearance',
        type: { summary: "'single' | 'range'" },
      },
    },
    labels: {
      description: 'Deprecated: compose `Slider.Label` next to the slider.',
      control: 'select',
      options: [undefined, 'left', 'right', 'side', 'bottom'],
      table: {
        category: 'Appearance',
        type: { summary: "'left' | 'right' | 'side' | 'bottom'" },
        defaultValue: { summary: 'undefined' },
      },
    },
    min: {
      description: 'Minimum value',
      control: 'number',
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    max: {
      description: 'Maximum value',
      control: 'number',
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '100' },
      },
    },
    step: {
      description: 'Step increment',
      control: { type: 'number', min: 1, step: 1 },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    disabled: {
      description: 'Whether the slider is disabled',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showTooltipValue: {
      control: 'select',
      options: [undefined, true, false, 'top', 'right', 'bottom', 'left'],
      table: {
        category: 'Behavior',
        type: { summary: "boolean | 'top' | 'right' | 'bottom' | 'left'" },
        defaultValue: { summary: 'undefined' },
      },
    },
    defaultValue: {
      description: 'Initial value for uncontrolled usage. Array of numbers — one per thumb.',
      control: false,
      table: {
        category: 'Behavior',
        type: { summary: 'number[]' },
      },
    },
    value: {
      description:
        'Controlled value. Pass together with `onValueChange` to manage state externally.',
      control: false,
      table: {
        category: 'Behavior',
        type: { summary: 'number[]' },
      },
    },
    minStepsBetweenThumbs: {
      description: 'Minimum number of steps between thumbs (range slider only).',
      control: { type: 'number', min: 0, step: 1 },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    'aria-label': {
      control: 'text',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    thumbAriaLabels: {
      control: 'object',
      table: { category: 'Content', type: { summary: 'string[]' } },
    },
    onValueChange: {
      description: 'Called when the slider value changes.',
      table: {
        category: 'Events',
        type: { summary: '(value: number[]) => void' },
      },
    },
    onValueCommit: {
      description:
        'Fired when the user stops dragging (pointerup / keyup). Use for expensive side effects.',
      table: {
        category: 'Events',
        type: { summary: '(value: number[]) => void' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `Slider lets users choose a value or range along a track. It draws one thumb per value, so \`[40]\` is a single slider and \`[20, 80]\` a range, with an optional tooltip displaying the current value. Compose \`Slider.Label\` next to it to print the scale. Works in both controlled (\`value\` + \`onValueChange\`) and uncontrolled (\`defaultValue\`) modes.

Use TextInput when precise numeric entry matters more than adjustment along a scale.`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="text-ws-static-base gap-ws-20 flex w-96 flex-col">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: { docs: { description: { story: 'Minimal example with editable controls.' } } },
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    showTooltipValue: false,
    'aria-label': 'Volume',
  },
  render: (args) => <Slider {...args} />,
};

export const Types: Story = exampleStory(TypesExample, typesSource);

export const Labels: Story = exampleStory(LabelsExample, labelsSource);

export const TooltipPositions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'All tooltip position variants — interact with each slider to see the tooltip.',
      },
    },
  },
  argTypes: { showTooltipValue: { table: { category: 'Behavior' }, control: false } },
  render: (args) => (
    <>
      <div>
        <div className="typography-body-md pb-ws-4">Top (default)</div>
        <Slider {...args} showTooltipValue="top" />
      </div>
      <div>
        <div className="typography-body-md pb-ws-4">Right</div>
        <Slider {...args} showTooltipValue="right" />
      </div>
      <div>
        <div className="typography-body-md pb-ws-4">Bottom</div>
        <Slider {...args} showTooltipValue="bottom" />
      </div>
      <div>
        <div className="typography-body-md pb-ws-4">Left</div>
        <Slider {...args} showTooltipValue="left" />
      </div>
    </>
  ),
};

export const States: Story = exampleStory(StatesExample, statesSource);

export const Disabled: Story = {
  parameters: {
    docs: { description: { story: 'Disabled state for single and range variants.' } },
  },
  args: { ...Default.args, disabled: true },
  render: (args) => (
    <>
      <div>
        <div className="pb-ws-4">Single disabled</div>
        <Slider {...args} defaultValue={[50]} />
      </div>
      <div>
        <div className="pb-ws-4">Range disabled</div>
        <Slider {...args} defaultValue={[20, 70]} />
      </div>
    </>
  ),
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: { story: 'Controlled range slider synced with number inputs.' },
      source: {
        code: `
const min = 0;
const max = 100;
const [value, setValue] = useState([20, 80]);

const handleInputChange = (index: number, inputValue: number) => {
  const newValue = [...value];
  newValue[index] = Math.min(Math.max(inputValue, min), max);
  setValue(newValue);
};

return (
  <div className="flex flex-col gap-ws-9">
    <Slider aria-label="price" min={min} max={max} value={value} onValueChange={setValue} />
    <div className="flex items-center">
      <TextInput size="sm" className="flex-1">
        <TextInput.Input
          aria-label="Minimum value"
          type="number"
          min={min}
          max={value[1]}
          value={value[0]}
          onChange={(e) => handleInputChange(0, Number(e.target.value))}
        />
      </TextInput>
      <span className="bg-ws-static-alpha-strong mx-ws-3 h-ws-1 w-ws-5 shrink-0" />
      <TextInput size="sm" className="flex-1">
        <TextInput.Input
          aria-label="Maximum value"
          type="number"
          min={value[0]}
          max={max}
          value={value[1]}
          onChange={(e) => handleInputChange(1, Number(e.target.value))}
        />
      </TextInput>
    </div>
  </div>
);
        `.trim(),
      },
    },
  },
  args: { ...Default.args, 'aria-label': 'price' },
  argTypes: { value: { control: false } },
  render: function Render(args) {
    const { min = 0, max = 100 } = args;
    const [value, setValue] = useState([20, 80]);

    const handleInputChange = (index: number, inputValue: number) => {
      const newValue = [...value];
      newValue[index] = Math.min(Math.max(inputValue, min), max);
      setValue(newValue);
    };

    return (
      <div className="gap-ws-9 flex flex-col">
        <Slider
          {...args}
          value={value}
          onValueChange={(nextValue) => {
            setValue(nextValue);
            args.onValueChange?.(nextValue);
          }}
        />
        <div className="flex items-center">
          <TextInput size="sm" className="flex-1">
            <TextInput.Input
              aria-label="Minimum value"
              type="number"
              min={min}
              max={value[1]}
              value={value[0]}
              onChange={(e) => handleInputChange(0, Number(e.target.value))}
            />
          </TextInput>
          <span className="bg-ws-static-alpha-strong mx-ws-3 h-ws-1 w-ws-5 shrink-0" />
          <TextInput size="sm" className="flex-1">
            <TextInput.Input
              aria-label="Maximum value"
              type="number"
              min={value[0]}
              max={max}
              value={value[1]}
              onChange={(e) => handleInputChange(1, Number(e.target.value))}
            />
          </TextInput>
        </div>
      </div>
    );
  },
};
