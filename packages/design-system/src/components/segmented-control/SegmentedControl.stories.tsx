import { RiUser3Line } from '@remixicon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import IconsExample from './examples/segmented-control/icons';
import iconsSource from './examples/segmented-control/icons?raw';
import SizesExample from './examples/segmented-control/sizes';
import sizesSource from './examples/segmented-control/sizes?raw';
import StatesExample from './examples/segmented-control/states';
import statesSource from './examples/segmented-control/states?raw';
import VariantsExample from './examples/segmented-control/variants';
import variantsSource from './examples/segmented-control/variants?raw';
import { SegmentedControl } from './SegmentedControl';
import type { SegmentedControlProps } from './SegmentedControl.types';

const sizes: NonNullable<SegmentedControlProps['size']>[] = ['sm', 'md', 'lg'];

const variants: NonNullable<SegmentedControlProps['variant']>[] = ['regular', 'fullWidth'];

const meta = {
  title: 'Components/Segmented Control',
  tags: ['autodocs'],
  component: SegmentedControl,
  subcomponents: {
    'SegmentedControl.Item': SegmentedControl.Item,
    'SegmentedControl.Icon': SegmentedControl.Icon,
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `SegmentedControl lets users pick one option from a compact horizontal group. Use it for mutually exclusive choices where switching has an immediate effect — for example view mode or filter. Prefer a radio group for longer lists or when options need more context.

**Composition:**
\`\`\`jsx
<SegmentedControl aria-label="View" defaultValue="a">
  <SegmentedControl.Item value="a">Label</SegmentedControl.Item>
  <SegmentedControl.Item value="b" icon={IconGrid} aria-label="Grid view" />
</SegmentedControl>
\`\`\``,
      },
    },
  },
  argTypes: {
    defaultMotion: { table: { category: 'Behavior', type: { summary: 'boolean' } } },
    variant: {
      control: 'radio',
      options: variants,
      table: {
        category: 'Appearance',
        type: { summary: "'regular' | 'fullWidth'" },
        defaultValue: { summary: "'regular'" },
      },
    },
    size: {
      control: 'radio',
      options: sizes,
      table: {
        category: 'Appearance',
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: "'md'" },
      },
    },
    children: {
      description: 'Segment items to render inside the group.',
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },
    'aria-label': {
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'string' },
      },
    },
    className: {
      description: 'Additional classes merged with the group root.',
      control: 'text',
      table: {
        category: 'Appearance',
        type: { summary: 'string' },
      },
    },
    disabled: {
      description: 'Prevents changing the selected segment.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    name: {
      description:
        'Form field name used to submit the selected segment value. Set it on the group, not on individual items.',
      control: 'text',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
      },
    },
    required: {
      description: 'Requires a selected segment before the containing form can be submitted.',
      control: 'boolean',
      table: {
        category: 'Behavior',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    defaultValue: {
      control: 'text',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
      },
    },
    value: {
      control: 'text',
      table: {
        category: 'Behavior',
        type: { summary: 'string' },
      },
    },
    onValueChange: {
      control: false,
      table: {
        category: 'Events',
        type: { summary: '(value: string) => void' },
      },
    },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Minimal working example with the default `regular`, `md` configuration and active controls.',
      },
    },
  },
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControl.Item value="option1">Label</SegmentedControl.Item>
      <SegmentedControl.Item value="option2">Label</SegmentedControl.Item>
    </SegmentedControl>
  ),
  args: {
    'aria-label': 'Options',
    variant: 'regular',
    size: 'md',
    defaultValue: 'option1',
    disabled: false,
  },
};

export const Variants: Story = exampleStory(VariantsExample, variantsSource);

export const Sizes: Story = exampleStory(SizesExample, sizesSource);

export const Icons: Story = exampleStory(IconsExample, iconsSource);

export const States: Story = exampleStory(StatesExample, statesSource);

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the `icon` prop on `SegmentedControl.Item` for icon-only items, or compose `SegmentedControl.Icon` as a child for icon + label combinations. An item whose only child is `SegmentedControl.Icon` is icon-only too and needs an `aria-label`.',
      },
    },
  },
  render: (args) => (
    <div className="gap-ws-8 flex flex-col items-start">
      <SegmentedControl {...args}>
        <SegmentedControl.Item value="option1" icon={RiUser3Line} aria-label="Person, option 1" />
        <SegmentedControl.Item value="option2" icon={RiUser3Line} aria-label="Person, option 2" />
      </SegmentedControl>
      <SegmentedControl {...args}>
        <SegmentedControl.Item value="option1">
          <SegmentedControl.Icon icon={RiUser3Line} />
          Label
        </SegmentedControl.Item>
        <SegmentedControl.Item value="option2">
          <SegmentedControl.Icon icon={RiUser3Line} />
          Label
        </SegmentedControl.Item>
      </SegmentedControl>
    </div>
  ),
  args: Default.args,
};
