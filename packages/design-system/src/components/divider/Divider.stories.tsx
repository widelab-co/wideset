import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import { Divider } from './Divider';
import EmphasisExample from './examples/divider/emphasis';
import emphasisSource from './examples/divider/emphasis?raw';
import LineStylesExample from './examples/divider/line-styles';
import lineStylesSource from './examples/divider/line-styles?raw';
import TextAlignExample from './examples/divider/text-align';
import textAlignSource from './examples/divider/text-align?raw';
import WeightsExample from './examples/divider/weights';
import weightsSource from './examples/divider/weights?raw';

const styles = ['solid', 'dashed'] as const;
const weights = ['thin', 'default', 'bold'] as const;
const emphasises = ['subtle', 'base', 'strong'] as const;

const meta = {
  title: 'Components/Divider',
  tags: ['autodocs'],
  component: Divider,
  parameters: {
    docs: {
      description: {
        component: `
A horizontal rule used to visually separate content sections. Supports an optional label text, line styles via \`lineStyle\` (\`solid\`, \`dashed\`), thickness levels (\`thin\`, \`default\`, \`bold\`), and emphasis levels (\`subtle\`, \`base\`, \`strong\`). When a label is provided it can be aligned left, center, or right; long text is truncated with an ellipsis.
        `,
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes applied to the root element.',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      },
    },
    text: {
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string | undefined' },
      },
    },
    lineStyle: {
      options: styles,
      control: 'radio',
      table: {
        category: 'Appearance',
        type: { summary: "'solid' | 'dashed'" },
        defaultValue: { summary: "'solid'" },
      },
    },
    emphasis: {
      options: emphasises,
      control: 'radio',
      description: 'Color emphasis of the divider line.',
      table: {
        category: 'Appearance',
        type: { summary: "'subtle' | 'base' | 'strong'" },
        defaultValue: { summary: "'base'" },
      },
    },
    weight: {
      options: weights,
      control: 'radio',
      description: 'Thickness of the divider line.',
      table: {
        category: 'Appearance',
        type: { summary: "'thin' | 'default' | 'bold'" },
        defaultValue: { summary: "'default'" },
      },
    },
    textAlign: {
      options: ['left', 'center', 'right'],
      control: 'radio',
      table: {
        category: 'Appearance',
        type: { summary: "'left' | 'center' | 'right'" },
        defaultValue: { summary: "'center'" },
      },
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Basic divider with default styling.',
      },
    },
  },
  render: (args) => <Divider {...args} />,
  args: {
    lineStyle: 'solid',
    emphasis: 'base',
    textAlign: 'center',
    weight: 'default',
    text: 'Divider',
  },
};

export const LineStyles: Story = exampleStory(LineStylesExample, lineStylesSource);

export const Weights: Story = exampleStory(WeightsExample, weightsSource);

export const Emphasis: Story = exampleStory(EmphasisExample, emphasisSource);

export const TextAlign: Story = exampleStory(TextAlignExample, textAlignSource);

export const Styles: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Solid and dashed line styles.',
      },
    },
  },
  argTypes: {
    lineStyle: { table: { disable: true } },
    text: { table: { disable: true } },
  },
  render: (args) => (
    <div className="gap-ws-16 flex flex-col overflow-y-auto">
      <Divider {...args} lineStyle="solid" text="Solid" />
      <Divider {...args} lineStyle="dashed" text="Dashed" />
    </div>
  ),
  args: Default.args,
};

export const Alignments: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The label text can be positioned at the left, center, or right of the line.',
      },
    },
  },
  argTypes: {
    textAlign: { table: { disable: true } },
    text: { table: { disable: true } },
  },
  render: (args) => (
    <div className="gap-ws-16 flex flex-col overflow-y-auto">
      <Divider {...args} text={undefined} />
      <Divider {...args} textAlign="left" text="Left" />
      <Divider {...args} textAlign="center" text="Center" />
      <Divider {...args} textAlign="right" text="Right" />
    </div>
  ),
  args: Default.args,
};

export const TruncatedText: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Long text is truncated with an ellipsis across all alignments.',
      },
    },
  },
  argTypes: {
    textAlign: { table: { disable: true } },
    text: { table: { disable: true } },
  },
  render: (args) => (
    <div className="gap-ws-16 flex flex-col">
      <Divider {...args} textAlign="left" />
      <Divider {...args} textAlign="center" />
      <Divider {...args} textAlign="right" />
    </div>
  ),
  args: {
    ...Default.args,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
};
