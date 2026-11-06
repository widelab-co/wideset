import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import EmptyStateExample from './examples/illustration/empty-state';
import emptyStateSource from './examples/illustration/empty-state?raw';
import IllustrationsExample from './examples/illustration/illustrations';
import illustrationsSource from './examples/illustration/illustrations?raw';
import SizesExample from './examples/illustration/sizes';
import sizesSource from './examples/illustration/sizes?raw';
import { Illustration } from './Illustration';

const meta = {
  title: 'Components/Illustration',
  tags: ['autodocs'],
  component: Illustration,
  args: { illustration: 'computer' },
  parameters: {
    docs: {
      description: {
        component: `
A line drawing that gives an empty state, a first run or an announcement something to look at. Use it beside a short heading, one sentence and one action; never inside a view that has content, and never as an icon. Its lines follow the text colour and its accent the primary fill, so dark mode and a rebrand recolour it.
        `,
      },
    },
  },
  argTypes: {
    illustration: {
      options: ['calendar', 'computer', 'folder'],
      control: 'radio',
      table: { category: 'Content', type: { summary: "'calendar' | 'computer' | 'folder'" } },
    },
    size: {
      options: ['lg', 'sm'],
      control: 'radio',
      table: {
        category: 'Appearance',
        type: { summary: "'lg' | 'sm'" },
        defaultValue: { summary: "'lg'" },
      },
    },
    title: {
      control: 'text',
      table: { category: 'Content', type: { summary: 'string' } },
    },
    className: {
      control: 'text',
      description: 'Classes merged onto the svg: a text colour for the lines, or layout.',
      table: { category: 'Appearance', type: { summary: 'string' } },
    },
  },
} satisfies Meta<typeof Illustration>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { illustration: 'computer', size: 'lg' },
};

export const Illustrations: Story = exampleStory(IllustrationsExample, illustrationsSource);
export const Sizes: Story = exampleStory(SizesExample, sizesSource);
export const EmptyState: Story = exampleStory(EmptyStateExample, emptyStateSource);
