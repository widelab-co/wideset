import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import { Checkbox } from './Checkbox';
import { CheckboxGroup } from './CheckboxGroup';
import OrientationExample from './examples/checkbox-group/orientation';
import orientationSource from './examples/checkbox-group/orientation?raw';

const meta = {
  title: 'Components/Checkbox/CheckboxGroup',
  tags: ['autodocs'],
  component: CheckboxGroup,
  parameters: {
    docs: {
      description: {
        component: `CheckboxGroup is a layout wrapper that arranges multiple Checkbox elements in a vertical or horizontal list with consistent spacing.

Use RadioButton.Group when only one option may be selected.`,
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      table: {
        category: 'Appearance',
        type: { summary: "'vertical' | 'horizontal'" },
        defaultValue: { summary: "'vertical'" },
      },
    },
    children: {
      description: 'The `Checkbox` elements to group.',
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Vertical layout — the default orientation. Each checkbox stacks below the previous.',
      },
    },
  },
  render: (args) => (
    <Checkbox.Group aria-label="Options" {...args}>
      <Checkbox label="Option 1" description="Description of option 1" />
      <Checkbox label="Option 2" description="Description of option 2" />
      <Checkbox label="Option 3" description="Description of option 3" />
    </Checkbox.Group>
  ),
  args: {
    orientation: 'vertical',
  },
};

export const Orientation: Story = exampleStory(OrientationExample, orientationSource);

export const Horizontal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Horizontal layout — use when options are short and should appear side by side in a single row.',
      },
    },
  },
  render: (args) => (
    <CheckboxGroup aria-label="Options" {...args}>
      <Checkbox label="Option 1" />
      <Checkbox label="Option 2" />
      <Checkbox label="Option 3" />
    </CheckboxGroup>
  ),
  args: {
    ...Default.args,
    orientation: 'horizontal',
  },
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Mix of checkbox states inside a group — shows disabled, danger, indeterminate, and default checkboxes using the `Checkbox.Label` and `Checkbox.Description` composition pattern.',
      },
    },
  },
  render: (args) => (
    <CheckboxGroup aria-label="Options" {...args}>
      <Checkbox id="checkbox-comp-1" disabled>
        <Checkbox.Label htmlFor="checkbox-comp-1">Checkbox 1 (disabled)</Checkbox.Label>
        <Checkbox.Description>This checkbox is disabled</Checkbox.Description>
      </Checkbox>
      <Checkbox id="checkbox-comp-2" variant="danger" defaultChecked>
        <Checkbox.Label htmlFor="checkbox-comp-2">Checkbox 2 (danger)</Checkbox.Label>
        <Checkbox.Description>This checkbox uses the danger variant</Checkbox.Description>
      </Checkbox>
      <Checkbox id="checkbox-comp-3" checked="indeterminate">
        <Checkbox.Label htmlFor="checkbox-comp-3">Checkbox 3 (indeterminate)</Checkbox.Label>
        <Checkbox.Description>This checkbox is in indeterminate state</Checkbox.Description>
      </Checkbox>
      <Checkbox id="checkbox-comp-4">
        <Checkbox.Label htmlFor="checkbox-comp-4">Checkbox 4</Checkbox.Label>
        <Checkbox.Description>This checkbox is available</Checkbox.Description>
      </Checkbox>
    </CheckboxGroup>
  ),
  args: Default.args,
};
