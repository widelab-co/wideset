import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import { Count } from './Count';
import InContextExample from './examples/count/in-context';
import inContextSource from './examples/count/in-context?raw';

const meta = {
  title: 'Components/Count',
  tags: ['autodocs'],
  component: Count,
  parameters: {
    docs: {
      description: {
        component: `Count shows how many items sit behind a label: a tab, a list group, a filter.
It is an outlined pill with quiet digits, read together with the label before it, so it has no role of its own.

A state (Paid, Overdue) is a StatusBadge; a category (Design, Sales) is a Tag. Inside \`Tabs\`, use \`Tabs.Count\`, which renders a Count.`,
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      table: { category: 'Appearance', type: { summary: 'string' } },
    },
  },
} satisfies Meta<typeof Count>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '12',
  },
};

export const InContext: Story = exampleStory(InContextExample, inContextSource);

export const LongValues: Story = {
  render: () => (
    <div className="gap-ws-4 flex items-center">
      <Count>1</Count>
      <Count>42</Count>
      <Count>999</Count>
      <Count>99+</Count>
      <Count>1,284</Count>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'One digit keeps the pill round (the minimum width equals the height); longer values grow sideways and never wrap. Cap large numbers ("99+") so the label keeps its place.',
      },
    },
  },
};
