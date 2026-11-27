import type { Meta, StoryObj } from '@storybook/react-vite';

import { exampleStory } from '../../stories/example';
import { Count } from './Count';
import ContainedExample from './examples/count/contained';
import containedSource from './examples/count/contained?raw';
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
By default it is a quiet grey number read together with the label before it, so it has no role of its own. \`contained\` draws it in an outlined pill, for a count beside an icon or on its own.

A state (Paid, Overdue) is a StatusBadge; a category (Design, Sales) is a Tag. Inside \`Tabs\`, use \`Tabs.Count\`, which renders a Count.`,
      },
    },
  },
  argTypes: {
    contained: {
      description:
        'Draws the count in an outlined pill. Use it where the count stands alone or beside an icon; beside a text label leave it off.',
      control: 'boolean',
      table: { category: 'Appearance', defaultValue: { summary: 'false' } },
    },
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

export const Contained: Story = exampleStory(ContainedExample, containedSource);

export const LongValues: Story = {
  render: () => (
    <div className="gap-ws-8 flex flex-col">
      {[false, true].map((contained) => (
        <div key={String(contained)} className="gap-ws-4 flex items-center">
          <Count contained={contained}>1</Count>
          <Count contained={contained}>42</Count>
          <Count contained={contained}>999</Count>
          <Count contained={contained}>99+</Count>
          <Count contained={contained}>1,284</Count>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Values never wrap; a contained pill grows sideways with longer values. Cap large numbers ("99+") so the label keeps its place.',
      },
    },
  },
};
