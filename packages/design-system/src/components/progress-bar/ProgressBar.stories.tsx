import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

import { exampleStory } from '../../stories/example';
import CompositionExample from './examples/progress-bar/composition';
import compositionSource from './examples/progress-bar/composition?raw';
import StatusesExample from './examples/progress-bar/statuses';
import statusesSource from './examples/progress-bar/statuses?raw';
import TypesExample from './examples/progress-bar/types';
import typesSource from './examples/progress-bar/types?raw';
import UsageMetersExample from './examples/progress-bar/usage-meters';
import usageMetersSource from './examples/progress-bar/usage-meters?raw';
import { ProgressBar } from './ProgressBar';
import type { ProgressBarStatus, ProgressBarType } from './ProgressBar.types';

const statuses: ProgressBarStatus[] = ['default', 'neutral', 'warning', 'success', 'error'];
const types: ProgressBarType[] = ['bar', 'circle'];

const usageContent: Partial<Record<ProgressBarStatus, { label: string; description: string }>> = {
  neutral: { label: 'Storage', description: '100 GB included in your plan' },
  warning: { label: 'API calls', description: 'Calls stop when you reach your monthly limit' },
};

const useSteppedValue = () => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const steps = [0, 30, 40, 70, 100];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % steps.length;
      setValue(steps[index]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return value;
};

const meta = {
  title: 'Components/ProgressBar',
  tags: ['autodocs'],
  component: ProgressBar,
  subcomponents: {
    'ProgressBar.Header': ProgressBar.Header,
    'ProgressBar.Label': ProgressBar.Label,
    'ProgressBar.Value': ProgressBar.Value,
    'ProgressBar.Track': ProgressBar.Track,
    'ProgressBar.Description': ProgressBar.Description,
  },
  parameters: {
    docs: {
      description: {
        component: `ProgressBar shows how far a task has progressed or how much of a limit is used.
Two display types are available:
- \`bar\` — a horizontal progress track with an optional label, value and helper text
- \`circle\` — a compact inline circular indicator; replaces the ring with an icon on success / error

Use ProgressTracker for progress through discrete steps.

**Optional Composition:**
\`\`\`
<ProgressBar value={32} max={40}>
  <ProgressBar.Header>
    <ProgressBar.Label />
    <ProgressBar.Value />
  </ProgressBar.Header>
  <ProgressBar.Track />
  <ProgressBar.Description />
</ProgressBar>
\`\`\``,
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      table: {
        category: 'Content',
        type: { summary: 'number' },
      },
    },
    max: {
      control: { type: 'number', min: 1, step: 1 },
      table: {
        category: 'Content',
        type: { summary: 'number' },
        defaultValue: { summary: '100' },
      },
    },
    type: {
      control: 'radio',
      options: types,
      table: {
        category: 'Appearance',
        type: { summary: "'bar' | 'circle'" },
        defaultValue: { summary: 'bar' },
      },
    },
    status: {
      control: 'radio',
      options: statuses,
      table: {
        category: 'Appearance',
        type: { summary: statuses.map((status) => `'${status}'`).join(' | ') },
        defaultValue: { summary: 'default' },
      },
    },
    children: {
      control: false,
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    asChild: {
      control: false,
      table: { category: 'Behavior', type: { summary: 'boolean' } },
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // The playground controls the root; the parts are fixed here.
  render: ({ type, status = 'default', value, max }) => {
    const { label, description } = usageContent[status] ?? {
      label: 'Uploading assets',
      description: '12 of 18 files uploaded',
    };

    return (
      <div className="max-w-80">
        {type === 'circle' ? (
          <ProgressBar type="circle" status={status} value={value} max={max} aria-label={label}>
            <ProgressBar.Value />
            <ProgressBar.Track />
          </ProgressBar>
        ) : (
          <ProgressBar type="bar" status={status} value={value} max={max}>
            <ProgressBar.Header>
              <ProgressBar.Label>{label}</ProgressBar.Label>
              <ProgressBar.Value />
            </ProgressBar.Header>
            <ProgressBar.Track />
            <ProgressBar.Description>{description}</ProgressBar.Description>
          </ProgressBar>
        )}
      </div>
    );
  },
  args: {
    type: 'bar',
    status: 'default',
    value: 33,
  },
};

export const Types: Story = exampleStory(TypesExample, typesSource);

export const Statuses: Story = exampleStory(StatusesExample, statusesSource);

export const UsageMeters: Story = exampleStory(UsageMetersExample, usageMetersSource);

export const Composition: Story = exampleStory(CompositionExample, compositionSource);

export const Animated: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The bar and the ring transition smoothly between values. The circle\'s percentage reserves room for "100%", so the ring does not move.',
      },
    },
    controls: { disable: true },
  },
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const value = useSteppedValue();

    return (
      <div className="gap-ws-12 flex max-w-80 flex-col">
        <ProgressBar value={value}>
          <ProgressBar.Header>
            <ProgressBar.Label>Uploading assets</ProgressBar.Label>
            <ProgressBar.Value />
          </ProgressBar.Header>
          <ProgressBar.Track />
        </ProgressBar>
        <ProgressBar type="circle" value={value} aria-label="Uploading assets">
          <ProgressBar.Value />
          <ProgressBar.Track />
        </ProgressBar>
      </div>
    );
  },
};

export const CircleStatuses: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `ProgressBar.Value` alongside the track to show the percentage. Default, neutral and warning use a coloured ring. Success shows a check icon and error shows an error icon.',
      },
    },
    controls: { disable: true },
  },
  render: () => (
    <div className="gap-ws-8 flex flex-col">
      {statuses.map((status) => (
        <ProgressBar
          key={status}
          type="circle"
          status={status}
          value={75}
          aria-label={`Upload, ${status}`}
        >
          <ProgressBar.Value />
          <ProgressBar.Track />
        </ProgressBar>
      ))}
    </div>
  ),
};
