import { RiBugLine } from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import PresetsExample from './examples/icon-button/presets';
import presetsSource from './examples/icon-button/presets?raw';
import SizesExample from './examples/icon-button/sizes';
import sizesSource from './examples/icon-button/sizes?raw';
import StatesExample from './examples/icon-button/states';
import statesSource from './examples/icon-button/states?raw';
import VariantsExample from './examples/icon-button/variants';
import variantsSource from './examples/icon-button/variants?raw';
import { IconButton } from './IconButton';
import type { IconButtonProps } from './IconButton.types';

const variants: IconButtonProps['variant'][] = [
  'primary',
  'secondary',
  'danger',
  'success',
  'inverse',
];

const presets: IconButtonProps['preset'][] = ['filled', 'border', 'ghost'];

const sizes: IconButtonProps['size'][] = ['xs', 'sm', 'md', 'lg'];

const meta = {
  title: 'Components/Button/IconButton',
  tags: ['autodocs'],
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component: `IconButton is an icon-only action for compact toolbars, utility controls, and dense interfaces where a full text label would add unnecessary visual weight.
Provide either \`aria-label\` or \`aria-labelledby\`; an accessible name is required.

Use Button when a visible text label is needed, or LinkButton when the action navigates.`,
      },
    },
  },
  argTypes: {
    defaultMotion: {
      description:
        "Turns the component's built-in animations on or off. When omitted, inherits the value from the nearest `MotionProvider`.",
      control: 'boolean',
      table: { category: 'Behavior', type: { summary: 'boolean' } },
    },
    variant: {
      description: 'Visual variant that controls the semantic color treatment of the button.',
      options: variants,
      control: 'radio',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'primary' },
        type: { summary: "'primary' | 'secondary' | 'danger' | 'success' | 'inverse'" },
      },
    },
    preset: {
      description: 'Visual preset that controls emphasis through fill, border, and text treatment.',
      options: presets,
      control: 'radio',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'filled' },
        type: { summary: "'filled' | 'border' | 'ghost'" },
      },
    },
    size: {
      description: 'Size of the button affecting spacing and hit area.',
      options: sizes,
      control: 'radio',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'md' },
        type: { summary: "'xs' | 'sm' | 'md' | 'lg'" },
      },
    },
    className: {
      description: 'Additional CSS classes merged with the icon button root.',
      control: 'text',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
      },
    },
    iconClassName: {
      description: 'Additional CSS classes merged with the rendered icon.',
      control: 'text',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
      },
    },
    disabled: {
      description: 'Disables the icon button visually and functionally.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    type: {
      description: 'Native button type used for form behavior.',
      control: 'radio',
      options: ['button', 'submit', 'reset'],
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'button' },
        type: { summary: "'button' | 'submit' | 'reset'" },
      },
    },
    icon: {
      description: 'Icon rendered as the main visible content of the button.',
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'RemixiconComponentType' },
      },
    },
    asChild: {
      description:
        'Whether to render the icon button styling onto its child element via Radix Slot.',
      control: false,
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'false' },
        type: { summary: 'boolean' },
      },
    },
    'aria-label': {
      description: 'Accessible name announced by assistive technology for icon-only actions.',
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    'aria-labelledby': {
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    onClick: {
      description: 'Called when the user activates the icon button.',
      table: {
        category: 'Events',
        type: { summary: '(event: MouseEvent<HTMLButtonElement>) => void' },
      },
    },
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Minimal icon-only example with the default `primary`, `filled`, `md` configuration and an accessible label.',
      },
    },
  },
  render: (args) => <IconButton {...args} />,
  args: {
    icon: RiBugLine,
    'aria-label': 'Report issue',
    variant: 'primary',
    preset: 'filled',
    size: 'md',
    disabled: false,
    type: 'button',
    asChild: false,
  },
};

export const Variants: Story = {
  ...exampleStory(VariantsExample, variantsSource),
  args: { icon: RiBugLine, 'aria-label': 'Report issue' },
};

export const Presets: Story = {
  ...exampleStory(PresetsExample, presetsSource),
  args: { icon: RiBugLine, 'aria-label': 'Report issue' },
};

export const Sizes: Story = {
  ...exampleStory(SizesExample, sizesSource),
  args: { icon: RiBugLine, 'aria-label': 'Report issue' },
};

export const States: Story = {
  ...exampleStory(StatesExample, statesSource),
  args: { icon: RiBugLine, 'aria-label': 'Report issue' },
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Common usage patterns for icon-only actions: provide explicit accessible labels, use lower-emphasis styling in secondary toolbars, and switch to `asChild` when the control should behave like a link while keeping icon-button styling.',
      },
    },
  },
  argTypes: {
    className: { table: { disable: true } },
    iconClassName: { table: { disable: true } },
    asChild: { table: { disable: true } },
  },
  render: (args) => (
    <div className="gap-ws-12 flex flex-wrap items-center">
      <IconButton {...args} aria-label="Report issue" />
      <IconButton {...args} aria-label="Report issue in compact toolbar" preset="ghost" />
      <IconButton {...args} asChild aria-label="Open issue details">
        <a href="https://example.com" onClick={(event) => event.preventDefault()}>
          <span className="sr-only">Open issue details</span>
        </a>
      </IconButton>
    </div>
  ),
  args: {
    ...Default.args,
    variant: 'success',
    preset: 'border',
  },
};
