import { RiAddLine, RiCheckLine } from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import { Chip } from './Chip';
import type { ChipProps } from './Chip.types';
import IconsExample from './examples/chip/icons';
import iconsSource from './examples/chip/icons?raw';
import SizesExample from './examples/chip/sizes';
import sizesSource from './examples/chip/sizes?raw';
import StatesExample from './examples/chip/states';
import statesSource from './examples/chip/states?raw';
import StylesExample from './examples/chip/styles';
import stylesSource from './examples/chip/styles?raw';
import VariantsExample from './examples/chip/variants';
import variantsSource from './examples/chip/variants?raw';

const variants: ChipProps['variant'][] = ['primary', 'secondary'];

const styles: ChipProps['style'][] = ['filled', 'border'];

const sizes: ChipProps['size'][] = ['sm', 'md', 'lg'];

const meta = {
  title: 'Components/Chip',
  tags: ['autodocs'],
  component: Chip,
  subcomponents: {
    'Chip.Action': Chip.Action,
    'Chip.Icon': Chip.Icon,
    'Chip.IconButton': Chip.IconButton,
    'Chip.Label': Chip.Label,
  },
  parameters: {
    docs: {
      description: {
        component: `Chip groups a compact label with an optional main action and removal button.
Use it when users need to scan or toggle a short piece of metadata, or dismiss a selected value.
Do not use it for long text. Use Button for primary or more prominent actions.

**Optional composition:**
- \`Chip\` is a passive container controlling size, variant, style, and disabled state.
- \`Chip.Action\` is the optional main button; place the icon and label inside it.
- \`Chip.Icon\` is a decorative leading icon.
- \`Chip.Label\` holds the text, inside Action or directly inside Chip.
- \`Chip.IconButton\` is an optional sibling removal button with its own accessible name.

Use Tag for descriptive labels and StatusBadge for non-interactive status.`,
      },
    },
  },
  argTypes: {
    defaultMotion: { table: { category: 'Behavior', type: { summary: 'boolean' } } },
    variant: {
      description: 'Visual style of the chip',
      control: 'radio',
      options: variants,
      table: {
        category: 'Appearance',
        type: { summary: "'primary' | 'secondary'" },
        defaultValue: { summary: 'primary' },
      },
    },
    style: {
      description: 'Visual preset style of the chip',
      control: 'radio',
      options: styles,
      table: {
        category: 'Appearance',
        type: { summary: "'filled' | 'border'" },
        defaultValue: { summary: 'filled' },
      },
    },
    size: {
      description: 'Size of the chip affecting spacing and typography',
      control: 'radio',
      options: sizes,
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    children: {
      description: 'Chip content',
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string | ReactNode' },
      },
    },
    className: {
      description: 'Additional CSS classes merged with the chip root',
      control: 'text',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
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
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Full chip composition with a leading icon, main action, label, and independent removal button.',
      },
    },
  },
  render: ({ children, ...args }) => (
    <Chip {...args}>
      <Chip.Action>
        <Chip.Icon icon={RiAddLine} />
        <Chip.Label>{children}</Chip.Label>
      </Chip.Action>
      <Chip.IconButton aria-label="Remove chip" />
    </Chip>
  ),
  args: {
    children: 'Label',
    variant: 'primary',
    style: 'filled',
    size: 'md',
    disabled: false,
  },
};

export const Variants: Story = exampleStory(VariantsExample, variantsSource);

export const Styles: Story = exampleStory(StylesExample, stylesSource);

export const Sizes: Story = exampleStory(SizesExample, sizesSource);

export const Icons: Story = exampleStory(IconsExample, iconsSource);

export const States: Story = exampleStory(StatesExample, statesSource);

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The main action and removal button are independent. Omit Action for a passive label with removal, or omit IconButton for a single main action.',
      },
    },
  },
  argTypes: {
    variant: { table: { disable: true } },
    style: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  render: (args) => (
    <div className="gap-ws-12 flex flex-wrap">
      <Chip {...args} variant="primary" style="filled">
        <Chip.Action>
          <Chip.Icon icon={RiCheckLine} />
          <Chip.Label>Active filter</Chip.Label>
        </Chip.Action>
        <Chip.IconButton aria-label="Remove active filter" />
      </Chip>
      <Chip {...args} variant="secondary" style="border">
        <Chip.Action>
          <Chip.Icon icon={RiCheckLine} />
          <Chip.Label>Saved view</Chip.Label>
        </Chip.Action>
      </Chip>
      <Chip {...args} variant="secondary" style="filled">
        <Chip.Label>Team access</Chip.Label>
        <Chip.IconButton aria-label="Remove team access" />
      </Chip>
    </div>
  ),
  args: Default.args,
};
